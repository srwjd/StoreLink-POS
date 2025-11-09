/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { EnvelopeSimple, Lock, Eye, EyeSlash, CheckCircle, XCircle } from "phosphor-react";

export default function RegisterPopup({ onClose, onLogin }) {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    const navigate = useNavigate();
    const [showPass, setShowPass] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirm: "",
    });
    const [loading, setLoading] = useState(false);

    // ฟังก์ชันตรวจเงื่อนไขรหัสผ่าน
    const passwordRules = {
        length: form.password.length >= 8,
        upper: /[A-Z]/.test(form.password),
        number: /[0-9]/.test(form.password),

    };
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);


    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();

        // ตรวจเงื่อนไขรหัสผ่านก่อนส่ง
        if (!emailValid) {
            alert("กรุณากรอกอีเมลให้ถูกต้อง");
            return;
        }
        if (!passwordRules.length || !passwordRules.upper || !passwordRules.number) {
            alert("รหัสผ่านไม่เป็นไปตามเงื่อนไข");
            return;
        }

        if (form.password !== form.confirm) {
            alert("รหัสผ่านไม่ตรงกัน");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    firstName: form.firstName,
                    lastName: form.lastName,
                    email: form.email,
                    password: form.password,
                }),
            });
            const data = await res.json();
            if (res.ok) {
                alert("สมัครสมาชิกสำเร็จ!");
                console.log("token:", data.token);

                localStorage.setItem("token", data.token);

                onClose();

                navigate("/create-store");
            } else {
                alert(data.message || "สมัครไม่สำเร็จ");
            }
        } catch (err) {
            alert("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้");
        }
        setLoading(false);
    };

    return (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-8 border border-[#3674B5]/40 relative animate-[popup_0.3s_ease-out_forwards]">

                <div className="mb-6">
                    <h2 className="absolute top-3 left-8 text-[#3674B5] font-semibold text-xl">
                        สมัครสมาชิก
                    </h2>
                    <button
                        onClick={onClose}
                        className="absolute top-3 right-4 text-slate-400 hover:text-slate-600 text-lg"
                    >
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3">
                    <div className="flex gap-2">
                        <input
                            name="firstName"
                            onChange={handleChange}
                            value={form.firstName}
                            placeholder="ชื่อ"
                            required
                            className="w-1/2 border border-[#3674B5]/40 rounded-md px-3 py-2 focus:ring-2 focus:ring-[#3674B5] outline-none"
                        />
                        <input
                            name="lastName"
                            onChange={handleChange}
                            value={form.lastName}
                            placeholder="นามสกุล"
                            required
                            className="w-1/2 border border-[#3674B5]/40 rounded-md px-3 py-2 focus:ring-2 focus:ring-[#3674B5] outline-none"
                        />
                    </div>

                    <div className="flex items-center border border-[#3674B5]/40 rounded-md px-3 py-2">
                        <EnvelopeSimple size={20} color="#3674B5" />
                        <input
                            name="email"
                            onChange={handleChange}
                            value={form.email}
                            type="email"
                            placeholder="อีเมล"
                            required
                            className="w-full ml-2 outline-none text-sm"
                        />
                    </div>
                    <div className="text-[12px] mt-1 space-y-1">
                        <PasswordRuleItem
                            text="อีเมลต้องมีรูปแบบที่ถูกต้อง (เช่น example@gmail.com)"
                            passed={emailValid}
                        />

                    </div>


                    <div className="flex items-center border border-[#3674B5]/40 rounded-md px-3 py-2">
                        <Lock size={20} color="#3674B5" />
                        <input
                            name="password"
                            onChange={handleChange}
                            value={form.password}
                            type={showPass ? "text" : "password"}
                            placeholder="รหัสผ่าน"
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



                    <div className="flex items-center border border-[#3674B5]/40 rounded-md px-3 py-2">
                        <Lock size={20} color="#3674B5" />
                        <input
                            name="confirm"
                            onChange={handleChange}
                            value={form.confirm}
                            type={showConfirm ? "text" : "password"}
                            placeholder="ยืนยันรหัสผ่าน"
                            required
                            className="w-full ml-2 outline-none text-sm"
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirm(!showConfirm)}
                            className="text-[#3674B5]/80"
                        >
                            {showConfirm ? <EyeSlash size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                    {/* ✅ แสดงสถานะเงื่อนไขรหัสผ่าน */}
                    <div className="text-[12px] mt-1 space-y-1">
                        <PasswordRuleItem
                            text="รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร"
                            passed={passwordRules.length}
                        />
                        <PasswordRuleItem
                            text="ต้องมีตัวพิมพ์ใหญ่ (A-Z)"
                            passed={passwordRules.upper}
                        />
                        <PasswordRuleItem
                            text="ต้องมีตัวเลข (0-9)"
                            passed={passwordRules.number}
                        />
                        <PasswordRuleItem
                            text="รหัสผ่านต้องตรงกับการยืนยันรหัสผ่าน"
                            passed={form.password === form.confirm && form.password !== ""}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#3674B5] text-white py-2 rounded-md mt-2 hover:bg-[#2f5fa0] transition"
                    >
                        {loading ? "กำลังสมัคร..." : "สมัครสมาชิก"}
                    </button>
                </form>

                <p className="text-center text-sm text-slate-600 mt-4">
                    มีบัญชีอยู่แล้ว?{" "}
                    <button onClick={onLogin} className="text-[#3674B5] hover:underline">
                        เข้าสู่ระบบ
                    </button>
                </p>
            </div>
        </div>
    );
}

// ✅ Component ย่อยสำหรับแสดงแต่ละเงื่อนไข
function PasswordRuleItem({ text, passed }) {
    return (
        <div
            className={`flex items-center gap-1 ${passed ? "text-green-600" : "text-slate-500"
                }`}
        >
            {passed ? (
                <CheckCircle size={12} weight="fill" />
            ) : (
                <XCircle size={12} weight="fill" />
            )}
            <span>{text}</span>
        </div>
    );
}


