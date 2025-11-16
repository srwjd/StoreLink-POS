import express from "express";
import { registerUser, login, getProfile } from "../controllers/authController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", login);
router.get("/profile", requireAuth, getProfile);

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: ระบบจัดการการเข้าสู่ระบบและบัญชีผู้ใช้
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: สมัครสมาชิกใหม่
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: พลอย สิราวรรณ
 *               email:
 *                 type: string
 *                 example: ploy@gmail.com
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       201:
 *         description: ✅ สมัครสมาชิกสำเร็จ
 *       400:
 *         description: ❌ ข้อมูลไม่ถูกต้อง
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: เข้าสู่ระบบ
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: ploy@gmail.com
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: ✅ เข้าสู่ระบบสำเร็จและส่ง JWT token กลับ
 *       401:
 *         description: ❌ Email หรือรหัสผ่านไม่ถูกต้อง
 */

/**
 * @swagger
 * /auth/profile:
 *   get:
 *     summary: ดึงข้อมูลโปรไฟล์ผู้ใช้ปัจจุบัน
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: ✅ ดึงข้อมูลสำเร็จ
 *       401:
 *         description: ❌ ไม่พบ token หรือ token ไม่ถูกต้อง
 */


export default router;
