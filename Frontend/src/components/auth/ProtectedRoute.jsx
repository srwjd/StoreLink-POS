/* eslint-disable react/prop-types */
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
    const token = localStorage.getItem("token");

    // ถ้าไม่มี token => กลับไปหน้า login
    if (!token) {
        return <Navigate to="/" replace />;
    }

    // ถ้ามี token => ให้ render หน้านั้นต่อ
    return children;
}
