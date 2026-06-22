import { Request, Response } from "express";
import { prisma } from "../config/database";
import { logger } from "../utils/logger";
import { AuthRequest } from "../middleware/auth";
import { sendApplicationConfirmation, sendInterviewInvitation } from "../utils/email";

export async function getAllApplications(req: AuthRequest, res: Response) {
  try {
    const { status, jobId } = req.query;

    const where: any = {};
    if (status) where.status = status as string;
    if (jobId) where.jobId = jobId as string;

    const applications = await prisma.application.findMany({
      where,
      include: {
        job: {
          select: { title: true, department: true },
        },
        user: {
          select: { firstName: true, lastName: true, email: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(applications);
  } catch (error) {
    logger.error("Get applications error:", error);
    res.status(500).json({ error: "Failed to fetch applications" });
  }
}

export async function getMyApplications(req: AuthRequest, res: Response) {
  try {
    const applications = await prisma.application.findMany({
      where: { userId: req.user!.id },
      include: {
        job: {
          select: { title: true, department: true, location: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(applications);
  } catch (error) {
    logger.error("Get my applications error:", error);
    res.status(500).json({ error: "Failed to fetch applications" });
  }
}

export async function createApplication(req: Request, res: Response) {
  try {
    const { jobId, firstName, lastName, email, phone, linkedIn, coverLetter } = req.body;
    const resumeUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    const application = await prisma.application.create({
      data: {
        jobId,
        firstName,
        lastName,
        email,
        phone,
        linkedIn,
        resumeUrl,
        coverLetter,
      },
    });

    // CLAUDE's DEBUG LOG:
    console.log('>>> Triggering confirmation email for:', email);

    // Send confirmation email
    try {
      await sendApplicationConfirmation(email, `${firstName} ${lastName}`, job.title);
      console.log('>>> Confirmation email function executed without crashing');
    } catch (emailError) {
      console.error(">>> Failed inside the email function block:", emailError);
      logger.error("Failed to send confirmation email:", emailError);
    }

    logger.info(`Application created: ${application.id} for job ${jobId}`);
    res.status(201).json(application);
  } catch (error) {
    logger.error("Create application error:", error);
    res.status(500).json({ error: "Failed to create application" });
  }
}

export async function updateApplicationStatus(req: AuthRequest, res: Response) {
  try {
    const id = req.params.id as string; 
    const { status, notes } = req.body;

    const application = await prisma.application.update({
      where: { id },
      data: { status, notes },
      include: {
        job: { select: { title: true } },
      },
    });

    // Send interview invitation if status changed to INTERVIEW
    if (status === "INTERVIEW") {
      // CLAUDE's DEBUG LOG:
      console.log('>>> Triggering interview invite for:', application.email);
      
      try {
        const jobTitle = (application as any).job?.title || "the role";

        await sendInterviewInvitation(
          application.email,
          `${application.firstName} ${application.lastName}`,
          jobTitle,
          new Date().toLocaleDateString()
        );
        console.log('>>> Interview email function executed without crashing');
      } catch (emailError) {
        console.error(">>> Failed inside the interview email block:", emailError);
        logger.error("Failed to send interview email:", emailError);
      }
    }

    logger.info(`Application ${id} status updated to ${status}`);
    res.json(application);
  } catch (error) {
    logger.error("Update application error:", error);
    res.status(500).json({ error: "Failed to update application" });
  }
}

export async function deleteApplication(req: AuthRequest, res: Response) {
  try {
    const id = req.params.id as string; 
    await prisma.application.delete({ where: { id } });
    logger.info(`Application deleted: ${id}`);
    res.json({ message: "Application deleted successfully" });
  } catch (error) {
    logger.error("Delete application error:", error);
    res.status(500).json({ error: "Failed to delete application" });
  }
}
