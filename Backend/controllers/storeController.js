import Store from "../models/store.js";
import User from "../models/user.js";
import jwt from "jsonwebtoken";

export const createStore = async (req, res) => {
    try {
        // ตรวจ token
        const authHeader = req.headers.authorization;
        if (!authHeader)
            return res.status(401).json({ message: "ไม่มี token" });

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const { name, type, address, phone, taxRate, paymentSettings } = req.body;

        if (!name || !type)
            return res.status(400).json({ message: "กรุณากรอกชื่อร้านและประเภทร้าน" });

        // ตรวจสอบค่า paymentSettings ที่ส่งมา
        const validPayment = {
            cash: paymentSettings?.cash ?? true,
            qrPromptPay: paymentSettings?.qrPromptPay ?? false,
            promptPayNumber: paymentSettings?.promptPayNumber ?? "",
        };

        // สร้างร้านใหม่
        const newStore = await Store.create({
            ownerId: decoded.id,
            name,
            type,
            address,
            phone,
            taxRate: taxRate || 0,
            paymentSettings: validPayment,
        });

        // เพิ่ม storeId ลงใน user (เจ้าของ)
        await User.findByIdAndUpdate(decoded.id, {
            $push: { storeIds: newStore._id },
        });

        res.status(201).json({
            message: "สร้างร้านค้าสำเร็จ",
            store: {
                id: newStore._id,
                storeId: newStore.storeId,
                name: newStore.name,
                type: newStore.type,
                paymentSettings: newStore.paymentSettings,
            },
        });
    } catch (err) {
        console.error(err);
        if (err.name === "JsonWebTokenError")
            return res.status(401).json({ message: "token ไม่ถูกต้อง" });

        res.status(500).json({ message: "เกิดข้อผิดพลาด", error: err.message });
    }
};

export const getMyStores = async (req, res) => {
    try {
        // ตรวจ token
        const authHeader = req.headers.authorization;
        if (!authHeader)
            return res.status(401).json({ message: "ไม่มี token" });

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const stores = await Store.find({ ownerId: decoded.id });

        res.status(200).json({ stores });
    } catch (err) {
        console.error(err);
        if (err.name === "JsonWebTokenError")
            return res.status(401).json({ message: "token ไม่ถูกต้อง" });

        res.status(500).json({ message: "เกิดข้อผิดพลาด", error: err.message });
    }
};