import express from "express";
import { getAllStores, deleteStore } from "../controllers/adminController.js";

const router = express.Router();

// ดึงข้อมูลร้านค้าทั้งหมด
router.get("/stores", getAllStores);

// ลบร้านค้า
router.delete("/stores/:id", deleteStore);

export default router;
