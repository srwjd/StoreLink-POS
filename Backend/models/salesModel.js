import mongoose from "mongoose";

const salesSchema = new mongoose.Schema({
  storeId: { type: mongoose.Schema.Types.ObjectId, ref: "Store", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      name: String,
      price: Number,
      quantity: Number,
      serialNumber: String,
      subtotal: Number
    }
  ],
  totalAmount: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  tax: { type: Number, default: 0 },
  netTotal: { type: Number, required: true },
  paymentMethod: { type: String, enum: ["cash", "promptpay"], required: true },
  saleDate: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model("Sales", salesSchema);
