// middleware/permissionMiddleware.js
import User from "../models/userModel.js";

export const requirePermission = (permission) => {
  return async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id).populate("positionId");
      if (!user) return res.status(404).json({ message: "ไม่พบผู้ใช้" });

      if (["Owner", "Admin"].includes(user.role)) return next();

      const userPermissions = user.positionId?.permissions || [];
      if (!userPermissions.includes(permission)) {
        return res.status(403).json({ message: "ไม่มีสิทธิ์เข้าถึงฟังก์ชันนี้" });
      }

      next();
    } catch (err) {
      res.status(500).json({ message: "เกิดข้อผิดพลาด", error: err.message });
    }
  };
};
