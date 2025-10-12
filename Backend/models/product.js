import mongoose from "mongoose";
const productSchema = new mongoose.Schema({
    storeId: { type: mongoose.Types.ObjectId, ref: "Store", required: true },
    name: { type: String, required: true },
    category: String,
    type: { type: String, enum: ["product", "service"], default: "product" },
    price: { type: Number, required: true },
    unit: String,
    barcode: String,
    stockQty: { type: Number, default: null },
    duration: { type: Number, default: null },
    status: { type: String, enum: ["active", "inactive"], default: "active" }
}, { timestamps: true });

export default mongoose.model("Product", productSchema);
