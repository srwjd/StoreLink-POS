import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

export async function login(req, res, next) {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username, status: "active" });
        if (!user) return res.status(401).json({ message: "User not found" });

        const ok = await bcrypt.compare(password, user.password);
        if (!ok) return res.status(401).json({ message: "Invalid credentials" });

        const payload = { userId: user._id, role: user.role, storeId: user.storeId || null };
        const token = jwt.sign(payload, process.env.JWT_SECRET || "dev_secret", { expiresIn: "1d" });

        // ส่งทั้ง cookie และ body เพื่อความสะดวก
        res.cookie("token", token, { httpOnly: true, sameSite: "lax", secure: false });
        res.json({ message: "Login success", token, user: payload });
    } catch (e) { next(e); }
}
