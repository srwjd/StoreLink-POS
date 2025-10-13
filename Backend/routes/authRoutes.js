import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

const router = express.Router();

// สมัครสมาชิก
router.post("/register", async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;

        if (!firstName || !lastName || !email || !password)
            return res.status(400).json({ message: "กรุณากรอกข้อมูลให้ครบ" });

        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ message: "อีเมลนี้ถูกใช้แล้ว" });

        // const storeId = new mongoose.Types.ObjectId();
        const hashed = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            firstName,
            lastName,
            email,
            password: hashed,
            role: "Owner",
        });

        const token = jwt.sign(
            { id: newUser._id, email: newUser.email, role: newUser.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.status(201).json({
            message: "สมัครสมาชิกสำเร็จ",
            user: {
                id: newUser._id,
                name: `${newUser.firstName} ${newUser.lastName}`,
                email: newUser.email,
            },
            token,
        });
    } catch (err) {
        res.status(500).json({ message: "เกิดข้อผิดพลาด", error: err.message });
    }
});

export default router;
