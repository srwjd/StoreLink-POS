import Order from "../models/OrderModel.js";
import Product from "../models/productModel.js";
import Table from "../models/tableModel.js";
import mongoose from "mongoose";

// ✅ createOrder รองรับทั้งร้านทั่วไปและร้านอาหาร
export const createOrder = async (req, res) => {
    try {
        const {
            storeId, userId, tableNumber, queueNumber,
            subTotal, tax, total, items, isInstantPay,
            paymentMethod, paidAmount, changeAmount
        } = req.body;

        // ✅ ตรวจสอบว่าสินค้าพอไหมก่อนสร้างออเดอร์
        for (const item of items) {
            const product = await Product.findById(item.productId);
            if (!product) {
                return res.status(400).json({ error: `ไม่พบสินค้า ${item.name}` });
            }

            if (product.stockQty != null && product.stockQty < item.qty) {
                return res.status(400).json({
                    error: `สินค้า "${product.name}" มีสต็อกไม่เพียงพอ (${product.stockQty} ชิ้นคงเหลือ)`
                });
            }
        }

        // 🧾 สร้างออเดอร์
        const order = await Order.create({
            storeId,
            userId,
            tableNumber: tableNumber || null,
            queueNumber: queueNumber || null,
            items: items || [],
            subTotal,
            tax,
            total,
            paymentMethod: paymentMethod || "none",
            paidAmount: paidAmount || 0,
            changeAmount: changeAmount || 0,
            status: isInstantPay ? "paid" : "pending",
        });

        // 📦 ถ้าชำระทันที → ตัดสต็อก
        if (isInstantPay) {
            for (const item of items) {
                const product = await Product.findById(item.productId);
                if (product && product.stockQty != null) {
                    product.stockQty = Math.max(product.stockQty - item.qty, 0);
                    await product.save();
                }
            }
        }

        // 🍽️ ถ้ามีโต๊ะ → mark โต๊ะว่า occupied
        if (tableNumber) {
            await Table.findOneAndUpdate(
                { storeId, tableNumber },
                { status: "occupied", currentOrder: order._id },
                { new: true }
            );
        }

        return res.status(201).json({
            message: isInstantPay
                ? "✅ Order created and paid successfully"
                : "🧾 Order created and pending payment",
            order,
        });
    } catch (err) {
        console.error("❌ Error creating order:", err);
        res.status(500).json({ error: "Failed to create order" });
    }
};



// 2️⃣ เพิ่มเมนูในบิลที่ยังเปิดอยู่
export const addItemToOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order || order.status !== "pending")
            return res.status(400).json({ error: "Order not found or already paid" });

        order.items.push(req.body);
        await order.save();
        res.json({ message: "✅ Item added", order });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to add item" });
    }
};

// 3️⃣ ชำระเงินและปิดบิล
export const payOrder = async (req, res) => {
    try {
        const { paymentMethod, paidAmount, changeAmount } = req.body;
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ error: "Order not found" });

        order.paymentMethod = paymentMethod;
        order.paidAmount = paidAmount;
        order.changeAmount = changeAmount;
        order.status = "paid"; // ✅ เพิ่มสถานะ
        order.paidAt = new Date();

        // ✅ ถ้ามีโต๊ะ → เปลี่ยนสถานะเป็น paid
        if (order.tableNumber) {
            await Table.findOneAndUpdate(
                { storeId: order.storeId, tableNumber: order.tableNumber },
                { status: "paid", currentOrder: null }
            );
        }

        // 📦 ตัดสต็อก
        for (const item of order.items) {
            const product = await Product.findById(item.productId);
            if (product && product.stockQty != null) {
                product.stockQty = Math.max(product.stockQty - item.qty, 0);
                await product.save();
            }
        }

        await order.save();
        res.json({ message: "💰 Payment successful", order });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to pay order" });
    }
};

// 4️⃣ ดูใบเสร็จ
export const getReceipt = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate("storeId", "storeName address phone paymentSettings")
            .populate("userId", "firstName lastName email");

        if (!order) return res.status(404).json({ error: "Receipt not found" });

        res.json({
            receiptId: order._id,
            storeName: order.storeId?.storeName || "ร้านค้า",
            address: order.storeId?.address || "-",
            phone: order.storeId?.phone || "-",
            cashier: order.userId
                ? `${order.userId.firstName} ${order.userId.lastName}`
                : "ไม่ระบุ",
            items: order.items,
            subTotal: order.subTotal,
            tax: order.tax,
            total: order.total,
            paymentMethod: order.paymentMethod,
            paidAmount: order.paidAmount,
            changeAmount: order.changeAmount,
            createdAt: order.createdAt,
        });
    } catch (err) {
        console.error("❌ Error fetching receipt:", err);
        res.status(500).json({ error: "Failed to fetch receipt" });
    }
};


// 5️⃣ ดูใบเสร็จทั้งหมดของร้าน
export const getAllReceipts = async (req, res) => {
    try {
        const { storeId } = req.params;

        // ✅ ตรวจว่าถูกต้อง
        if (!storeId || !mongoose.Types.ObjectId.isValid(storeId)) {
            return res.status(400).json({ error: "Invalid storeId" });
        }

        const receipts = await Order.find({ storeId: new mongoose.Types.ObjectId(storeId) })
            .populate("storeId", "storeName address phone paymentSettings")
            .populate("userId", "firstName lastName email")
            .sort({ createdAt: -1 });

        res.status(200).json(receipts);
    } catch (err) {
        console.error("❌ Error fetching receipts:", err);
        res.status(500).json({ error: "Failed to fetch receipts" });
    }
};

// 6️⃣ ยกเลิกใบเสร็จ
export const cancelReceipt = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ error: "Receipt not found" });
        order.status = "canceled";
        await order.save();
        res.json({ message: "🗑️ Receipt canceled", order });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to cancel receipt" });
    }
};