import { Request, Response } from "express";
import { prisma } from "../config/database";
import { logger } from "../utils/logger";
import { AuthRequest } from "../middleware/auth";

export async function getAllJobs(req: Request, res: Response) {
  try {
    const { department, type, search } = req.query;

    const where: any = { isActive: true };

    if (department) where.department = department as string;
    if (type) where.type = type as string;
    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: "insensitive" } },
        { description: { contains: search as string, mode: "insensitive" } },
      ];
    }

    const jobs = await prisma.job.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { applications: true },
        },
      },
    });

    res.json(jobs);
  } catch (error) {
    logger.error("Get jobs error:", error);
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
}

export async function getJobById(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const job = await prisma.job.findUnique({
      where: { id },
      include: {
        applications: {
          select: {
            id: true,
            status: true,
            createdAt: true,
          },
        },
      },
    });

    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    res.json(job);
  } catch (error) {
    logger.error("Get job error:", error);
    res.status(500).json({ error: "Failed to fetch job" });
  }
}

export async function createJob(req: AuthRequest, res: Response) {
  try {
    const { title, department, location, type, salary, description, requirements } = req.body;

    const job = await prisma.job.create({
      data: {
        title,
        department,
        location: location || "Remote",
        type: type || "Full-time",
        salary,
        description,
        requirements: requirements || [],
      },
    });

    logger.info(`Job created: ${job.id}`);
    res.status(201).json(job);
  } catch (error) {
    logger.error("Create job error:", error);
    res.status(500).json({ error: "Failed to create job" });
  }
}

export async function updateJob(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    const { title, department, location, type, salary, description, requirements, isActive } = req.body;

    const job = await prisma.job.update({
      where: { id },
      data: {
        title,
        department,
        location,
        type,
        salary,
        description,
        requirements,
        isActive,
      },
    });

    logger.info(`Job updated: ${id}`);
    res.json(job);
  } catch (error) {
    logger.error("Update job error:", error);
    res.status(500).json({ error: "Failed to update job" });
  }
}

export async function deleteJob(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;

    await prisma.job.delete({ where: { id } });
    logger.info(`Job deleted: ${id}`);
    res.json({ message: "Job deleted successfully" });
  } catch (error) {
    logger.error("Delete job error:", error);
    res.status(500).json({ error: "Failed to delete job" });
  }
}
