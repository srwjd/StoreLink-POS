import mongoose from "mongoose";

export default async function connectDB() {
  const uri = process.env.MONGO_URL || "mongodb://localhost:27017/storelink";
  try {
    await mongoose.connect(uri, { });
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connect error:", err.message);
    process.exit(1);
  }
}
