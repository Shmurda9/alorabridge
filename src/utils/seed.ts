import { prisma } from "../config/database";
import bcrypt from "bcryptjs";
import { logger } from "./logger";

async function seed() {
  try {
    // Create admin user
    const adminPassword = await bcrypt.hash("Admin123!", 12);
    const admin = await prisma.user.upsert({
      where: { email: "admin@AloraBridge.com" },
      update: {},
      create: {
        email: "admin@AloraBridge.com",
        password: adminPassword,
        firstName: "Admin",
        lastName: "User",
        role: "ADMIN",
      },
    });
    logger.info(`Admin user created: ${admin.email}`);

    // Create HR user
    const hrPassword = await bcrypt.hash("Hr123!", 12);
    const hr = await prisma.user.upsert({
      where: { email: "hr@AloraBridge.com" },
      update: {},
      create: {
        email: "hr@AloraBridge.com",
        password: hrPassword,
        firstName: "HR",
        lastName: "Manager",
        role: "HR",
      },
    });
    logger.info(`HR user created: ${hr.email}`);

    // Create sample jobs
    const jobs = [
      {
        title: "Customer Support Agent",
        department: "Customer Support",
        location: "Remote",
        type: "Full-time",
        salary: "$35,000 - $50,000",
        description: "Provide exceptional customer support via email, chat, and phone for our enterprise clients.",
        requirements: ["2+ years customer support experience", "Excellent written and verbal communication", "Experience with CRM systems"],
      },
      {
        title: "Technical Support Specialist",
        department: "Technical Support",
        location: "Remote",
        type: "Full-time",
        salary: "$45,000 - $65,000",
        description: "Provide L2-L3 technical support for SaaS and technology products.",
        requirements: ["3+ years technical support experience", "Strong understanding of APIs, web technologies", "Experience with ticketing systems"],
      },
      {
        title: "Virtual Assistant",
        department: "Administrative",
        location: "Remote",
        type: "Full-time / Part-time",
        salary: "$30,000 - $45,000",
        description: "Support executives and teams with administrative tasks, scheduling, and research.",
        requirements: ["2+ years administrative experience", "Proficiency in Google Workspace / Microsoft Office", "Strong organizational skills"],
      },
      {
        title: "Sales Operations Specialist",
        department: "Sales",
        location: "Remote",
        type: "Full-time",
        salary: "$40,000 - $60,000",
        description: "Support sales teams with lead qualification, CRM management, and pipeline operations.",
        requirements: ["2+ years sales support experience", "CRM experience (Salesforce, HubSpot)", "Strong communication skills"],
      },
    ];

    for (const jobData of jobs) {
      const job = await prisma.job.create({ data: jobData });
      logger.info(`Job created: ${job.title}`);
    }

    logger.info("✅ Database seeded successfully!");
    logger.info("Default credentials:");
    logger.info("Admin: admin@AloraBridge.com / Admin123!");
    logger.info("HR: hr@AloraBridge.com / Hr123!");
  } catch (error) {
    logger.error("Seed error:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
