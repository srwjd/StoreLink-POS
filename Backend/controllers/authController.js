import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const registerUser = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;

        if (!firstName || !lastName || !email || !password)
            return res.status(400).json({ message: "กรุณากรอกข้อมูลให้ครบ" });

        const existing = await User.findOne({ email });
        if (existing)
            return res.status(400).json({ message: "อีเมลนี้ถูกใช้แล้ว" });

        const hashed = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            firstName,
            lastName,
            email,
            password: hashed,
            role: "Owner",
            positionId: null,
        });

        const token = jwt.sign(
            {
                id: newUser._id,
                email: newUser.email,
                role: newUser.role,
                storeIds: newUser.storeIds,
            },
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
        console.error(err);
        res.status(500).json({ message: "เกิดข้อผิดพลาด", error: err.message });
    }
};

export const login = async (req, res) => {
    try {
        const { email, username, password } = req.body;

        // ต้องมี email หรือ username อย่างน้อยหนึ่งอย่าง
        const loginIdentifier = email || username;
        if (!loginIdentifier || !password)
            return res.status(400).json({ message: "กรุณากรอกอีเมล/ชื่อผู้ใช้และรหัสผ่านให้ครบ" });

        // ค้นหาผู้ใช้ด้วย email หรือ username
        const user = await User.findOne(
            email ? { email } : { username }
        );
        
        if (!user)
            return res.status(401).json({ message: "อีเมล/ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
            return res.status(401).json({ message: "อีเมล/ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" });

        const token = jwt.sign(
            {
                id: user._id,
                email: user.email,
                username: user.username,
                role: user.role,
                storeIds: user.storeIds
            },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.status(200).json({ message: "เข้าสู่ระบบสำเร็จ", token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "เกิดข้อผิดพลาด", error: err.message });
    }
};

export const getProfile = async (req, res) => {
    try {
        const user = req.user; // มาจาก middleware requireAuth
        if (!user) return res.status(401).json({ message: "ไม่พบผู้ใช้" });

        res.status(200).json({
            message: "ข้อมูลโปรไฟล์",
            user,
        });
    } catch (err) {
        res.status(500).json({ message: "เกิดข้อผิดพลาด", error: err.message });
    }
};
