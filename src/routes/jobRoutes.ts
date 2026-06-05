import { Router } from "express";
import {
  getAllJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
} from "../controllers/jobController";
import { authenticateToken, authorizeRoles } from "../middleware/auth";

const router = Router();

// Public routes
router.get("/", getAllJobs);
router.get("/:id", getJobById);

// Secured routes - requires admin login token
router.post("/", authenticateToken, authorizeRoles("ADMIN", "HR"), createJob);
router.put("/:id", authenticateToken, authorizeRoles("ADMIN", "HR"), updateJob);
router.delete("/:id", authenticateToken, authorizeRoles("ADMIN", "HR"), deleteJob);

export default router;