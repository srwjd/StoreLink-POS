import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let memServer;

const connectDB = async () => {
  try {
    if (process.env.NODE_ENV === "test") {
      // ใช้ in-memory database
      memServer = await MongoMemoryServer.create();
      const uri = memServer.getUri();
      await mongoose.connect(uri);
      console.log("🧪 Connected to in-memory MongoDB");
    } else {
      // ใช้ database จริงตอน production/dev
      await mongoose.connect(process.env.MONGO_URI);
      console.log("Connected to MongoDB");
    }
  } catch (err) {
    console.error("DB connection error:", err);
  }
};

export default connectDB;
