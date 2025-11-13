import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    barcode: String,
    name: String,
    price: Number,
    qty: Number,
    total: Number,
    options: mongoose.Schema.Types.Mixed, // เช่น รสชาติ / ไซส์ / ท็อปปิ้ง
});

const orderSchema = new mongoose.Schema({
    storeId: { type: mongoose.Schema.Types.ObjectId, ref: "Store", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // พนักงานที่เปิดบิล

    // 🧩 เพิ่มระบบโต๊ะ / คิว
    tableNumber: { type: String, default: null }, // เช่น "โต๊ะ 1", "โต๊ะ 5" หรือ null ถ้าไม่ใช่ร้านอาหาร
    queueNumber: { type: String, default: null }, // ใช้แทนโต๊ะในร้านกาแฟ
    kitchenStatus: {
        type: String,
        enum: ["waiting", "cooking", "done"],
        default: "waiting"
    },



    // 🔹 รายการอาหาร/สินค้า
    items: [orderItemSchema],

    // 💰 ยอดรวม
    subTotal: Number,
    tax: Number,
    total: Number,

    // 💳 การชำระเงิน
    paymentMethod: {
        type: String,
        enum: ["cash", "card", "promptpay", "other", "none"],
        default: "none",
    },
    paidAmount: { type: Number, default: 0 },
    changeAmount: { type: Number, default: 0 },

    // 📦 สถานะออเดอร์
    status: {
        type: String,
        enum: ["pending", "paid", "cancelled"],
        default: "pending",
    },

    // 🧾 สำหรับใบเสร็จ / การออกรายงาน
    receiptNumber: { type: String }, // เช่น SL2025-0001
    paidAt: { type: Date }, // วันเวลาที่จ่ายจริง
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model("Order", orderSchema);
