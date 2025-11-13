import Position from "../models/positionModel.js";

// 🔹 ดึงตำแหน่งทั้งหมดในร้าน
export const getPositions = async (req, res) => {
    try {
        const positions = await Position.find({ storeId: req.params.storeId });
        res.json({ positions });
    } catch (err) {
        res.status(500).json({ message: "เกิดข้อผิดพลาด", error: err.message });
    }
};

// 🔹 สร้างตำแหน่งใหม่
export const createPosition = async (req, res) => {
    try {
        const { positionName, permissions } = req.body;
        const newPos = await Position.create({
            storeId: req.params.storeId,
            positionName,
            permissions,
        });
        res.status(201).json({ message: "เพิ่มตำแหน่งสำเร็จ", position: newPos });
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

// 🔹 ดึงตำแหน่งตาม ID
// ✅ แก้ให้ถูกต้อง
export const getPositionById = async (req, res) => {
    try {
        const { id } = req.params; // <-- ใช้ id จาก params

        const position = await Position.findById(id);

        if (!position) {
            return res.status(404).json({ message: "ไม่พบตำแหน่งนี้" });
        }

        res.status(200).json({
            message: "ดึงตำแหน่งสำเร็จ",
            _id: position._id,
            positionName: position.positionName,
            permissions: position.permissions || [],
        });
    } catch (err) {
        console.error("❌ Error getPositionById:", err);
        res.status(500).json({ message: "เกิดข้อผิดพลาด", error: err.message });
    }
};

