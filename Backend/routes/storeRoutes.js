import express from "express";
import { requireAuth } from "../middleware/authMiddleware.js";
import { createStore, getMyStores, getStoreById, updateStore } from "../controllers/storeController.js";

const router = express.Router();

router.post("/create-store", requireAuth, createStore);
router.get("/my-stores", requireAuth, getMyStores);
router.get("/:id", requireAuth, getStoreById);
router.put("/update/:id", requireAuth, updateStore);

/**
 * @swagger
 * tags:
 *   name: Stores
 *   description: การจัดการร้านค้า (Store Management)
 */

/**
 * @swagger
 * /stores/create-store:
 *   post:
 *     summary: สร้างร้านค้าใหม่
 *     tags: [Stores]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               storeName:
 *                 type: string
 *                 example: ร้านน้องพลอย POS
 *               storeType:
 *                 type: string
 *                 enum: [general, restaurant, service]
 *                 example: restaurant
 *               phone:
 *                 type: string
 *                 example: "0812345678"
 *               address:
 *                 type: string
 *                 example: "123 ถนนสุขุมวิท กรุงเทพฯ"
 *     responses:
 *       201:
 *         description: ✅ ร้านถูกสร้างเรียบร้อยแล้ว
 *       400:
 *         description: ❌ ข้อมูลไม่ถูกต้อง
 *       500:
 *         description: ❌ เซิร์ฟเวอร์ผิดพลาด
 */

/**
 * @swagger
 * /stores/my-stores:
 *   get:
 *     summary: ดึงข้อมูลร้านค้าทั้งหมดของผู้ใช้งาน
 *     tags: [Stores]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: ✅ ดึงข้อมูลร้านค้าสำเร็จ
 *       401:
 *         description: ❌ ไม่พบสิทธิ์เข้าถึง
 *       500:
 *         description: ❌ เซิร์ฟเวอร์ผิดพลาด
 */

/**
 * @swagger
 * /stores/{id}:
 *   get:
 *     summary: ดึงรายละเอียดร้านค้าตาม ID
 *     tags: [Stores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: รหัสร้านค้า
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: ✅ ดึงข้อมูลร้านค้าสำเร็จ
 *       404:
 *         description: ❌ ไม่พบร้านค้า
 *       500:
 *         description: ❌ เซิร์ฟเวอร์ผิดพลาด
 */

/**
 * @swagger
 * /stores/update/{id}:
 *   put:
 *     summary: อัปเดตรายละเอียดร้านค้า
 *     tags: [Stores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: รหัสร้านค้า
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               storeName:
 *                 type: string
 *                 example: ร้านน้องพลอยอัปเดต
 *               phone:
 *                 type: string
 *                 example: "0899999999"
 *               address:
 *                 type: string
 *                 example: "456 ถนนพระราม 9 กรุงเทพฯ"
 *     responses:
 *       200:
 *         description: ✅ อัปเดตร้านค้าสำเร็จ
 *       404:
 *         description: ❌ ไม่พบร้านค้า
 *       500:
 *         description: ❌ เซิร์ฟเวอร์ผิดพลาด
 */


export default router;
