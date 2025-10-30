import Store from "../models/storeModel.js";
import User from "../models/userModel.js";
import Position from "../models/positionModel.js";

export const createStore = async (req, res) => {
    try {
        const { name, type, address, phone, taxRate, paymentSettings } = req.body;

        if (!name || !type)
            return res.status(400).json({ message: "กรุณากรอกชื่อร้านและประเภทร้าน" });

        const validPayment = {
            cash: paymentSettings?.cash ?? true,
            qrPromptPay: paymentSettings?.promptpay ?? false,
            promptPayNumber: paymentSettings?.promptpayNumber ?? "",
        };

        const newStore = await Store.create({
            ownerId: req.user.id,
            storeName: name,
            storeType: type,
            address,
            phone,
            taxRate: taxRate || 0,
            paymentSettings: validPayment,
        });

        await User.findByIdAndUpdate(req.user.id, {
            $push: { storeIds: newStore._id },
        });

        const basePositions = [
            {
                storeId: newStore._id,
                positionName: "Manager",
                permissions: ["sell", "manage_employees", "report", "settings"],
            },
            {
                storeId: newStore._id,
                positionName: "Cashier",
                permissions: ["sell"],
            },
        ];
        await Position.insertMany(basePositions);

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
        res.status(500).json({
            message: "เกิดข้อผิดพลาด",
            error: err.message,
        });
    }
};


export const getMyStores = async (req, res) => {
    try {
        const user = req.user;
        let stores = [];

        const foundUser = await User.findById(user.id);
        if (!foundUser)
            return res.status(404).json({ message: "ไม่พบผู้ใช้" });

        if (foundUser.role === "Owner") {
            stores = await Store.find({ ownerId: foundUser._id });
        }

        else if (["Employee"].includes(foundUser.role)) {
            stores = await Store.find({ _id: { $in: foundUser.storeIds } });
        }

        else {
            return res.status(403).json({ message: "ไม่มีสิทธิ์เข้าถึงข้อมูลร้านค้า" });
        }

        res.status(200).json({
            role: foundUser.role,
            stores,
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "เกิดข้อผิดพลาด",
            error: err.message,
        });
    }
};

