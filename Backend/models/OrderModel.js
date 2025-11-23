import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    barcode: String,
    name: String,
    price: Number,
    qty: Number,
    total: Number,
    options: mongoose.Schema.Types.Mixed,
});

const orderSchema = new mongoose.Schema({
    storeId: { type: mongoose.Schema.Types.ObjectId, ref: "Store", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    kitchenStatus: {
        type: String,
        enum: ["waiting", "cooking", "done"],
        default: "waiting"
    },
    items: [orderItemSchema],
    subTotal: Number,
    tax: Number,
    total: Number,
    paymentMethod: {
        type: String,
        enum: ["cash", "promptpay", "other", "none"],
        default: "none",
    },
    paidAmount: { type: Number, default: 0 },
    changeAmount: { type: Number, default: 0 },
    status: {
        type: String,
        enum: ["pending", "paid", "cancelled"],
        default: "pending",
    },
    receiptNumber: { type: String },
    paidAt: { type: Date },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model("Order", orderSchema);
