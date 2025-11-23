import http from "http";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import app from "./app.js";

dotenv.config();

if (process.env.NODE_ENV !== "test") {
  // โหมดปกติ → ใช้ฐานข้อมูลจริง
  connectDB().then(() => {
    const PORT = process.env.PORT || 3000;

    const server = http.createServer(app);
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  });
}

export default app;
