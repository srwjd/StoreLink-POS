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

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: จัดการคำสั่งซื้อ ใบเสร็จ และสถานะห้องครัว
 */

/**
 * @swagger
 * /orders/create:
 *   post:
 *     summary: สร้างออเดอร์ใหม่ (เปิดบิล)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               storeId:
 *                 type: string
 *               userId:
 *                 type: string
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: string
 *                     name:
 *                       type: string
 *                     qty:
 *                       type: number
 *                     price:
 *                       type: number
 *               subTotal:
 *                 type: number
 *               tax:
 *                 type: number
 *               total:
 *                 type: number
 *               paymentMethod:
 *                 type: string
 *                 example: cash
 *               isInstantPay:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       201:
 *         description: ✅ สร้างออเดอร์สำเร็จ
 *       400:
 *         description: ❌ ข้อมูลไม่ถูกต้อง
 *       500:
 *         description: ❌ เซิร์ฟเวอร์ผิดพลาด
 */

/**
 * @swagger
 * /orders/{orderId}/add-item:
 *   put:
 *     summary: เพิ่มสินค้าเข้าในบิลที่เปิดอยู่(ยังไม่ทำ)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: orderId
 *         in: path
 *         required: true
 *         description: รหัสออเดอร์
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *               qty:
 *                 type: number
 *     responses:
 *       200:
 *         description: ✅ เพิ่มสินค้าในบิลสำเร็จ
 *       404:
 *         description: ❌ ไม่พบออเดอร์
 *       500:
 *         description: ❌ เซิร์ฟเวอร์ผิดพลาด
 */

/**
 * @swagger
 * /orders/{orderId}/pay:
 *   put:
 *     summary: ชำระเงินสำหรับออเดอร์
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: orderId
 *         in: path
 *         required: true
 *         description: รหัสออเดอร์
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               paymentMethod:
 *                 type: string
 *               paidAmount:
 *                 type: number
 *               changeAmount:
 *                 type: number
 *     responses:
 *       200:
 *         description: ✅ ชำระเงินสำเร็จ
 *       400:
 *         description: ❌ ข้อมูลไม่ถูกต้อง
 *       404:
 *         description: ❌ ไม่พบออเดอร์
 */

/**
 * @swagger
 * /orders/{orderId}/receipt:
 *   get:
 *     summary: ดึงข้อมูลใบเสร็จของออเดอร์
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: orderId
 *         in: path
 *         required: true
 *         description: รหัสออเดอร์
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: ✅ ดึงใบเสร็จสำเร็จ
 *       404:
 *         description: ❌ ไม่พบออเดอร์
 *       500:
 *         description: ❌ เซิร์ฟเวอร์ผิดพลาด
 */

/**
 * @swagger
 * /orders/{orderId}/cancel:
 *   put:
 *     summary: ยกเลิกออเดอร์(ยังไม่ทำ)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: orderId
 *         in: path
 *         required: true
 *         description: รหัสออเดอร์
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: ✅ ยกเลิกออเดอร์สำเร็จ
 *       404:
 *         description: ❌ ไม่พบออเดอร์
 *       500:
 *         description: ❌ เซิร์ฟเวอร์ผิดพลาด
 */

/**
 * @swagger
 * /orders/{storeId}/all-receipts:
 *   get:
 *     summary: ดึงใบเสร็จทั้งหมดของร้านค้า
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: storeId
 *         in: path
 *         required: true
 *         description: รหัสร้านค้า
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: ✅ ดึงข้อมูลใบเสร็จสำเร็จ
 *       500:
 *         description: ❌ เซิร์ฟเวอร์ผิดพลาด
 */


/**
 * @swagger
 * /orders/{orderId}/kitchen-status:
 *   put:
 *     summary: อัปเดตสถานะของออเดอร์ในห้องครัว
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: orderId
 *         in: path
 *         required: true
 *         description: รหัสออเดอร์
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               kitchenStatus:
 *                 type: string
 *                 enum: [waiting, cooking, done]
 *     responses:
 *       200:
 *         description: ✅ อัปเดตสถานะครัวสำเร็จ
 *       400:
 *         description: ❌ ข้อมูลไม่ถูกต้อง
 *       404:
 *         description: ❌ ไม่พบออเดอร์
 */


export default router;