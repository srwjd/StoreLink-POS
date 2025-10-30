import express from "express";
import {
    createProduct,
    getProductsByStore,
    getProductById,
    updateProduct,
    deleteProduct,
    addSerialNumbers,
} from "../controllers/productController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create/:storeId", requireAuth, createProduct); // สร้างสินค้า
router.get("/all/:storeId", requireAuth, getProductsByStore); // ดึงสินค้าทั้งหมดของร้าน
router.get("/:id", requireAuth, getProductById); // ดูรายละเอียดสินค้า
router.put("/:id", requireAuth, updateProduct); // อัปเดตสินค้า
router.delete("/:id", requireAuth, deleteProduct); // ลบสินค้า
router.post("/:id/add-serials", requireAuth, addSerialNumbers); // เพิ่ม Serial ให้สินค้า

export default router;
