import express from "express";
import multer from "multer";
import path from "path";
import {
  updateStoreName,
  updatePaymentSettings,
  updateStoreLogo,
  deleteStore,
  updateStoreContact
} from "../controllers/settingController.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { requirePermission } from "../middleware/permissionMiddleware.js";

const router = express.Router();

// 📁 ตั้งค่า multer สำหรับอัปโหลดโลโก้
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/store_logos");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${file.fieldname}${ext}`);
  },
});

const upload = multer({ storage });

// ✅ เปลี่ยนชื่อร้าน (ต้องมี permission: "edit_store_name")
router.put(
  "/:storeId/name",
  requireAuth,
  requirePermission("edit_store_name"),
  updateStoreName
);

// ✅ เปลี่ยนการตั้งค่าชำระเงิน (permission: "edit_payment_settings")
router.put(
  "/:storeId/payment",
  requireAuth,
  requirePermission("edit_payment_settings"),
  updatePaymentSettings
);

// ✅ เปลี่ยนโลโก้ร้าน (permission: "edit_store_logo")
router.put(
  "/:storeId/logo",
  requireAuth,
  requirePermission("edit_store_logo"),
  upload.single("logo"),
  updateStoreLogo
);

router.put(
  "/:storeId/contact",
  requireAuth,
  requirePermission("edit_store_contact"),
  updateStoreContact
);

// ✅ ลบร้าน (permission: "delete_store")
router.delete(
  "/:storeId",
  requireAuth,
  requirePermission("delete_store"),
  deleteStore
);

/**
 * @swagger
 * tags:
 *   name: Settings
 *   description: การตั้งค่าร้านค้า (Store Settings)
 */

/**
 * @swagger
 * /settings/{storeId}/name:
 *   put:
 *     summary: เปลี่ยนชื่อร้าน
 *     tags: [Settings]
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
 *               storeName:
 *                 type: string
 *                 example: ร้านน้องพลอย POS
 *     responses:
 *       200:
 *         description: ✅ เปลี่ยนชื่อร้านสำเร็จ
 *       403:
 *         description: ❌ ไม่มีสิทธิ์แก้ไขชื่อร้าน
 *       500:
 *         description: ❌ เซิร์ฟเวอร์ผิดพลาด
 */

/**
 * @swagger
 * /settings/{storeId}/payment:
 *   put:
 *     summary: อัปเดตการตั้งค่าการชำระเงิน
 *     tags: [Settings]
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
 *               paymentSettings:
 *                 type: object
 *                 example:
 *                   cash: true
 *                   promptpay: true
 *                   promptpayNumber: "0812345678"
 *     responses:
 *       200:
 *         description: ✅ อัปเดตการตั้งค่าชำระเงินสำเร็จ
 *       403:
 *         description: ❌ ไม่มีสิทธิ์อัปเดตการชำระเงิน
 *       500:
 *         description: ❌ เซิร์ฟเวอร์ผิดพลาด
 */

/**
 * @swagger
 * /settings/{storeId}/logo:
 *   put:
 *     summary: อัปโหลดโลโก้ร้านใหม่
 *     tags: [Settings]
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - name: storeId
 *         in: path
 *         required: true
 *         description: รหัสร้านค้า
 *         schema:
 *           type: string
 *       - name: logo
 *         in: formData
 *         required: true
 *         type: file
 *         description: ไฟล์รูปโลโก้ร้าน (.jpg, .png)
 *     responses:
 *       200:
 *         description: ✅ อัปโหลดโลโก้ร้านสำเร็จ
 *       400:
 *         description: ❌ ไฟล์ไม่ถูกต้อง
 *       403:
 *         description: ❌ ไม่มีสิทธิ์อัปเดตโลโก้
 *       500:
 *         description: ❌ เซิร์ฟเวอร์ผิดพลาด
 */

/**
 * @swagger
 * /settings/{storeId}/contact:
 *   put:
 *     summary: แก้ไขข้อมูลการติดต่อร้าน
 *     tags: [Settings]
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
 *               phone:
 *                 type: string
 *                 example: "0812345678"
 *               address:
 *                 type: string
 *                 example: "123/4 ถนนสาทร กรุงเทพฯ"
 *     responses:
 *       200:
 *         description: ✅ อัปเดตข้อมูลการติดต่อสำเร็จ
 *       403:
 *         description: ❌ ไม่มีสิทธิ์อัปเดตข้อมูล
 *       500:
 *         description: ❌ เซิร์ฟเวอร์ผิดพลาด
 */

/**
 * @swagger
 * /settings/{storeId}:
 *   delete:
 *     summary: ลบร้านออกจากระบบ
 *     tags: [Settings]
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
 *         description: ✅ ลบร้านสำเร็จ
 *       403:
 *         description: ❌ ไม่มีสิทธิ์ลบร้าน
 *       500:
 *         description: ❌ เซิร์ฟเวอร์ผิดพลาด
 */


export default router;
