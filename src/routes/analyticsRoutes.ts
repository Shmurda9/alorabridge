import { Router } from "express";
import { getDashboardStats, getWorkforceMetrics } from "../controllers/analyticsController";
import { authenticateToken, authorizeRoles } from "../middleware/auth";

const router = Router();

router.get("/dashboard", authenticateToken, authorizeRoles("ADMIN", "HR"), getDashboardStats);
router.get("/workforce", authenticateToken, authorizeRoles("ADMIN", "HR"), getWorkforceMetrics);

export default router;
