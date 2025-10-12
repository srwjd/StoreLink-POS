import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
    productId: { type: mongoose.Types.ObjectId, ref: "Product", required: true },
    name: String,
    qty: Number,
    unitPrice: Number,
    total: Number
}, { _id: false });

const paymentSchema = new mongoose.Schema({
    method: { type: String, enum: ["cash", "qr"], required: true },
    promptPayNumber: String,
    transactionId: String
}, { _id: false });

const saleSchema = new mongoose.Schema({
    storeId: { type: mongoose.Types.ObjectId, ref: "Store", required: true },
    cashierId: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    items: [itemSchema],
    subtotal: Number,
    discount: { type: Number, default: 0 },
    vat: { type: Number, default: 0 },
    grandTotal: Number,
    payment: paymentSchema
}, { timestamps: { createdAt: true, updatedAt: false } });

export default mongoose.model("Sale", saleSchema);
