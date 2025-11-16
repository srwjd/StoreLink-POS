import express from "express";
import { requireAuth } from "../middleware/authMiddleware.js";
import { getPositions, createPosition, updatePosition, deletePosition, getPositionById } from "../controllers/positionController.js";

const router = express.Router();

router.get("/:storeId", requireAuth, getPositions);
router.post("/create/:storeId", requireAuth, createPosition);
router.put("/update/:id", requireAuth, updatePosition);
router.delete("/delete/:id", requireAuth, deletePosition);
router.get("/detail/:id", requireAuth, getPositionById);


/**
 * @swagger
 * tags:
 *   name: Positions
 *   description: จัดการตำแหน่งและสิทธิ์ของพนักงานในร้านค้า
 */

/**
 * @swagger
 * /positions/{storeId}:
 *   get:
 *     summary: ดึงข้อมูลตำแหน่งทั้งหมดในร้าน
 *     tags: [Positions]
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
 *         description: ✅ ดึงข้อมูลตำแหน่งสำเร็จ
 *       500:
 *         description: ❌ เซิร์ฟเวอร์ผิดพลาด
 */

/**
 * @swagger
 * /positions/create/{storeId}:
 *   post:
 *     summary: สร้างตำแหน่งใหม่ในร้าน
 *     tags: [Positions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: storeId
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
 *               name:
 *                 type: string
 *                 example: แคชเชียร์
 *               permissions:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["sale", "all_receipts"]
 *     responses:
 *       201:
 *         description: ✅ เพิ่มตำแหน่งสำเร็จ
 *       400:
 *         description: ❌ ข้อมูลไม่ถูกต้อง
 *       500:
 *         description: ❌ เซิร์ฟเวอร์ผิดพลาด
 */

/**
 * @swagger
 * /positions/update/{id}:
 *   put:
 *     summary: แก้ไขข้อมูลตำแหน่ง
 *     tags: [Positions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: รหัสตำแหน่ง
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               permissions:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: ✅ อัปเดตข้อมูลสำเร็จ
 *       404:
 *         description: ❌ ไม่พบตำแหน่ง
 *       500:
 *         description: ❌ เซิร์ฟเวอร์ผิดพลาด
 */

/**
 * @swagger
 * /positions/delete/{id}:
 *   delete:
 *     summary: ลบตำแหน่งออกจากระบบ
 *     tags: [Positions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: รหัสตำแหน่ง
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: ✅ ลบตำแหน่งสำเร็จ
 *       404:
 *         description: ❌ ไม่พบตำแหน่ง
 *       500:
 *         description: ❌ เซิร์ฟเวอร์ผิดพลาด
 */

/**
 * @swagger
 * /positions/detail/{id}:
 *   get:
 *     summary: ดึงข้อมูลตำแหน่งตาม ID
 *     tags: [Positions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: รหัสตำแหน่ง
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: ✅ ดึงข้อมูลตำแหน่งสำเร็จ
 *       404:
 *         description: ❌ ไม่พบตำแหน่ง
 *       500:
 *         description: ❌ เซิร์ฟเวอร์ผิดพลาด
 */


export default router;
