import cloudinary from "cloudinary";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ตรวจสอบและสร้าง uploads folder ถ้ายังไม่มี
const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// ตั้งค่า Cloudinary
if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
  cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

export const uploadImage = async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: "ไม่พบไฟล์ที่อัปโหลด กรุณาเลือกไฟล์อีกครั้ง" });
    }

    console.log("Upload file info:", {
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      filename: file.filename
    });

    // ตรวจสอบว่า Cloudinary config มีครบหรือไม่
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      // ถ้าไม่มี Cloudinary config ให้ใช้ local storage แทน
      // สร้าง full URL สำหรับไฟล์
      const protocol = req.protocol || "http";
      const host = req.get("host") || "localhost:3000";
      const fileUrl = `${protocol}://${host}/uploads/${file.filename}`;
      
      return res.json({
        message: "Upload success (local)",
        imageUrl: fileUrl,
      });
    }

    // อัปโหลดไปยัง Cloudinary
    const result = await cloudinary.v2.uploader.upload(file.path, {
      folder: "storelink/uploads",
      resource_type: "auto", // รองรับทั้งรูปภาพและ PDF
    });

    // ลบไฟล์ temp ออก
    try {
      fs.unlinkSync(file.path);
    } catch (unlinkError) {
      console.warn("Could not delete temp file:", unlinkError);
    }

    res.json({
      message: "Upload success",
      imageUrl: result.secure_url,
    });
  } catch (error) {
    console.error("Upload error:", error);
    
    // ลบไฟล์ temp ถ้ามี error
    if (req.file?.path) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkError) {
        console.warn("Could not delete temp file:", unlinkError);
      }
    }

    // ส่ง error message ที่เข้าใจง่าย
    const errorMessage = error.message || "เกิดข้อผิดพลาดในการอัปโหลดไฟล์";
    res.status(500).json({ 
      message: errorMessage,
      error: process.env.NODE_ENV === "development" ? error.stack : undefined
    });
  }
};
