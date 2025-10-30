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
    storeId: { type: String, unique: true }, // ST000001
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

// ✅ สร้างรหัสร้านอัตโนมัติ (ปลอดภัยต่อการ insert พร้อมกันหลายคน)
storeSchema.pre("save", async function (next) {
  if (this.storeId) return next();

  try {
    const lastStore = await this.constructor.findOne({}, { storeId: 1 }).sort({ createdAt: -1 }).lean();
    let nextNumber = 1;

    if (lastStore && lastStore.storeId) {
      const lastNumber = parseInt(lastStore.storeId.replace("ST", ""), 10);
      if (!isNaN(lastNumber)) nextNumber = lastNumber + 1;
    }

    this.storeId = "ST" + String(nextNumber).padStart(6, "0");
    next();
  } catch (err) {
    console.error("❌ Error generating storeId:", err);
    next(err);
  }
});

export default mongoose.model("Store", storeSchema);
