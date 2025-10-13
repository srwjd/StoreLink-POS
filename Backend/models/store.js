import mongoose from "mongoose";

const paymentSettingsSchema = new mongoose.Schema({
    cash: { type: Boolean, default: true },
    qrPromptPay: { type: Boolean, default: false },
    promptPayNumber: { type: String, default: "" },
}, { _id: false });

const storeSchema = new mongoose.Schema(
    {
        storeId: { type: String, required: true, unique: true },
        ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        name: { type: String, required: true },
        type: { type: String, enum: ["retail", "restaurant", "service"], required: true },

        address: String,
        phone: String,
        taxRate: { type: Number, default: 0 },
        paymentSettings: { type: paymentSettingsSchema, default: () => ({}) },
    },
    { timestamps: true }
);

// สร้าง storeId อัตโนมัติก่อนบันทึก
storeSchema.pre("validate", async function (next) {
    if (this.storeId) return next();

    const Store = mongoose.model("Store", storeSchema);
    const lastStore = await Store.findOne().sort({ storeId: -1 }).lean();
    let newCode = "000001";
    if (lastStore) {
        const nextNum = parseInt(lastStore.storeId) + 1;
        newCode = String(nextNum).padStart(6, "0");
    }
    this.storeId = newCode;
    next();
});

export default mongoose.model("Store", storeSchema);
