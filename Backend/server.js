import http from "http";
import app from "./app.js";
import "./config/env.js";
import connectDB from "./config/db.js";

const PORT = process.env.PORT || 3000;

(async () => {
  await connectDB();
  const server = http.createServer(app);
  server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
})();
