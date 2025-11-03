import express from "express";
import { requireAuth } from "../middleware/authMiddleware.js";
import { requirePermission } from "../middleware/permissionMiddleware.js";
import {
    getEmployees, 
    createEmployee, 
    updateEmployee,
    deleteEmployee
} from "../controllers/employeeController.js";

const router = express.Router();

router.get("/:storeId", requireAuth, requirePermission("manage_employees"), getEmployees);
router.post("/create/:storeId", requireAuth, requirePermission("manage_employees"), createEmployee);
router.put("/update/:id", requireAuth, requirePermission("manage_employees"), updateEmployee);
router.delete("/delete/:id", requireAuth, requirePermission("manage_employees"), deleteEmployee);

export default router;
