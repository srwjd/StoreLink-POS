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

