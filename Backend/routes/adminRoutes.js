import express from "express";
import { getAllStores, deleteStore, getAllOwner, editPasswordOwner } from "../controllers/adminController.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { requirePermission } from "../middleware/permissionMiddleware.js";

const router = express.Router();

router.get("/stores", requireAuth, getAllStores);
router.get("/owners", requireAuth, getAllOwner);
router.put("/owners/:id", requireAuth, editPasswordOwner);
router.delete("/stores/:id", requireAuth, deleteStore);


/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: จัดการข้อมูลร้านค้าสำหรับผู้ดูแลระบบ
 */

/**
 * @swagger
 * /admin/stores:
 *   get:
 *     summary: ดึงข้อมูลร้านค้าทั้งหมด
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: ✅ ดึงข้อมูลร้านค้าทั้งหมดสำเร็จ
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: 672c7d482dbf4d15d62f9c25
 *                   storeName:
 *                     type: string
 *                     example: ร้านครัวพลอย
 *                   storeType:
 *                     type: string
 *                     example: restaurant
 *                   ownerId:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         example: พลอย สิราวรรณ
 *                       email:
 *                         type: string
 *                         example: ploy@gmail.com
 *       500:
 *         description: ❌ เกิดข้อผิดพลาดในการดึงข้อมูลร้านค้า
 */

/**
 * @swagger
 * /admin/stores/{id}:
 *   delete:
 *     summary: ลบร้านค้าออกจากระบบ
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: รหัสร้านค้า (Store ID)
 *         schema:
 *           type: string
 *           example: 672c7d482dbf4d15d62f9c25
 *     responses:
 *       200:
 *         description: ✅ ลบร้านค้าสำเร็จ
 *       404:
 *         description: ❌ ไม่พบร้านค้าที่ต้องการลบ
 *       500:
 *         description: ❌ เกิดข้อผิดพลาดในระบบ
 */


export default router;
/*  */