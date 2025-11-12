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

export default router;
