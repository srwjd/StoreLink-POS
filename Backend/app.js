import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import { setupSwagger } from "./swagger.js";
import { errorHandler } from "./middleware/errorHandler.js";

import uploadRoutes from "./routes/upload.js";
import authRoutes from "./routes/authRoutes.js";
import storeRoutes from "./routes/storeRoutes.js";
import positionRoutes from "./routes/positionRoutes.js";
import employeeRoutes from "./routes/employeeRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import settingRoutes from "./routes/settingRouters.js";
import adminRoutes from "./routes/adminRoutes.js";

const app = express();

// Swagger
setupSwagger(app);

// ------------------
// CORS (KEEP allowedDomains)
// ------------------
const allowedDomains = [
  "http://localhost:5173",
  "https://store-link-weld.vercel.app",
  "http://localhost:3000",
];

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedDomains.includes(origin)) return callback(null, true);
      callback(new Error("Not allowed by CORS"), false);
    },
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// Middlewares
app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/upload", uploadRoutes);
app.use("/auth", authRoutes);
app.use("/stores", storeRoutes);
app.use("/positions", positionRoutes);
app.use("/employees", employeeRoutes);
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/reports", reportRoutes);
app.use("/settings", settingRoutes);
app.use("/admin", adminRoutes);

// Health
app.get("/health", (_, res) => res.json({ ok: true }));

// Global error handler
app.use(errorHandler);

export default app;
