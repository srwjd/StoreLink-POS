import express from "express";
import { requireAuth } from "../middleware/authMiddleware.js";
import { createStore, getMyStores } from "../controllers/storeController.js";
import Store from "../models/storeModel.js";

const router = express.Router();

router.post("/create-store", requireAuth, createStore);
router.get("/my-stores", requireAuth, getMyStores);
router.get("/:id", requireAuth, async (req, res) => {
    try {
        const store = await Store.findById(req.params.id);
        if (!store) return res.status(404).json({ message: "ไม่พบร้านค้า" });
        res.json({ store });
    } catch (err) {
        res.status(500).json({ message: "เกิดข้อผิดพลาด", error: err.message });
    }
});

export default router;
