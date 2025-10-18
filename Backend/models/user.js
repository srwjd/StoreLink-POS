import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        role: {
            type: String,
            enum: ["Owner", "Manager", "Employee", "Admin"],
            default: "Owner",
        },
        storeIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Store" }],
    },
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
