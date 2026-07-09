import { Request, Response } from "express";
import { prisma } from "../config/database";
import { logger } from "../utils/logger";
import { AuthRequest } from "../middleware/auth";
import { 
  sendApplicationConfirmation, 
  sendUnderReviewEmail,
  sendInterviewInvitation,
  sendInterviewCompletedEmail,
  sendApprovedEmail,
  sendHROnboarding,
  sendOpsOnboardingCandidateEmail,
  sendOperationsInternalAlert,
  sendEmployeeActiveEmail,
  sendRejectionEmail 
} from "../utils/email";

// 1. Get All Applications
export async function getAllApplications(req: Request, res: Response) {
  try {
    const { status, jobId } = req.query;
    const where: any = {};
    if (status) where.status = status as string;
    if (jobId) where.jobId = jobId as string;

    const applications = await prisma.application.findMany({
      where,
      include: {
        job: { select: { title: true, department: true } },
        user: { select: { firstName: true, lastName: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(applications);
  } catch (error) {
    logger.error("Failed to fetch all applications:", error);
    res.status(500).json({ error: "Failed to fetch applications" });
  }
}

// 2. Get My Applications
export async function getMyApplications(req: AuthRequest, res: Response) {
  try {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });
    
    const applications = await prisma.application.findMany({
      where: { userId: req.user.id },
      include: { job: { select: { title: true, department: true, location: true } } },
      orderBy: { createdAt: "desc" },
    });
    res.json(applications);
  } catch (error) {
    logger.error("Failed to fetch candidate applications:", error);
    res.status(500).json({ error: "Failed to fetch applications" });
  }
}

// 3. Create Application
export async function createApplication(req: Request, res: Response) {
  try {
    const { jobId, firstName, lastName, email, phone, linkedIn, coverLetter } = req.body;
    // Fixed missing backticks around the template literal
    const resumeUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (!job) return res.status(404).json({ error: "Job not found" });

    const application = await prisma.application.create({
      data: { jobId, firstName, lastName, email, phone, linkedIn, resumeUrl, coverLetter },
    });

    try {
      // Fixed missing backticks around firstName and lastName
      await sendApplicationConfirmation(email, `${firstName} ${lastName}`, job.title);
    } catch (emailError) {
      logger.error("Failed to send confirmation email:", emailError);
    }

    res.status(201).json(application);
  } catch (error) {
    logger.error("Failed to create application:", error);
    res.status(500).json({ error: "Failed to create application" });
  }
}

// 4. Update Application Status
export async function updateApplicationStatus(req: AuthRequest, res: Response) {
  try {
    const id = req.params.id as string; 
    const { status, notes } = req.body;
    
    // --> THIS IS THE SAFE SPOT FOR THE LOG <--
    console.log("RECEIVED FROM FRONTEND:", req.body);

    const application = await prisma.application.update({
      where: { id },
      data: { status: status as any, notes },
      include: { job: { select: { title: true } } }
    });

    // Fixed missing OR operator (||)
    const jobTitle = (application as any).job?.title || "the role";
    const candidateName = `${application.firstName} ${application.lastName}`;
    const candidateEmail = application.email;

    try {
      if (status === "UNDER_REVIEW") {
        await sendUnderReviewEmail(candidateEmail, candidateName, jobTitle);
      } 
      else if (status === "INTERVIEW_SCHEDULED") {
        await sendInterviewInvitation(candidateEmail, candidateName, jobTitle);
      } 
      else if (status === "INTERVIEW_COMPLETED") {
        await sendInterviewCompletedEmail(candidateEmail, candidateName, jobTitle);
      } 
      else if (status === "APPROVED") {
        await sendApprovedEmail(candidateEmail, candidateName, jobTitle);
      } 
      else if (status === "HR_ONBOARDING") {
        await sendHROnboarding(candidateEmail, candidateName, jobTitle);
      } 
      else if (status === "OPS_ONBOARDING") {
        await sendOpsOnboardingCandidateEmail(candidateEmail, candidateName, jobTitle);
        await sendOperationsInternalAlert(candidateName, jobTitle);
      }
      else if (status === "EMPLOYEE_ACTIVE") {
        await sendEmployeeActiveEmail(candidateEmail, candidateName, jobTitle);
      } 
      // Fixed missing OR operator (||)
      else if (status === "DECLINED" || status === "REJECTED") {
        await sendRejectionEmail(candidateEmail, candidateName, jobTitle);
      }
    } catch (emailError) {
      // Fixed missing backticks
      logger.error(`Failed to send email for status ${status}:`, emailError);
    }

    res.json(application);
  } catch (error) {
    logger.error("Failed to update application status:", error);
    res.status(500).json({ error: "Failed to update application" });
  }
}

// 5. Delete Application
export async function deleteApplication(req: AuthRequest, res: Response) {
  try {
    const id = req.params.id as string; 
    await prisma.application.delete({ where: { id } });
    res.json({ message: "Application deleted successfully" });
  } catch (error) {
    logger.error("Failed to delete application:", error);
    res.status(500).json({ error: "Failed to delete application" });
  }
}
