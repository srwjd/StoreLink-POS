import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
    storeId: { type: mongoose.Schema.Types.ObjectId, ref: "Store", required: true },
    reportType: { type: String, enum: ["daily", "monthly", "custom"], required: true },
    startDate: Date,
    endDate: Date,
    totalSales: { type: Number, default: 0 },
    totalTransactions: { type: Number, default: 0 },
    topProducts: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
            name: String,
            totalSold: Number
        }
    ]
}, { timestamps: true });

export default mongoose.model("Report", reportSchema);