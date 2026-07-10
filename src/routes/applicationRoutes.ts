import { Router } from "express";
import {
  getAllApplications,
  getMyApplications,
  createApplication,
  updateApplicationStatus,
  deleteApplication,
} from "../controllers/applicationController";
import { authenticateToken, authorizeRoles, optionalAuth } from "../middleware/auth";

// 🚀 CHANGED: Pointing to your new Cloudinary config instead of the old local upload
import { upload } from "../config/cloudinaryConfig"; 

import { applicationValidation } from "../middleware/validator";

const router = Router();

// TEMPORARILY unlocked for development so the Admin Dashboard can fetch data without logging in yet
router.get("/", getAllApplications);

router.get("/my", authenticateToken, getMyApplications);

// The upload middleware now automatically sends the file to Cloudinary!
router.post("/", upload.single("resume"), applicationValidation, createApplication);

router.put("/:id/status", authenticateToken, authorizeRoles("ADMIN", "HR"), updateApplicationStatus);
router.delete("/:id", authenticateToken, authorizeRoles("ADMIN", "HR"), deleteApplication);

export default router;