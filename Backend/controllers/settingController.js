import Store from "../models/storeModel.js";
import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import fs from "fs";
import path from "path";

// ✅ ตรวจสอบรหัสผ่านก่อนแก้ไข
async function verifyPassword(userId, password) {
  const user = await User.findById(userId);
  if (!user) throw new Error("ไม่พบผู้ใช้");
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("รหัสผ่านไม่ถูกต้อง");
  return user;
}

// ✅ เปลี่ยนชื่อร้าน
export const updateStoreName = async (req, res) => {
  try {
    const { storeId } = req.params;
    const { storeName, password } = req.body;
    const userId = req.user.id; // มาจาก middleware auth

    await verifyPassword(userId, password);

    const store = await Store.findOneAndUpdate(
      { _id: storeId, ownerId: userId },
      { storeName },
      { new: true }
    );

    if (!store) return res.status(404).json({ message: "ไม่พบร้าน" });
    res.json({ message: "เปลี่ยนชื่อร้านสำเร็จ", store });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ✅ เปลี่ยนการตั้งค่าการชำระเงิน
export const updatePaymentSettings = async (req, res) => {
  try {
    const { storeId } = req.params;
    const { cash, qrPromptPay, promptPayNumber, password } = req.body;
    const userId = req.user.id;

    await verifyPassword(userId, password);

    const store = await Store.findOneAndUpdate(
      { _id: storeId, ownerId: userId },
      {
        paymentSettings: { cash, qrPromptPay, promptPayNumber },
      },
      { new: true }
    );

    if (!store) return res.status(404).json({ message: "ไม่พบร้าน" });
    res.json({ message: "อัปเดตการตั้งค่าชำระเงินสำเร็จ", store });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ✅ เปลี่ยนโลโก้ร้าน (อัปโหลดไฟล์)
export const updateStoreLogo = async (req, res) => {
  try {
    const { storeId } = req.params;
    const { password } = req.body;
    const userId = req.user.id;

    await verifyPassword(userId, password);

    if (!req.file) return res.status(400).json({ message: "กรุณาอัปโหลดรูปโลโก้" });

    const logoPath = `/uploads/store_logos/${req.file.filename}`;

    const store = await Store.findOneAndUpdate(
      { _id: storeId, ownerId: userId },
      { logo: logoPath },
      { new: true }
    );

    if (!store) return res.status(404).json({ message: "ไม่พบร้าน" });
    res.json({ message: "อัปเดตโลโก้ร้านสำเร็จ", store });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ✅ ลบร้าน (ต้องกรอกรหัสผ่าน)
export const deleteStore = async (req, res) => {
  try {
    const { storeId } = req.params;
    const { password } = req.body;
    const userId = req.user.id;

    await verifyPassword(userId, password);

    const store = await Store.findOneAndDelete({ _id: storeId, ownerId: userId });
    if (!store) return res.status(404).json({ message: "ไม่พบร้าน" });

    res.json({ message: "ลบร้านเรียบร้อยแล้ว" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ✅ อัปเดตข้อมูลติดต่อร้าน
export const updateStoreContact = async (req, res) => {
  try {
    const { storeId } = req.params;
    const { address, phone, password } = req.body;
    const userId = req.user.id;

    // ตรวจสอบรหัสผ่าน
    await verifyPassword(userId, password);

    const store = await Store.findOneAndUpdate(
      { _id: storeId, ownerId: userId },
      { address, phone },
      { new: true }
    );

    if (!store) return res.status(404).json({ message: "ไม่พบร้าน" });

    res.json({ message: "อัปเดตข้อมูลติดต่อร้านสำเร็จ", store });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

