import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { uploadImage } from "../controllers/uploadController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// ตั้งค่า multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadsDir = path.join(__dirname, "../uploads");
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    // สร้างชื่อไฟล์ที่ไม่ซ้ำ
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // อนุญาตเฉพาะรูปภาพและ PDF
  const allowedTypes = /jpeg|jpg|png|gif|webp|pdf/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());

  // ตรวจสอบ mimetype หรือ extname (บาง browser อาจส่ง mimetype ไม่ถูกต้อง)
  const mimetype = file.mimetype && allowedTypes.test(file.mimetype);

  if (extname || mimetype) {
    return cb(null, true);
  } else {
    cb(new Error("รองรับเฉพาะไฟล์รูปภาพ (JPG, PNG, GIF, WEBP) และ PDF เท่านั้น"));
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  },
  fileFilter: fileFilter
});

// Error handler สำหรับ multer - ต้อง wrap upload middleware
const uploadMiddleware = upload.single("file");

// เพิ่ม authentication middleware และ error handling
router.post("/", requireAuth, (req, res, next) => {
  uploadMiddleware(req, res, (err) => {
    if (err) {
      // จัดการ multer errors
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({ message: "ขนาดไฟล์เกิน 10MB" });
        }
        return res.status(400).json({ message: err.message || "เกิดข้อผิดพลาดในการอัปโหลดไฟล์" });
      }
      // จัดการ file filter errors
      if (err.message) {
        return res.status(400).json({ message: err.message });
      }
      return res.status(400).json({ message: "เกิดข้อผิดพลาดในการอัปโหลดไฟล์" });
    }
    // ถ้าไม่มี error ให้ไปต่อที่ uploadImage
    next();
  });
}, uploadImage);

/**
 * @swagger
 * tags:
 *   name: Upload
 *   description: การอัปโหลดไฟล์และรูปภาพ
 */

/**
 * @swagger
 * /upload:
 *   post:
 *     summary: อัปโหลดรูปภาพหรือไฟล์ (รองรับ JPG, PNG, GIF, WEBP, PDF)
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: ไฟล์ที่ต้องการอัปโหลด
 *     responses:
 *       200:
 *         description: ✅ อัปโหลดไฟล์สำเร็จ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Upload successful"
 *                 filePath:
 *                   type: string
 *                   example: "/uploads/file-123456789.jpg"
 *       400:
 *         description: ❌ รูปแบบไฟล์ไม่ถูกต้องหรือขนาดเกิน 10MB
 *       401:
 *         description: ❌ ไม่มีสิทธิ์ (ต้องเข้าสู่ระบบก่อน)
 *       500:
 *         description: ❌ เซิร์ฟเวอร์ผิดพลาด
 */


export default router;
