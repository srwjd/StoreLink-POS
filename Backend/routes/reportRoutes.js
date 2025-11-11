import express from "express";
import { getSummary, getSalesChart, getTopProducts, getRecentOrders } from "../controllers/reportController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ สรุปยอดรวม
router.get("/summary/:storeId", requireAuth, getSummary);

// ✅ กราฟยอดขาย
router.get("/sales-chart/:storeId", requireAuth, getSalesChart);

// ✅ สินค้าขายดี
router.get("/top-products/:storeId", requireAuth, getTopProducts);

// ✅ รายการล่าสุด
router.get("/recent/:storeId", requireAuth, getRecentOrders);

export default router;
