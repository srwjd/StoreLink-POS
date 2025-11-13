import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    storeId: { type: mongoose.Schema.Types.ObjectId, ref: "Store", required: true },
    barcode: { type: String, unique: true, sparse: true },
    name: { type: String, required: true },
    category: String,
    type: { type: String, enum: ["standard", "serialized"], default: "standard" },
    price: { type: Number, required: true },
    unit: String,
    duration: { type: Number, default: 0 },
    stockQty: { type: Number, default: 0 },
    optionGroups: [
        {
            name: { type: String, required: true }, // e.g., "Sweetness", "Toppings"
            selectionType: { type: String, enum: ["single", "multiple"], default: "single" },
            required: { type: Boolean, default: false },
            maxSelections: { type: Number }, // used when selectionType === "multiple"
            choices: [
                {
                    label: { type: String, required: true }, // e.g., "No Sugar", "Less", "Normal", "Boba"
                    value: { type: String }, // optional machine value; defaults to label on UI
                    priceDelta: { type: Number, default: 0 }, // additional (+/-) price
                    isDefault: { type: Boolean, default: false }
                }
            ]
        }
    ],
    serialList: [
        {
            serialNumber: { type: String, unique: true, sparse: true },
            status: { type: String, enum: ["available", "sold"], default: "available" }
        }
    ],
    status: { type: String, enum: ["available", "unavailable"], default: "available" },
    description: String,
    productImage: { type: String, default: "" },
}, { timestamps: true });

export default mongoose.model("Product", productSchema);