import mongoose from "mongoose";

const paymentSettingsSchema = new mongoose.Schema({
    cash: { type: Boolean, default: true },
    qrPromptPay: { type: Boolean, default: false },
    promptPayNumber: { type: String, default: "" }
}, { _id: false });

const storeSchema = new mongoose.Schema({
    storeId: { type: mongoose.Types.ObjectId, required: true, unique: true },
    ownerId: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    type: { type: String, enum: ["retail", "restaurant", "service"], required: true },
    address: String,
    phone: String,
    taxRate: { type: Number, default: 0 },
    paymentSettings: { type: paymentSettingsSchema, default: () => ({}) }
}, { timestamps: true });

export default mongoose.model("Store", storeSchema);
