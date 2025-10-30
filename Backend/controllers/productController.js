import Product from "../models/productModel.js";
import mongoose from "mongoose";

/* -------------------------------------------
   ✅ 1. สร้างสินค้าใหม่
------------------------------------------- */
export const createProduct = async (req, res) => {
    try {
        const { storeId, name, category, type, price, unit, stockQty, serialList, description } = req.body;

        if (!storeId || !name || !price)
            return res.status(400).json({ message: "กรุณากรอกข้อมูลสินค้าหลักให้ครบ" });

        // ถ้าเป็นสินค้าแบบมี Serial
        let serials = [];
        if (type === "serialized" && Array.isArray(serialList)) {
            serials = serialList.map((s) => ({
                serialNumber: s.serialNumber,
                status: s.status || "available",
            }));
        }

        const newProduct = await Product.create({
            storeId,
            name,
            category,
            type: type || "standard",
            price,
            unit,
            stockQty: type === "standard" ? stockQty || 0 : serials.length,
            serialList: serials,
            description,
            status: "available",
        });

        res.status(201).json({
            message: "สร้างสินค้าสำเร็จ",
            product: newProduct,
        });
    } catch (err) {
        res.status(500).json({ message: "เกิดข้อผิดพลาด", error: err.message });
    }
};

/* -------------------------------------------
   ✅ 2. ดึงสินค้าทั้งหมดของร้าน
------------------------------------------- */
export const getProductsByStore = async (req, res) => {
    try {
        const { storeId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(storeId))
            return res.status(400).json({ message: "storeId ไม่ถูกต้อง" });

        const products = await Product.find({ storeId });

        res.status(200).json({ count: products.length, products });
    } catch (err) {
        res.status(500).json({ message: "เกิดข้อผิดพลาด", error: err.message });
    }
};

/* -------------------------------------------
   ✅ 3. ดึงสินค้ารายตัว
------------------------------------------- */
export const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);

        if (!product) return res.status(404).json({ message: "ไม่พบสินค้า" });

        res.status(200).json({ product });
    } catch (err) {
        res.status(500).json({ message: "เกิดข้อผิดพลาด", error: err.message });
    }
};

/* -------------------------------------------
   ✅ 4. อัปเดตสินค้า
------------------------------------------- */
export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const updated = await Product.findByIdAndUpdate(id, updateData, { new: true });

        if (!updated) return res.status(404).json({ message: "ไม่พบสินค้า" });

        res.status(200).json({ message: "อัปเดตสำเร็จ", product: updated });
    } catch (err) {
        res.status(500).json({ message: "เกิดข้อผิดพลาด", error: err.message });
    }
};

/* -------------------------------------------
   ✅ 5. ลบสินค้า
------------------------------------------- */
export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Product.findByIdAndDelete(id);

        if (!deleted) return res.status(404).json({ message: "ไม่พบสินค้า" });

        res.status(200).json({ message: "ลบสินค้าสำเร็จ" });
    } catch (err) {
        res.status(500).json({ message: "เกิดข้อผิดพลาด", error: err.message });
    }
};

/* -------------------------------------------
   ✅ 6. เพิ่ม Serial Number ให้สินค้าชนิด serialized
------------------------------------------- */
export const addSerialNumbers = async (req, res) => {
    try {
        const { id } = req.params;
        const { serialNumbers } = req.body; // ["A1001", "A1002", "A1003"]

        const product = await Product.findById(id);
        if (!product) return res.status(404).json({ message: "ไม่พบสินค้า" });

        if (product.type !== "serialized")
            return res.status(400).json({ message: "สินค้านี้ไม่รองรับ serial number" });

        const newSerials = serialNumbers.map((sn) => ({ serialNumber: sn, status: "available" }));

        product.serialList.push(...newSerials);
        product.stockQty = product.serialList.length;

        await product.save();

        res.status(200).json({ message: "เพิ่ม serial number สำเร็จ", product });
    } catch (err) {
        res.status(500).json({ message: "เกิดข้อผิดพลาด", error: err.message });
    }
};
