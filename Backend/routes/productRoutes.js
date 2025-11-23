import express from "express";
import {
    createProduct,
    getProductsByStore,
    getProductById,
    updateProduct,
    deleteProduct,
    addSerialNumbers,
    getCategoriesByStore,
} from "../controllers/productController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create/:storeId", requireAuth, createProduct); // สร้างสินค้า
router.get("/all/:storeId", requireAuth, getProductsByStore); // ดึงสินค้าทั้งหมดของร้าน
router.get("/:id", requireAuth, getProductById); // ดูรายละเอียดสินค้า
router.put("/:id", requireAuth, updateProduct); // อัปเดตสินค้า
router.delete("/:id", requireAuth, deleteProduct); // ลบสินค้า
router.post("/:id/add-serials", requireAuth, addSerialNumbers); // เพิ่ม Serial ให้สินค้า
router.get("/categories/:storeId", requireAuth, getCategoriesByStore);

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: จัดการข้อมูลสินค้าในร้าน
 */

/**
 * @swagger
 * /products/create/{storeId}:
 *   post:
 *     summary: เพิ่มสินค้าใหม่ในร้าน
 *     tags: [Products]
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
 *                 example: ผัดไทยกุ้งสด
 *               price:
 *                 type: number
 *                 example: 60
 *               stockQty:
 *                 type: number
 *                 example: 100
 *               category:
 *                 type: string
 *                 example: อาหารจานหลัก
 *     responses:
 *       201:
 *         description: ✅ เพิ่มสินค้าใหม่สำเร็จ
 *       400:
 *         description: ❌ ข้อมูลไม่ถูกต้อง
 *       500:
 *         description: ❌ เซิร์ฟเวอร์ผิดพลาด
 */

/**
 * @swagger
 * /products/all/{storeId}:
 *   get:
 *     summary: ดึงรายการสินค้าทั้งหมดของร้าน
 *     tags: [Products]
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
 *         description: ✅ ดึงข้อมูลสินค้าสำเร็จ
 *       500:
 *         description: ❌ เซิร์ฟเวอร์ผิดพลาด
 */

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: ดูรายละเอียดสินค้าตาม ID
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: รหัสสินค้า
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: ✅ ดึงรายละเอียดสินค้าสำเร็จ
 *       404:
 *         description: ❌ ไม่พบสินค้า
 *       500:
 *         description: ❌ เซิร์ฟเวอร์ผิดพลาด
 */

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: แก้ไขข้อมูลสินค้า
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: รหัสสินค้า
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
 *               price:
 *                 type: number
 *               stockQty:
 *                 type: number
 *               category:
 *                 type: string
 *     responses:
 *       200:
 *         description: ✅ อัปเดตสินค้าสำเร็จ
 *       404:
 *         description: ❌ ไม่พบสินค้า
 *       500:
 *         description: ❌ เซิร์ฟเวอร์ผิดพลาด
 */

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: ลบสินค้าออกจากระบบ
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: รหัสสินค้า
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: ✅ ลบสินค้าสำเร็จ
 *       404:
 *         description: ❌ ไม่พบสินค้า
 *       500:
 *         description: ❌ เซิร์ฟเวอร์ผิดพลาด
 */

/**
 * @swagger
 * /products/{id}/add-serials:
 *   post:
 *     summary: เพิ่ม Serial Number ให้สินค้า
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: รหัสสินค้า
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               serialNumbers:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["SN001", "SN002", "SN003"]
 *     responses:
 *       200:
 *         description: ✅ เพิ่ม Serial Number สำเร็จ
 *       404:
 *         description: ❌ ไม่พบสินค้า
 *       500:
 *         description: ❌ เซิร์ฟเวอร์ผิดพลาด
 */


export default router;
