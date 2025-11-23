import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

// 📦 import models
import User from "./models/userModel.js";
import Store from "./models/storeModel.js";
import Position from "./models/positionModel.js";
import Product from "./models/productModel.js";
import Order from "./models/OrderModel.js";

dotenv.config();

const MONGO_URL = process.env.MONGO_URL || "mongodb://localhost:27017/storelink";

// ✅ ข้อมูลตั้งต้น
const storeTypes = ["general", "restaurant", "service"];

const permissionsByRole = {
  Owner: ["sale", "product", "manage_employees", "report", "settings", "all_receipts", "kitchen"],
  Manager: ["sale", "product", "report", "all_receipts"],
  Cashier: ["sale", "all_receipts"]
};

// 🛍️ สินค้าทดลองแต่ละประเภทร้าน
const sampleProducts = {
  general: [
    { name: "เสื้อยืดสีขาว", category: "แฟชั่น", price: 199, unit: "ชิ้น", stockQty: 50 },
    { name: "สมุดโน้ต", category: "เครื่องเขียน", price: 25, unit: "เล่ม", stockQty: 100 },
  ],
  restaurant: [
    { name: "ข้าวผัดกุ้ง", category: "อาหารจานหลัก", price: 65, unit: "จาน" },
    { name: "ชาเย็น", category: "เครื่องดื่ม", price: 35, unit: "แก้ว" },
  ],
  service: [
    { name: "ตัดผมชาย", category: "บริการตัดผม", price: 150, unit: "ครั้ง" },
    { name: "ล้างรถ", category: "บริการรถยนต์", price: 200, unit: "ครั้ง" },
  ]
};

async function seed() {
  try {
    console.log("⏳ Connecting to MongoDB...");
    await mongoose.connect(MONGO_URL);
    console.log("✅ Connected to MongoDB");

    // 💥 ล้างข้อมูลเก่า (ถ้าต้องการ reset)
    await Promise.all([
      User.deleteMany(),
      Store.deleteMany(),
      Position.deleteMany(),
      Product.deleteMany(),
      Order.deleteMany(),
    ]);

    // 👤 สร้าง Admin
    const hashedPassword = await bcrypt.hash("123456", 10);
    const admin = await User.create({
      firstName: "Admin",
      lastName: "StoreLink",
      email: "admin@storelink.com",
      password: hashedPassword,
      role: "Admin",
    });
    console.log("👑 Admin created:", admin.email);

    // 🏪 สร้างร้านตัวอย่างและข้อมูลตามประเภท
    for (const type of storeTypes) {
      const store = await Store.create({
        ownerId: admin._id,
        storeName: `ร้านตัวอย่าง (${type})`,
        storeType: type,
        phone: "0812345678",
        address: "123 ถนนสุขุมวิท กรุงเทพฯ",
        taxRate: 7,
        paymentSettings: { cash: true, promptpay: true, promptpayNumber: "0123456789" },
      });
      console.log(`🏪 Created store: ${store.storeName}`);

      // 💼 เพิ่มตำแหน่ง (Position)
      for (const [role, perms] of Object.entries(permissionsByRole)) {
        await Position.create({
          storeId: store._id,
          positionName: role,
          permissions: perms,
        });
      }
      console.log(`📌 Positions created for ${type} store`);

      // 🛒 เพิ่มสินค้าทดลอง
      const products = sampleProducts[type] || [];
      for (const p of products) {
        await Product.create({
          storeId: store._id,
          name: p.name,
          category: p.category,
          price: p.price,
          unit: p.unit,
          stockQty: p.stockQty || null,
          type: "standard",
          status: "available",
        });
      }
      console.log(`🛍️ Sample products created for ${type} store`);
    }

    console.log("✅ SEEDING COMPLETED SUCCESSFULLY!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding data:", err);
    process.exit(1);
  }
}

seed();
