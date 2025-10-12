import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    storeId: { type: mongoose.Types.ObjectId, ref: "Store" }, // admin อาจไม่มี
    username: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    fullName: { type: String, trim: true },
    role: { type: String, enum: ["admin", "owner", "employee"], required: true },
    status: { type: String, enum: ["active", "inactive"], default: "active" }
}, { timestamps: true });

export default mongoose.model("User", userSchema);
