import mongoose from "mongoose";
const roleSchema = new mongoose.Schema({
    storeId: { type: mongoose.Types.ObjectId, ref: "Store", required: true },
    name: { type: String, required: true },
    permissions: [{ type: String }],
    isSystem: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model("Role", roleSchema);
