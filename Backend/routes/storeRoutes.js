import express from "express";
import { requireAuth } from "../middleware/authMiddleware.js";
import { createStore, getMyStores, getStoreById } from "../controllers/storeController.js";

const router = express.Router();

router.post("/create-store", requireAuth, createStore);
router.get("/my-stores", requireAuth, getMyStores);
router.get("/:id", requireAuth, getStoreById);

export default router;
