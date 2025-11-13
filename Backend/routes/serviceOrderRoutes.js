import express from "express";
import {
  getAllServiceOrders,
  createServiceOrder,
  updateServiceOrderStatus,
  addServiceToOrder,
} from "../controllers/serviceOrderController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/:storeId", requireAuth, getAllServiceOrders);
router.post("/create", requireAuth, createServiceOrder);
router.patch("/:id/status", requireAuth, updateServiceOrderStatus);
router.patch("/:id/add-service", requireAuth, addServiceToOrder);

export default router;
