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

/**
 * @swagger
 * tags:
 *   name: Reports
 *   description: ดึงข้อมูลสรุปยอดขายและรายงานต่าง ๆ ของร้านค้า
 */

/**
 * @swagger
 * /reports/summary/{storeId}:
 *   get:
 *     summary: ดึงข้อมูลสรุปยอดรวมรายวันของร้าน
 *     tags: [Reports]
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
 *         description: ✅ ดึงข้อมูลสรุปยอดขายสำเร็จ
 *       401:
 *         description: ❌ ไม่มีสิทธิ์เข้าถึง
 *       500:
 *         description: ❌ เซิร์ฟเวอร์ผิดพลาด
 */

/**
 * @swagger
 * /reports/sales-chart/{storeId}:
 *   get:
 *     summary: ดึงข้อมูลยอดขายแบบกราฟ (รายวัน/รายเดือน)
 *     tags: [Reports]
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
 *         description: ✅ ดึงข้อมูลกราฟยอดขายสำเร็จ
 *       401:
 *         description: ❌ ไม่มีสิทธิ์เข้าถึง
 *       500:
 *         description: ❌ เซิร์ฟเวอร์ผิดพลาด
 */

/**
 * @swagger
 * /reports/top-products/{storeId}:
 *   get:
 *     summary: ดึงข้อมูลสินค้าขายดี
 *     tags: [Reports]
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
 *         description: ✅ ดึงข้อมูลสินค้าขายดีสำเร็จ
 *       401:
 *         description: ❌ ไม่มีสิทธิ์เข้าถึง
 *       500:
 *         description: ❌ เซิร์ฟเวอร์ผิดพลาด
 */

/**
 * @swagger
 * /reports/recent/{storeId}:
 *   get:
 *     summary: ดึงรายการออเดอร์ล่าสุดของร้าน
 *     tags: [Reports]
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
 *         description: ✅ ดึงรายการออเดอร์ล่าสุดสำเร็จ
 *       401:
 *         description: ❌ ไม่มีสิทธิ์เข้าถึง
 *       500:
 *         description: ❌ เซิร์ฟเวอร์ผิดพลาด
 */


export default router;
