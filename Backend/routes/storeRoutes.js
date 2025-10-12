import { Router } from "express";
import { requireAuth, } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";
import { createStore, getMyStores } from "../controllers/storeController.js";

const router = Router();

// Owner สร้าง/ดูร้านของตัวเอง
router.post("/", requireAuth, requireRole("owner", "admin"), createStore);
router.get("/mine", requireAuth, requireRole("owner", "admin"), getMyStores);

export default router;
