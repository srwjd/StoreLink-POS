import express from "express";
import { requireAuth } from "../middleware/authMiddleware.js";
import { requirePermission } from "../middleware/permissionMiddleware.js";
import {
    getEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee
} from "../controllers/employeeController.js";

const router = express.Router();

router.get("/:storeId", requireAuth, requirePermission("manage_employees"), getEmployees);
router.get("/staff/:storeId", requireAuth, getEmployees);
router.post("/create/:storeId", requireAuth, requirePermission("manage_employees"), createEmployee);
router.put("/update/:id", requireAuth, requirePermission("manage_employees"), updateEmployee);
router.delete("/delete/:id", requireAuth, requirePermission("manage_employees"), deleteEmployee);

/**
 * @swagger
 * tags:
 *   name: Employees
 *   description: จัดการข้อมูลพนักงานในร้านค้า
 */

/**
 * @swagger
 * /employees/{storeId}:
 *   get:
 *     summary: ดึงข้อมูลพนักงานทั้งหมดในร้าน
 *     tags: [Employees]
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
 *         description: ✅ ดึงข้อมูลพนักงานสำเร็จ
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   firstName:
 *                     type: string
 *                     example: พลอย
 *                   lastName:
 *                     type: string
 *                     example: สิราวรรณ
 *                   email:
 *                     type: string
 *                     example: ploy@example.com
 *                   position:
 *                     type: string
 *                     example: แคชเชียร์
 *       403:
 *         description: ❌ ไม่มีสิทธิ์เข้าถึง
 *       500:
 *         description: ❌ เซิร์ฟเวอร์ผิดพลาด
 */


/**
 * @swagger
 * /employees/create/{storeId}:
 *   post:
 *     summary: เพิ่มพนักงานใหม่ในร้าน
 *     tags: [Employees]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: storeId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: พลอย
 *               lastName:
 *                 type: string
 *                 example: สิราวรรณ
 *               email:
 *                 type: string
 *                 example: ploy@example.com
 *               password:
 *                 type: string
 *                 example: 123456
 *               positionId:
 *                 type: string
 *                 example: 674fe2a5a64f452fd9bdf291
 *     responses:
 *       201:
 *         description: ✅ เพิ่มพนักงานสำเร็จ
 *       400:
 *         description: ❌ ข้อมูลไม่ถูกต้อง
 *       403:
 *         description: ❌ ไม่มีสิทธิ์เข้าถึง
 *       500:
 *         description: ❌ เซิร์ฟเวอร์ผิดพลาด
 */

/**
 * @swagger
 * /employees/update/{id}:
 *   put:
 *     summary: แก้ไขข้อมูลพนักงาน
 *     tags: [Employees]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: รหัสพนักงาน
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               positionId:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: ✅ อัปเดตข้อมูลพนักงานสำเร็จ
 *       404:
 *         description: ❌ ไม่พบพนักงาน
 *       500:
 *         description: ❌ เซิร์ฟเวอร์ผิดพลาด
 */

/**
 * @swagger
 * /employees/delete/{id}:
 *   delete:
 *     summary: ลบพนักงานออกจากระบบ
 *     tags: [Employees]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: รหัสพนักงาน
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: ✅ ลบพนักงานสำเร็จ
 *       404:
 *         description: ❌ ไม่พบพนักงาน
 *       500:
 *         description: ❌ เซิร์ฟเวอร์ผิดพลาด
 */


export default router;
