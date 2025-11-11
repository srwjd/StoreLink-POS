import Order from "../models/OrderModel.js";
import mongoose from "mongoose";

// 🧾 ดึงข้อมูลสรุปภาพรวม
export const getSummary = async (req, res) => {
    try {
        const { storeId } = req.params;
        const { range } = req.query;
        if (!storeId) return res.status(400).json({ error: "storeId is required" });

        const match = { storeId: new mongoose.Types.ObjectId(storeId) };
        const now = new Date();

        // 🕓 คำนวณช่วงเวลา
        if (range === "today") {
            const start = new Date(now.setHours(0, 0, 0, 0));
            match.createdAt = { $gte: start };
        } else if (range === "week") {
            const start = new Date();
            start.setDate(now.getDate() - 7);
            match.createdAt = { $gte: start };
        } else if (range === "month") {
            const start = new Date(now.getFullYear(), now.getMonth(), 1);
            match.createdAt = { $gte: start };
        } else if (range === "year") {
            const start = new Date(now.getFullYear(), 0, 1);
            match.createdAt = { $gte: start };
        }

        // 🔹 รวมยอดขายทั้งหมด
        const total = await Order.aggregate([
            { $match: match },
            { $group: { _id: null, totalSales: { $sum: "$total" }, totalOrders: { $sum: 1 } } },
        ]);

        const totalSales = total.length > 0 ? total[0].totalSales : 0;
        const totalOrders = total.length > 0 ? total[0].totalOrders : 0;

        // 🔸 สินค้าขายดี
        const topProduct = await Order.aggregate([
            { $match: match },
            { $unwind: "$items" },
            {
                $group: {
                    _id: "$items.name",
                    qty: { $sum: "$items.qty" },
                    total: { $sum: "$items.total" },
                },
            },
            { $sort: { qty: -1 } },
            { $limit: 1 },
        ]);

        return res.json({
            totalSales,
            totalOrders,
            bestProduct: topProduct[0]?._id || "-",
            totalCustomers: totalOrders,
        });
    } catch (err) {
        console.error("❌ Error in getSummary:", err);
        return res.status(500).json({ error: "Failed to fetch summary" });
    }
};


// 📈 กราฟยอดขายรายวัน (7 วันล่าสุด)
export const getSalesChart = async (req, res) => {
    try {
        const { storeId } = req.params;
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const sales = await Order.aggregate([
            {
                $match: {
                    storeId: new mongoose.Types.ObjectId(storeId),
                    createdAt: { $gte: sevenDaysAgo },
                },
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%d/%m", date: "$createdAt" } },
                    totalSales: { $sum: "$total" },
                },
            },
            { $sort: { "_id": 1 } },
        ]);

        res.json(sales.map((s) => ({ date: s._id, sales: s.totalSales })));
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch chart data" });
    }
};

// 🛍️ สินค้าขายดี 5 อันดับแรก
export const getTopProducts = async (req, res) => {
    try {
        const { storeId } = req.params;

        const topProducts = await Order.aggregate([
            { $match: { storeId: new mongoose.Types.ObjectId(storeId) } },
            { $unwind: "$items" },
            {
                $group: {
                    _id: "$items.name",
                    qty: { $sum: "$items.qty" },
                    total: { $sum: "$items.total" },
                },
            },
            { $sort: { qty: -1 } },
            { $limit: 5 },
        ]);

        res.json(topProducts.map((p) => ({
            name: p._id,
            qty: p.qty,
            total: p.total,
        })));
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch top products" });
    }
};

// 🕒 รายการล่าสุด 10 รายการ
export const getRecentOrders = async (req, res) => {
    try {
        const { storeId } = req.params;

        const orders = await Order.find({ storeId })
            .sort({ createdAt: -1 })
            .limit(10)
            .select("createdAt total paymentMethod userId");

        res.json(
            orders.map((o) => ({
                time: new Date(o.createdAt).toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" }),
                staff: o.userId ? o.userId.name || "ไม่ระบุ" : "-",
                total: o.total,
                payment: o.paymentMethod,
            }))
        );
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch recent orders" });
    }
};
