import { Router } from "express";
import {
  getAllApplications,
  getMyApplications,
  createApplication,
  updateApplicationStatus,
  deleteApplication,
} from "../controllers/applicationController";
import { authenticateToken, authorizeRoles, optionalAuth } from "../middleware/auth";
import { upload } from "../middleware/upload";
import { applicationValidation } from "../middleware/validator";

const router = Router();

// TEMPORARILY unlocked for development so the Admin Dashboard can fetch data without logging in yet
router.get("/", getAllApplications);

router.get("/my", authenticateToken, getMyApplications);
router.post("/", upload.single("resume"), applicationValidation, createApplication);
router.put("/:id/status", authenticateToken, authorizeRoles("ADMIN", "HR"), updateApplicationStatus);
router.delete("/:id", authenticateToken, authorizeRoles("ADMIN", "HR"), deleteApplication);

export default router;