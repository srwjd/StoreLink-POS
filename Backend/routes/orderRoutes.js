import express from "express";
import { createOrder, getOrdersByStore } from "../controllers/orderController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

// สร้าง order
router.post("/create", requireAuth, createOrder);

// ดึงประวัติของร้าน
router.get("/store/:storeId", requireAuth, getOrdersByStore);

export default router;
