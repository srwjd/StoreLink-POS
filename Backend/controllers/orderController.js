import OrderHistory from "../models/orderHistory.js";

// สร้างประวัติการขายใหม่
export const createOrder = async (req, res) => {
    try {
        const { storeId, userId, items, subTotal, tax, total, paymentMethod, paidAmount, changeAmount } = req.body;

        const order = new OrderHistory({
            storeId, userId,
            items,
            subTotal, tax, total,
            paymentMethod, paidAmount, changeAmount
        });

        const saved = await order.save();
        res.status(201).json({ success: true, order: saved });
    } catch (err) {
        console.error("Error create order:", err);
        res.status(500).json({ success: false, message: "เกิดข้อผิดพลาดในการบันทึกประวัติ" });
    }
};

// ดึงประวัติการขายของร้าน
export const getOrdersByStore = async (req, res) => {
    try {
        const { storeId } = req.params;
        const orders = await OrderHistory.find({ storeId }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, orders });
    } catch (err) {
        console.error("Error get orders:", err);
        res.status(500).json({ success: false, message: "เกิดข้อผิดพลาดในการดึงข้อมูล" });
    }
};
