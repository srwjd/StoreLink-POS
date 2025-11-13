import mongoose from "mongoose";
import Counter from "./counterModel.js";

const paymentSettingsSchema = new mongoose.Schema(
  {
    cash: { type: Boolean, default: true },
    qrPromptPay: { type: Boolean, default: false },
    promptPayNumber: { type: String, default: "" },
  },
  { _id: false }
);

const storeSchema = new mongoose.Schema(
  {
    storeCode: { type: String, unique: true },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    storeName: { type: String, required: true },
    storeImage: { type: String, default: "" },
    storeType: {
      type: String,
      enum: ["general", "restaurant", "service"],
      required: true,
    },
    address: String,
    phone: String,
    taxRate: { type: Number, default: 0 },
    paymentSettings: { type: paymentSettingsSchema, default: () => ({}) },
  },
  { timestamps: true }
);

// ✅ ใช้ Counter เพื่อให้เลขรหัสร้านไม่ซ้ำ
storeSchema.pre("validate", async function (next) {
  if (this.storeCode) return next();

  try {
    const counter = await Counter.findOneAndUpdate(
      { name: "storeCode" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    const nextNumber = counter.seq;
    this.storeCode = "ST" + String(nextNumber).padStart(6, "0");
    next();
  } catch (err) {
    console.error("❌ Error generating storeCode:", err);
    next(err);
  }
});

export default mongoose.model("Store", storeSchema);
