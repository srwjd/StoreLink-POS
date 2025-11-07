import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  gender: { type: String, enum: ["Male", "Female", "Other"], default: null },
  birthDate: { type: Date, default: null },
  idCard: { type: String, default: null },
  idCardImage: { type: String, default: null },
  phone: { type: String, default: null },
  email: { type: String, default: null },
  address: { type: String, default: null },
  emergencyContact: { type: String, default: null },
  note: { type: String, default: null },
  username: { type: String, unique: true, sparse: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["Admin", "Owner", "Employee"], default: "Owner" },
  storeIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Store" }],
  positionId: { type: mongoose.Schema.Types.ObjectId, ref: "Position" },
  status: { type: String, enum: ["active", "inactive"], default: "active" },
  hireDate: { type: Date, default: Date.now },
  resignDate: { type: Date, default: null },
  salary: { type: Number, default: null },
  profileImage: { type: String, default: null }
}, { timestamps: true });

// Index for login - either email or username must exist
userSchema.index({ email: 1 }, { unique: true, sparse: true, partialFilterExpression: { email: { $exists: true, $ne: null } } });
userSchema.index({ username: 1 }, { unique: true, sparse: true });

export default mongoose.model("User", userSchema);