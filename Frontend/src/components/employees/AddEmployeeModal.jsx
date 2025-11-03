/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import axios from "axios";
import { XCircle, Eye, EyeSlash } from "phosphor-react";

export default function AddEmployeeModal({ storeId, onClose, onSuccess, editData }) {
    const [positions, setPositions] = useState([]);
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        positionId: "",
    });

    // 🧩 โหลดตำแหน่งจาก API
    const fetchPositions = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get(`http://localhost:3000/positions/${storeId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setPositions(res.data.positions || []);
        } catch (err) {
            console.error("Error fetching positions:", err);
        }
    };

    useEffect(() => {
        fetchPositions();
    }, []);

    // 🧠 โหลดข้อมูลเก่ามาแก้ไข
    useEffect(() => {
        if (editData) {
            setForm({
                firstName: editData.firstName || "",
                lastName: editData.lastName || "",
                email: editData.email || "",
                password: "",
                positionId: editData.positionId?._id || "",
            });
        }
    }, [editData]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem("token");

            if (editData) {
                // 🧩 ถ้ามี password ใหม่ → อัปเดตด้วย
                const updateData = { ...form };
                if (!form.password) delete updateData.password;

                await axios.put(
                    `http://localhost:3000/employees/update/${editData._id}`,
                    updateData,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                alert("✅ อัปเดตพนักงานสำเร็จ");
            } else {
                await axios.post(
                    `http://localhost:3000/employees/create/${storeId}`,
                    form,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                alert("🎉 เพิ่มพนักงานสำเร็จ");
            }

            onSuccess?.(); // โหลดข้อมูลใหม่จาก parent
            onClose();
        } catch (err) {
            console.error("Error saving employee:", err);
            alert(err.response?.data?.message || "เกิดข้อผิดพลาดในการบันทึกข้อมูล");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 animate-[fadeIn_0.3s_ease-out_forwards]">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 relative border border-slate-200 animate-[slideUp_0.25s_ease-out_forwards]">
                {/* ❌ ปุ่มปิด */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-slate-500 hover:text-red-500 transition"
                >
                    <XCircle size={26} />
                </button>

                {/* 🏷️ หัวข้อ */}
                <h2 className="text-2xl font-semibold text-[#3674B5] mb-5 text-center">
                    {editData ? "แก้ไขข้อมูลพนักงาน" : "เพิ่มพนักงานใหม่"}
                </h2>

                {/* 🧾 ฟอร์ม */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex gap-3">
                        <input
                            name="firstName"
                            placeholder="ชื่อ"
                            value={form.firstName}
                            onChange={handleChange}
                            required
                            className="w-1/2 border border-slate-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-[#3674B5] shadow-sm"
                        />
                        <input
                            name="lastName"
                            placeholder="นามสกุล"
                            value={form.lastName}
                            onChange={handleChange}
                            required
                            className="w-1/2 border border-slate-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-[#3674B5] shadow-sm"
                        />
                    </div>

                    <input
                        name="email"
                        type="email"
                        placeholder="อีเมล"
                        value={form.email}
                        onChange={handleChange}
                        required
                        className="w-full border border-slate-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-[#3674B5] shadow-sm"
                    />

                    {/* 🔑 แสดงช่องรหัสผ่านทั้งตอนเพิ่มและตอนแก้ไข (แก้ได้แต่ไม่บังคับ) */}
                    <div className="relative">
                        <input
                            name="password"
                            type={showPass ? "text" : "password"}
                            placeholder={editData ? "รหัสผ่านใหม่" : "รหัสผ่าน"}
                            value={form.password}
                            onChange={handleChange}
                            className={`w-full border border-slate-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-[#3674B5] shadow-sm ${editData ? "" : "required"
                                }`}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPass(!showPass)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#3674B5]"
                        >
                            {showPass ? <EyeSlash size={18} /> : <Eye size={18} />}
                        </button>
                    </div>

                    <select
                        name="positionId"
                        value={form.positionId}
                        onChange={handleChange}
                        required
                        className="w-full border border-slate-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-[#3674B5] shadow-sm"
                    >
                        <option value="">เลือกตำแหน่ง</option>
                        {positions.map((pos) => (
                            <option key={pos._id} value={pos._id}>
                                {pos.positionName}
                            </option>
                        ))}
                    </select>

                    {/* 🔘 ปุ่มบันทึก + ยกเลิก */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 border border-slate-300 text-slate-600 hover:bg-slate-100 rounded-lg py-2.5 font-medium transition-all"
                        >
                            ยกเลิก
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-[#3674B5] hover:bg-[#2f5fa0] text-white rounded-lg py-2.5 font-semibold shadow-md transition-all disabled:opacity-60"
                        >
                            {loading ? "⏳ กำลังบันทึก..." : editData ? "บันทึกการแก้ไข" : "เพิ่มพนักงาน"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
