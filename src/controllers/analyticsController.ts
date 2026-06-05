import { Request, Response } from "express";
import { prisma } from "../config/database";
import { logger } from "../utils/logger";

export async function getDashboardStats(req: Request, res: Response) {
  try {
    const [
      totalUsers,
      totalJobs,
      activeJobs,
      totalApplications,
      pendingApplications,
      hiredApplications,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.job.count(),
      prisma.job.count({ where: { isActive: true } }),
      prisma.application.count(),
      prisma.application.count({ where: { status: "PENDING" } }),
      prisma.application.count({ where: { status: "HIRED" } }),
    ]);

    // Applications by status
    const applicationsByStatus = await prisma.application.groupBy({
      by: ["status"],
      _count: { status: true },
    });

    // Applications over time (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const applicationsOverTime = await prisma.application.groupBy({
      by: ["createdAt"],
      where: {
        createdAt: { gte: thirtyDaysAgo },
      },
      _count: { id: true },
    });

    // Jobs by department
    const jobsByDepartment = await prisma.job.groupBy({
      by: ["department"],
      _count: { id: true },
    });

    res.json({
      overview: {
        totalUsers,
        totalJobs,
        activeJobs,
        totalApplications,
        pendingApplications,
        hiredApplications,
      },
      applicationsByStatus,
      applicationsOverTime,
      jobsByDepartment,
    });
  } catch (error) {
    logger.error("Get dashboard stats error:", error);
    res.status(500).json({ error: "Failed to fetch analytics" });
  }
}

export async function getWorkforceMetrics(req: Request, res: Response) {
  try {
    const workersByRole = await prisma.user.groupBy({
      by: ["role"],
      _count: { role: true },
    });

    const recentApplications = await prisma.application.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: {
        job: { select: { title: true } },
      },
    });

    res.json({
      workersByRole,
      recentApplications,
    });
  } catch (error) {
    logger.error("Get workforce metrics error:", error);
    res.status(500).json({ error: "Failed to fetch workforce metrics" });
  }
}
