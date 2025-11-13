import express from "express";
import {
    createOrder,
    addItemToOrder,
    payOrder,
    getReceipt,
    cancelReceipt,
    getAllReceipts,
    getKitchenOrders,
    updateKitchenStatus,
} from "../controllers/orderController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

// endpoint /orders

// เปิดบิลใหม่
router.post("/create", requireAuth, createOrder);
// เพิ่มสินค้าในบิล
router.put("/:orderId/add-item", requireAuth, addItemToOrder);
// ชําระเงิน
router.put("/:orderId/pay", requireAuth, payOrder);
// ดูใบเสร็จ
router.get("/:orderId/receipt", requireAuth, getReceipt);
//ยกเลิกออเดอร์
router.put("/:orderId/cancel", requireAuth, cancelReceipt);
// ดึงประวัติการขายของร้าน
router.get("/:storeId/all-receipts", requireAuth, getAllReceipts);
// ดึงออเดอร์ที่อยู่ในแถว
router.get("/:storeId/kitchen-orders", requireAuth, getKitchenOrders);
// อัปเดตสถานะออเดอร์ในแถว
router.put("/:orderId/kitchen-status", requireAuth, updateKitchenStatus);

export default router;