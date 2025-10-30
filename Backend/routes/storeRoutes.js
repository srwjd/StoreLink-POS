import express from "express";
import { requireAuth } from "../middleware/authMiddleware.js";
import { createStore, getMyStores } from "../controllers/storeController.js";

const router = express.Router();

router.post("/create-store", requireAuth, createStore);
router.get("/my-stores", requireAuth, getMyStores);

export default router;
