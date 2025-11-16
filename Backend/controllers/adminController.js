import Store from "../models/storeModel.js";
import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import fs from "fs";
import path from "path";

// 🟢 ดึงข้อมูลร้านค้าทั้งหมด
export const getAllStores = async (req, res) => {
  try {
    const stores = await Store.find()
      .populate("ownerId", "firstName lastName email") // ดึงข้อมูลจาก User
      .sort({ createdAt: -1 })
      .lean();

    // รวมชื่อเต็มจาก firstName + lastName
    const result = stores.map(store => ({
      ...store,
      ownerName: store.ownerId
        ? `${store.ownerId.firstName || ""} ${store.ownerId.lastName || ""}`.trim()
        : "ไม่ระบุ",
      ownerEmail: store.ownerId?.email || "",
    }));

    res.status(200).json(result);
  } catch (error) {
    console.error("❌ Error fetching stores:", error);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการดึงข้อมูลร้านค้า" });
  }
};

// 
export const getAllOwner = async (req, res) => {
  try {
    const users = await User.find({ role: "Owner" })
      .populate("storeIds", "storeName")
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const editPasswordOwner = async (req, res) => {
  try {
    const { id } = req.params;
    const { password } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "ไม่พบผู้ใช้" });
    }

    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "แก้ไขรหัสผ่านเรียบร้อยแล้ว" });
  } catch (error) {
    console.error("❌ Error editing password:", error);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการแก้ไขรหัสผ่าน" });
  }
};
// 🔴 ลบร้านค้า
export const deleteStore = async (req, res) => {
  try {
    const { id } = req.params;
    const store = await Store.findById(id);

    if (!store) {
      return res.status(404).json({ message: "ไม่พบร้านค้าที่ต้องการลบ" });
    }

    await Store.findByIdAndDelete(id);
    res.status(200).json({ message: "ลบร้านค้าเรียบร้อยแล้ว" });
  } catch (error) {
    console.error("❌ Error deleting store:", error);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการลบร้านค้า" });
  }
};

