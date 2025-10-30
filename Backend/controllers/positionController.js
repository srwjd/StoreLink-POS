import Position from "../models/positionModel.js";

// 🔹 ดึงตำแหน่งทั้งหมดในร้าน
export const getPositions = async (req, res) => {
    try {
        const { storeId } = req.params;
        const positions = await Position.find({ storeId });
        res.status(200).json({ positions });
    } catch (err) {
        res.status(500).json({ message: "เกิดข้อผิดพลาด", error: err.message });
    }
};

// 🔹 สร้างตำแหน่งใหม่
export const createPosition = async (req, res) => {
    try {
        const { storeId, positionName, permissions } = req.body;

        const exists = await Position.findOne({ storeId, positionName });
        if (exists)
            return res.status(400).json({ message: "มีชื่อตำแหน่งนี้อยู่แล้ว" });

        const newPos = await Position.create({ storeId, positionName, permissions });
        res.status(201).json({ message: "สร้างตำแหน่งสำเร็จ", position: newPos });
    } catch (err) {
        res.status(500).json({ message: "เกิดข้อผิดพลาด", error: err.message });
    }
};

// 🔹 แก้ไขตำแหน่ง
export const updatePosition = async (req, res) => {
    try {
        const { id } = req.params;
        const { positionName, permissions } = req.body;

        const updated = await Position.findByIdAndUpdate(
            id,
            { positionName, permissions },
            { new: true }
        );

        res.status(200).json({ message: "อัปเดตสำเร็จ", position: updated });
    } catch (err) {
        res.status(500).json({ message: "เกิดข้อผิดพลาด", error: err.message });
    }
};

// 🔹 ลบตำแหน่ง
export const deletePosition = async (req, res) => {
    try {
        const { id } = req.params;
        await Position.findByIdAndDelete(id);
        res.status(200).json({ message: "ลบตำแหน่งสำเร็จ" });
    } catch (err) {
        res.status(500).json({ message: "เกิดข้อผิดพลาด", error: err.message });
    }
};
