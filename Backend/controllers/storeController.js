import Store from "../models/storeModel.js";
import User from "../models/userModel.js";
import Position from "../models/positionModel.js";

export const createStore = async (req, res) => {
    try {
        const { name, type, address, phone, taxRate, paymentSettings } = req.body;

        // ตรวจสอบข้อมูลหลัก
        if (!name || !type)
            return res.status(400).json({ message: "กรุณากรอกชื่อร้านและประเภทร้าน" });

        const validPayment = {
            cash: paymentSettings?.cash ?? true,
            qrPromptPay: paymentSettings?.qrPromptPay ?? false,
            promptPayNumber: paymentSettings?.promptPayNumber ?? "",
        };

        // ✅ ใช้ new + save แทน create เพื่อให้ pre("save") ทำงานแน่
        const store = new Store({
            ownerId: req.user.id,
            storeName: name,
            storeType: type,
            address,
            phone,
            taxRate: taxRate || 0,
            paymentSettings: validPayment,
        });

        await store.save(); // ✅ จะ generate storeCode ให้อัตโนมัติที่นี่

        // ✅ เพิ่ม store ลงใน user
        await User.findByIdAndUpdate(req.user.id, { $push: { storeIds: store._id } });

        // ✅ สร้างตำแหน่งเริ่มต้น
        const basePositions = [
            {
                storeId: store._id,
                positionName: "Manager",
                permissions: ["sale", "manage_employees", "report", "settings"],
            },
            {
                storeId: store._id,
                positionName: "Cashier",
                permissions: ["sale"],
            },
        ];
        await Position.insertMany(basePositions);

        // ✅ ส่งผลลัพธ์กลับ
        res.status(201).json({
            message: "สร้างร้านค้าสำเร็จ",
            store: {
                id: store._id,
                storeCode: store.storeCode,
                name: store.storeName,
                type: store.storeType,
                paymentSettings: store.paymentSettings,
            },
        });
    } catch (err) {
        console.error("❌ Create Store Error:", err);
        res.status(500).json({ message: "เกิดข้อผิดพลาด", error: err.message });
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

export const getStoreById = async (req, res) => {
  try {
    const store = await Store.findById(req.params.id);
    res.status(200).json(store);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

export const updateStore = async (req, res) => {
  try {
    const store = await Store.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(store);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

