import express from "express";
import { requireAuth } from "../middleware/authMiddleware.js";
import { requirePermission } from "../middleware/permissionMiddleware.js";
import { getEmployees, createEmployee } from "../controllers/employeeController.js";

const router = express.Router();

router.get("/:storeId", requireAuth, requirePermission("manage_employees"), getEmployees);
router.post("/createEmployee/:storeId", requireAuth, requirePermission("manage_employees"), createEmployee);

export default router;
