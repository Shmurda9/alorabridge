import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

// Force load the .env variables right here before Prisma wakes up
dotenv.config();

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Explicitly inject the URL to bypass any Next.js/Node hot-reloading cache
export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;