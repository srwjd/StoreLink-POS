import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import http from "http";
import dotenv from "dotenv";

import { errorHandler } from "./middleware/errorHandler.js";
import authRoutes from "./routes/authRoutes.js";
import storeRoutes from "./routes/storeRoutes.js";
// import productRoutes from "./routes/productRoutes.js";
// import saleRoutes from "./routes/saleRoutes.js";

import "./config/env.js";
import connectDB from "./config/db.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

(async () => {
  await connectDB();

  const app = express();

  const allowedDomains = [
    'http://localhost:5173'
  ];
  const corsOptions = {
    origin: function (origin, callback) {
      console.log('[CORS] origin:', origin);
      if (!origin) return callback(null, true); // allow curl/postman
      if (allowedDomains.includes(origin)) return callback(null, true);
      callback(new Error('Not allowed by CORS'), false);
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
  };
  app.use(cors(corsOptions));
  app.use(helmet());
  app.use(express.json());
  app.use(cookieParser());
  app.use(morgan("dev"));

  app.use("/auth", authRoutes);
  app.use("/stores", storeRoutes);
  // app.use("/products", productRoutes);
  // app.use("/sales", saleRoutes);

  app.get("/health", (_, res) => res.json({ ok: true }));

  app.use(errorHandler);

  const server = http.createServer(app);
  server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
})();
