import mongoose from "mongoose";

const serviceOrderSchema = new mongoose.Schema({
  storeId: { type: mongoose.Schema.Types.ObjectId, ref: "Store", required: true },

  queueNumber: { type: Number, required: true }, // รันคิวต่อเนื่องภายในร้าน
  status: {
    type: String,
    enum: ["waiting", "inProgress", "done", "paid"],
    default: "waiting",
  },

  staffId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  staffName: String, // เพื่อแสดงเร็ว ๆ โดยไม่ต้อง populate

  services: [
    {
      serviceId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      name: String,
      price: Number,
    },
  ],

  total: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model("ServiceOrder", serviceOrderSchema);
