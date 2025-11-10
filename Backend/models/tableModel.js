import mongoose from "mongoose";

const tableSchema = new mongoose.Schema({
  storeId: { type: mongoose.Schema.Types.ObjectId, ref: "Store", required: true },
  tableNumber: { type: String, required: true }, // เช่น "โต๊ะ 1"
  status: {
    type: String,
    enum: ["available", "occupied", "waiting_payment", "paid"],
    default: "available"
  },
  currentOrder: { type: mongoose.Schema.Types.ObjectId, ref: "OrderHistory", default: null },
  capacity: { type: Number, default: 4 }, // จำนวนที่นั่ง
  note: { type: String, default: "" },
});

export default mongoose.model("Table", tableSchema);
