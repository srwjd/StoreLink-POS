import bcrypt from "bcryptjs";
import User from "../models/userModel.js";
import Position from "../models/positionModel.js";

// 🔹 ดึงพนักงานทั้งหมดของร้าน
export const getEmployees = async (req, res) => {
  try {
    const user = req.user;

    if (!user) return res.status(401).json({ message: "Unauthorized" });

    const { storeId } = req.params;

    const employees = await User.find({
      storeIds: storeId,
      role: "Employee",
    }).populate("storeIds", "storeName").populate({
      path: "positionId",
      model: "Position",
    });

    res.status(200).json({ employees });
  } catch (err) {
    res.status(500).json({ message: "เกิดข้อผิดพลาด", error: err.message });
  }
};

// 🔹 สร้างพนักงานใหม่
export const createEmployee = async (req, res) => {
  try {
    const { storeId } = req.params;
    const { firstName, lastName, email, password, positionId } = req.body;

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "อีเมลนี้ถูกใช้แล้ว" });

    const hashed = await bcrypt.hash(password, 10);

    const newEmployee = await User.create({
      firstName,
      lastName,
      email,
      password: hashed,
      role: "Employee",
      storeIds: [storeId],
      positionId,
    });

    res.status(201).json({
      message: "เพิ่มพนักงานสำเร็จ",
      employee: newEmployee,
    });
  } catch (err) {
    res.status(500).json({ message: "เกิดข้อผิดพลาด", error: err.message });
  }
};

// 🔹 ลบพนักงาน
export const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    res.status(200).json({ message: "ลบพนักงานสำเร็จ" });
  } catch (err) {
    res.status(500).json({ message: "เกิดข้อผิดพลาด", error: err.message });
  }
};
