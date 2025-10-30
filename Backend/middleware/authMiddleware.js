
import jwt from "jsonwebtoken";

export function requireAuth(req, res, next) {
    try {
        const token = req.cookies?.token || (req.headers.authorization || "").replace("Bearer ", "");
        if (!token) return res.status(401).json({ message: "Unauthorized" });
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.user = payload; // { userId, role, storeId? }
        next();
    } catch (e) {
        return res.status(401).json({ message: "Invalid token" });
    }
}
