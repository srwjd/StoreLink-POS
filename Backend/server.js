import express from "express";
import path from "path";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import http from "http";
import dotenv from "dotenv";

import { errorHandler } from "./middleware/errorHandler.js";
import uploadRoutes from "./routes/upload.js";
import authRoutes from "./routes/authRoutes.js";
import storeRoutes from "./routes/storeRoutes.js";
import positionRoutes from "./routes/positionRoutes.js";
import employeeRoutes from "./routes/employeeRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import tableRoutes from "./routes/tableRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import settingRoutes from "./routes/settingRouters.js";
import servicrOrderRoutes from "./routes/serviceOrderRoutes.js";

import "./config/env.js";
import connectDB from "./config/db.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

(async () => {
  await connectDB();

  const app = express();

  // ✅ แก้ allowedDomains: ไม่ควรมี "/" ท้าย URL
  const allowedDomains = [
    "http://localhost:5173",
    "https://store-link-weld.vercel.app",
  ];

  const corsOptions = {
    origin: function (origin, callback) {
      console.log("[CORS] origin:", origin);
      if (!origin) return callback(null, true); // allow curl/postman
      if (allowedDomains.includes(origin)) return callback(null, true);
      callback(new Error("Not allowed by CORS"), false);
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  };

  app.use(cors(corsOptions));
  app.use(helmet());
  app.use(express.json());
  app.use(cookieParser());
  app.use(morgan("dev"));

  // ✅ Serve static files (uploads)
  app.use("/uploads", express.static("uploads"));

  // ✅ Routes
  app.use("/upload", uploadRoutes);
  app.use("/auth", authRoutes);
  app.use("/stores", storeRoutes);
  app.use("/positions", positionRoutes);
  app.use("/employees", employeeRoutes);
  app.use("/products", productRoutes);
  app.use("/orders", orderRoutes);
  app.use("/tables", tableRoutes);
  app.use("/reports", reportRoutes);
  app.use("/settings", settingRoutes);
  app.use("/service-orders", servicrOrderRoutes);

  // ✅ Health check route (Render จะ ping อันนี้)
  app.get("/health", (_, res) => res.json({ ok: true }));

  app.use(errorHandler);

  // ✅ Run server
  const server = http.createServer(app);
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
})();
