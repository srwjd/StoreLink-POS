import express from "express";
import { getDashboardReport } from "../controllers/saleController.js";

const router = express.Router();

// GET /api/dashboard/:storeId
router.get("/:storeId", getDashboardReport);

export default router;
