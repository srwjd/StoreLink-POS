import express from "express";
import { requireAuth } from "../middleware/authMiddleware.js";
import { requirePermission } from "../middleware/permissionMiddleware.js";
import { getPositions, createPosition, updatePosition, deletePosition } from "../controllers/positionController.js";

const router = express.Router();

router.get("/:storeId", requireAuth, getPositions);
router.post("/create/:storeId", requireAuth, createPosition);
router.put("/update/:id", requireAuth, updatePosition);
router.delete("/delete/:id", requireAuth, deletePosition);

export default router;
