/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { EnvelopeSimple, Lock, Eye, EyeSlash } from "phosphor-react";

export default function LoginPopup({ onClose, onRegister }) {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    const navigate = useNavigate();
    const [showPass, setShowPass] = useState(false);
    const [form, setForm] = useState({
        loginIdentifier: "", // ใช้สำหรับ email หรือ username
        password: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError(""); // clear error
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.loginIdentifier || !form.password) {
            setError("กรุณากรอกอีเมล/ชื่อผู้ใช้และรหัสผ่านให้ครบ");
            return;
        }

        try {
            setLoading(true);
            // ตรวจสอบว่าเป็น email หรือ username (ถ้ามี @ ถือว่าเป็น email)
            const isEmail = form.loginIdentifier.includes("@");
            const loginData = {
                password: form.password,
                [isEmail ? "email" : "username"]: form.loginIdentifier
            };

            const res = await fetch(`${API_BASE_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(loginData),
            });

            const data = await res.json();

            let userRole = null;
            try {
                const decoded = jwtDecode(data.token);
                userRole = decoded.role;
            } catch (err) {
                console.warn("ไม่สามารถอ่าน userId จาก token ได้:", err);
            }

            if (res.ok) {
                localStorage.setItem("token", data.token);
                onClose();
                if (userRole === "admin") navigate("/admin");
                navigate("/select-store"); // เปลี่ยนไปหน้าหลักหลังล็อกอิน
            } else {
                setError(data.message || "อีเมล/ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
            }
        } catch (err) {
            setError("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-8 border border-[#3674B5]/40 relative animate-[popup_0.3s_ease-out_forwards]">

                {/* Title */}
                <div className="mb-6">
                    <h2 className="absolute top-3 left-8 text-[#3674B5] font-semibold text-xl">
                        เข้าสู่ระบบ
                    </h2>
                    <button
                        onClick={onClose}
                        className="absolute top-3 right-4 text-slate-400 hover:text-slate-600 text-lg"
                    >
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Email or Username */}
                    <div className="flex items-center border border-[#3674B5]/40 rounded-md px-3 py-2">
                        <EnvelopeSimple size={20} color="#3674B5" />
                        <input
                            name="loginIdentifier"
                            type="text"
                            placeholder="อีเมล หรือ ชื่อผู้ใช้"
                            value={form.loginIdentifier}
                            onChange={handleChange}
                            required
                            className="w-full ml-2 outline-none text-sm"
                        />
                    </div>

                    {/* Password */}
                    <div className="flex items-center border border-[#3674B5]/40 rounded-md px-3 py-2">
                        <Lock size={20} color="#3674B5" />
                        <input
                            name="password"
                            type={showPass ? "text" : "password"}
                            placeholder="รหัสผ่าน"
                            value={form.password}
                            onChange={handleChange}
                            required
                            className="w-full ml-2 outline-none text-sm"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPass(!showPass)}
                            className="text-[#3674B5]/80"
                        >
                            {showPass ? <EyeSlash size={20} /> : <Eye size={20} />}
                        </button>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="text-red-600 text-sm text-center bg-red-50 border border-red-200 rounded-md py-1">
                            {error}
                        </div>
                    )}

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#3674B5] text-white py-2 rounded-md mt-2 hover:bg-[#2f5fa0] transition"
                    >
                        {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
                    </button>
                </form>

                {/* Switch to Register */}
                <p className="text-center text-sm text-slate-600 mt-4">
                    ยังไม่มีบัญชี?{" "}
                    <button onClick={onRegister} className="text-[#3674B5] hover:underline">
                        สมัครสมาชิก
                    </button>
                </p>
            </div>
        </div>
    );
}
