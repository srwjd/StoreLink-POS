// import express from "express";
// import { requireAuth } from "../middleware/authMiddleware.js";
// import { requirePermission } from "../middleware/permissionMiddleware.js";
// import {
//     getTablesByStore,
//     linkOrderToTable,
//     createTable,
//     updateTableStatus,
//     deleteTable,
//     clearTable,
// } from "../controllers/tableController.js";

// const router = express.Router();

// // endpoint /tables

// router.get("/", requireAuth, requirePermission("manage_tables"), getTablesByStore);
// router.post("/create", requireAuth, requirePermission("manage_tables"), createTable);
// router.put("/:tableId/status", requireAuth, requirePermission("manage_tables"), updateTableStatus);
// router.put("/:tableId/link-order/:orderId", requireAuth, requirePermission("manage_tables"), linkOrderToTable);
// router.put("/:tableId/clear", requireAuth, requirePermission("manage_tables"), clearTable);
// router.delete("/delete/:id", requireAuth, requirePermission("manage_tables"), deleteTable);


// export default router;