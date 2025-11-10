import Table from "../models/tableModel.js";


// ดึงโต๊ะทั้งหมดในร้าน
export const getTablesByStore = async (req, res) => {
  const { storeId } = req.params;
  try {
    const tables = await Table.find({ storeId }).populate("currentOrder");
    res.json(tables);
  } catch (err) {
    res.status(500).json({ error: "Failed to load tables" });
  }
};

// เพิ่มโต๊ะใหม่
export const createTable = async (req, res) => {
  const { storeId } = req.params;
  const { tableNumber, capacity } = req.body;
  try {
    const newTable = await Table.create({ storeId, tableNumber, capacity });
    res.status(201).json(newTable);
  } catch (err) {
    res.status(500).json({ error: "Failed to create table" });
  }
};

// เปลี่ยนสถานะโต๊ะ
export const updateTableStatus = async (req, res) => {
  const { tableId } = req.params;
  const { status } = req.body;
  try {
    const table = await Table.findByIdAndUpdate(
      tableId,
      { status },
      { new: true }
    );
    res.json(table);
  } catch (err) {
    res.status(500).json({ error: "Failed to update table status" });
  }
};

// ผูกโต๊ะกับออเดอร์
export const linkOrderToTable = async (req, res) => {
  const { tableId, orderId } = req.params;
  try {
    const table = await Table.findById(tableId);
    table.currentOrder = orderId;
    table.status = "occupied";
    await table.save();
    res.json({ message: "✅ Table linked to order", table });
  } catch (err) {
    res.status(500).json({ error: "Failed to link table" });
  }
};

// เคลียร์โต๊ะ
export const clearTable = async (req, res) => {
  const { tableId } = req.params;
  try {
    const table = await Table.findById(tableId);
    table.status = "available";
    table.currentOrder = null;
    await table.save();
    res.json({ message: "🧹 Table cleared", table });
  } catch (err) {
    res.status(500).json({ error: "Failed to clear table" });
  }
};

// ลบโต๊ะ
export const deleteTable = async (req, res) => {
  const { tableId } = req.params;
  try {
    await Table.findByIdAndDelete(tableId);
    res.json({ message: "🗑️ Table deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete table" });
  }
};
