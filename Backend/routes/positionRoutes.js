import express from "express";
import { requireAuth } from "../middleware/authMiddleware.js";
import { getPositions, createPosition, updatePosition, deletePosition, getPositionById } from "../controllers/positionController.js";

const router = express.Router();

router.get("/:storeId", requireAuth, getPositions);
router.post("/create/:storeId", requireAuth, createPosition);
router.put("/update/:id", requireAuth, updatePosition);
router.delete("/delete/:id", requireAuth, deletePosition);
router.get("/detail/:id", requireAuth, getPositionById);


export default router;
