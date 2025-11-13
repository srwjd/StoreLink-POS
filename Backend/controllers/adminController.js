import Store from "../models/storeModel.js";

// 🟢 ดึงข้อมูลร้านค้าทั้งหมด
export const getAllStores = async (req, res) => {
  try {
    const stores = await Store.find()
      .populate("ownerId", "name email") // ดึงข้อมูลเจ้าของร้านบางส่วน
      .sort({ createdAt: -1 });

    res.status(200).json(stores);
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
