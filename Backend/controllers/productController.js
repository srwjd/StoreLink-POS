import Product from "../models/productModel.js";
import mongoose from "mongoose";

// Utility: ตรวจสอบและทำความสะอาด optionGroups จาก request
function sanitizeOptionGroups(input) {
  if (!input) return [];
  if (!Array.isArray(input)) throw new Error("optionGroups รูปแบบไม่ถูกต้อง");

  return input.map((group) => {
    if (!group || typeof group !== "object") throw new Error("option group ไม่ถูกต้อง");

    const name = String(group.name || "").trim();
    if (!name) throw new Error("option group ต้องมีชื่อ");

    const selectionType = ["single", "multiple"].includes(group.selectionType)
      ? group.selectionType
      : "single";
    const required = Boolean(group.required);
    const maxSelections = group.maxSelections != null ? Number(group.maxSelections) : undefined;

    const choicesInput = Array.isArray(group.choices) ? group.choices : [];
    if (choicesInput.length === 0) throw new Error(`กลุ่ม ${name} ต้องมี choices อย่างน้อย 1 ตัวเลือก`);

    let defaultCount = 0;
    const choices = choicesInput.map((c) => {
      const label = String(c?.label || "").trim();
      if (!label) throw new Error(`choices ในกลุ่ม ${name} ต้องมี label`);
      const value = c?.value != null ? String(c.value) : undefined;
      const priceDelta = c?.priceDelta != null ? Number(c.priceDelta) : 0;
      const isDefault = Boolean(c?.isDefault);
      if (isDefault) defaultCount += 1;
      return { label, value, priceDelta, isDefault };
    });

    if (selectionType === "single" && defaultCount > 1) {
      throw new Error(`กลุ่ม ${name} (single) มีค่า isDefault เกิน 1`);
    }
    if (selectionType === "multiple" && maxSelections != null) {
      if (!Number.isFinite(maxSelections) || maxSelections <= 0) {
        throw new Error(`กลุ่ม ${name} กำหนด maxSelections ไม่ถูกต้อง`);
      }
      if (maxSelections > choices.length) {
        throw new Error(`กลุ่ม ${name} กำหนด maxSelections มากกว่าจำนวน choices`);
      }
    }

    return { name, selectionType, required, maxSelections, choices };
  });
}

/* -------------------------------------------
   ✅ 1. สร้างสินค้าใหม่
------------------------------------------- */
export const createProduct = async (req, res) => {
  try {
    const { storeId, barcode, name, category, type, price, unit, stockQty, serialList, description, optionGroups, productImage } = req.body;

    if (!storeId || !name || !price)
      return res.status(400).json({ message: "กรุณากรอกข้อมูลสินค้าหลักให้ครบ" });

    // ตรวจสอบ optionGroups ถ้ามีส่งมา
    let sanitizedOptionGroups = [];
    try {
      sanitizedOptionGroups = sanitizeOptionGroups(optionGroups);
    } catch (e) {
      return res.status(400).json({ message: e.message });
    }

    // แปลง serialList ให้เป็นรูปแบบ { serialNumber, status }
    let normalizedSerialList = [];
    if (type === "serialized" && Array.isArray(serialList)) {
      normalizedSerialList = serialList.map((sn) => {
        if (typeof sn === "string") return { serialNumber: sn, status: "available" };
        if (sn && typeof sn === "object") {
          return {
            serialNumber: String(sn.serialNumber || "").trim(),
            status: ["available", "sold"].includes(sn.status) ? sn.status : "available",
          };
        }
        return null;
      }).filter(Boolean);
    }

    const newProduct = await Product.create({
      storeId,
      barcode: barcode || "",
      name,
      category,
      type: type || "standard",
      price,
      unit: unit || "",
      stockQty: type === "serialized" ? (normalizedSerialList.length) : (stockQty || ""),
      serialList: type === "serialized" ? normalizedSerialList : [],
      description: description || "",
      optionGroups: sanitizedOptionGroups,
      productImage: productImage || "",
    });

    res.status(201).json({ message: "สร้างสินค้าสําเร็จ", product: newProduct });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการสร้างสินค้า" });
  }
}

/* -------------------------------------------
   ✅ 2. ดึงสินค้าทั้งหมดของร้าน
------------------------------------------- */
export const getProductsByStore = async (req, res) => {
  try {
    const { storeId } = req.params;
    const products = await Product.find({ storeId });
    res.status(200).json({ products });
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
    const updateData = { ...req.body };

    if (Object.prototype.hasOwnProperty.call(updateData, "optionGroups")) {
      try {
        updateData.optionGroups = sanitizeOptionGroups(updateData.optionGroups);
      } catch (e) {
        return res.status(400).json({ message: e.message });
      }
    }

    // แปลง optionGroups ถ้ามี (ทำแล้วด้านบน)

    // แปลง serialList ถ้าส่งมา และ sync stockQty สำหรับสินค้า serialized
    if (Object.prototype.hasOwnProperty.call(updateData, "serialList")) {
      const targetType = updateData.type; // อาจส่งมาพร้อมกัน
      // หากไม่ได้ส่ง type มา ให้ดูจากใน DB ว่าเป็น serialized หรือไม่
      const existing = !targetType ? await Product.findById(id).select("type") : null;
      const isSerialized = (targetType || existing?.type) === "serialized";
      if (isSerialized) {
        const list = Array.isArray(updateData.serialList) ? updateData.serialList : [];
        updateData.serialList = list.map((sn) => {
          if (typeof sn === "string") return { serialNumber: sn, status: "available" };
          if (sn && typeof sn === "object") {
            return {
              serialNumber: String(sn.serialNumber || "").trim(),
              status: ["available", "sold"].includes(sn.status) ? sn.status : "available",
            };
          }
          return null;
        }).filter(Boolean);
        updateData.stockQty = updateData.serialList.length;
      } else {
        // ถ้าไม่ใช่ serialized ให้ลบ serialList ทิ้งถ้าเผลอส่งมา
        delete updateData.serialList;
      }
    }

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

// ✅ ดึงหมวดหมู่ทั้งหมดของร้าน
export const getCategoriesByStore = async (req, res) => {
  try {
    const { storeId } = req.params;
    const categories = await Product.distinct("category", { storeId });

    res.status(200).json(categories.filter(Boolean)); // เอาเฉพาะค่าที่ไม่ว่าง
  } catch (err) {
    res.status(500).json({ message: "ไม่สามารถดึงหมวดหมู่ได้", error: err.message });
  }
};
