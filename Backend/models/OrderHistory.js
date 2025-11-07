import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    barcode: String,
    name: String,
    price: Number,
    qty: Number,
    total: Number,
    options: mongoose.Schema.Types.Mixed // สำหรับเก็บ option เช่น รส / เผ็ด / สี
});

const orderHistorySchema = new mongoose.Schema({
    storeId: { type: mongoose.Schema.Types.ObjectId, ref: "Store", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // พนักงานที่ขาย
    items: [orderItemSchema],
    subTotal: Number,
    tax: Number,
    total: Number,
    paymentMethod: { type: String, enum: ["cash", "card", "promptpay", "other"], default: "cash" },
    paidAmount: Number,
    changeAmount: Number,
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("OrderHistory", orderHistorySchema);
