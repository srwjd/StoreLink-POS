import mongoose from "mongoose";

const positionSchema = new mongoose.Schema({
  storeId: { type: mongoose.Schema.Types.ObjectId, ref: "Store", required: true },
  positionName: { type: String, required: true },
  permissions: [{ type: String }]
}, { timestamps: true });

export default mongoose.model("Position", positionSchema);
