import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import path from "path";

import { env } from "./config/env";
import { logger } from "./utils/logger";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";

// Routes
import authRoutes from "./routes/authRoutes";
import jobRoutes from "./routes/jobRoutes";
import applicationRoutes from "./routes/applicationRoutes";
import analyticsRoutes from "./routes/analyticsRoutes";
import contactRoutes from "./routes/contactRoutes";

const app = express();

// Security middleware
app.enable('trust proxy');
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === "production" 
    ? [
        "https://AloraBridge.com", 
        "https://www.AloraBridge.com", 
        "https://alorabridge-frontend-ekz1.vercel.app",
        "https://alorabridge-frontend-y58t-m3bqt5t2v-shmurda9s-projects.vercel.app",
        "https://alorabridge-frontend-y58t.vercel.app",
        "http://localhost:3000"
      ] 
    : "*",
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
  validate: { trustProxy: false }, // 👈 ADD THIS LINE HERE TO FIX THE CRASH
});
app.use("/api/", limiter);

// Body parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Compression
app.use(compression());

// Logging
app.use(morgan("combined", { stream: { write: (message) => logger.info(message.trim()) } }));

// Static files
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/contact", contactRoutes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

const PORT = parseInt(env.PORT);

app.listen(PORT, () => {
  // Added the missing backticks here so the variables work properly
  logger.info(`🚀 Server running on port ${PORT} in ${env.NODE_ENV} mode`);
});

export default app;