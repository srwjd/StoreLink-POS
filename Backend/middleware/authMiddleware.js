
import jwt from "jsonwebtoken";

export function requireAuth(req, res, next) {
    const token = req.cookies.token; // ⭐ อ่านจาก Cookie

    if (!token) {
        return res.status(401).json({ auth: false, message: "No token" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // ⭐ ส่งข้อมูล user จาก token ออกไป
        next();
    } catch (err) {
        return res.status(401).json({ auth: false, message: "Invalid token" });
    }
}
