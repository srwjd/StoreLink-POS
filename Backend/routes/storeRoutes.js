import express from "express";
import { createStore, getMyStores } from "../controllers/storeController.js";

const router = express.Router();

router.post("/create", createStore);
router.get("/my-stores", getMyStores);

export default router;
