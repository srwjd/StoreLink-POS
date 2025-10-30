import mongoose from "mongoose";

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
    storeId: { type: String, unique: true }, // ❗ไม่ต้อง required
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    storeName: { type: String, required: true },
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

// ✅ เพิ่มการสร้างรหัสร้านอัตโนมัติ
storeSchema.pre("save", async function (next) {
  if (this.storeId) return next(); // ถ้ามีอยู่แล้วไม่ต้องสร้างซ้ำ

  try {
    const lastStore = await this.constructor.findOne().sort({ createdAt: -1 }).lean();
    let nextNumber = 1;

    if (lastStore && lastStore.storeId) {
      const lastNumber = parseInt(lastStore.storeId.replace("ST", ""), 10);
      nextNumber = lastNumber + 1;
    }

    this.storeId = "ST" + String(nextNumber).padStart(6, "0"); // เช่น ST000001, ST000002
    next();
  } catch (err) {
    next(err);
  }
});

export default mongoose.model("Store", storeSchema);
