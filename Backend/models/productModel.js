import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    storeId: { type: mongoose.Schema.Types.ObjectId, ref: "Store", required: true },
    name: { type: String, required: true },
    category: String,
    type: { type: String, enum: ["standard", "serialized"], default: "standard" },
    price: { type: Number, required: true },
    unit: String,
    stockQty: { type: Number, default: 0 },
    serialList: [
        {
            serialNumber: { type: String, unique: true, sparse: true },
            status: { type: String, enum: ["available", "sold"], default: "available" }
        }
    ],
    status: { type: String, enum: ["available", "out-of-stock"], default: "available" },
    description: String
}, { timestamps: true });

export default mongoose.model("Product", productSchema);