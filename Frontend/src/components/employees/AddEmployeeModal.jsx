/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import axios from "axios";
import { XCircle, Eye, EyeSlash } from "phosphor-react";

export default function AddEmployeeModal({ storeId, onClose, onSuccess }) {
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

    useEffect(() => {
        const fetchPositions = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get(`http://localhost:3000/positions/${storeId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setPositions(res.data.positions || []);
                console.log(res.data.positions);
            } catch (err) {
                console.error("Error fetching positions:", err);
            }
        };
        fetchPositions();
    }, [storeId]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const res = await axios.post(
                `http://localhost:3000/employees/createEmployee/${storeId}`,
                form,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.status === 201) {
                alert("✅ เพิ่มพนักงานสำเร็จ");
                onSuccess?.();
                onClose();
            }
        } catch (err) {
            console.error("Error creating employee:", err);
            alert(err.response?.data?.message || "เกิดข้อผิดพลาดในการเพิ่มพนักงาน");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6 relative animate-[fadeIn_0.25s_ease-out_forwards]">
                {/* Header */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-slate-500 hover:text-slate-700"
                >
                    <XCircle size={24} />
                </button>
                <h2 className="text-xl font-semibold text-[#3674B5] mb-5 text-center">
                    เพิ่มพนักงานใหม่
                </h2>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-3">
                    <div className="flex gap-2">
                        <input
                            name="firstName"
                            placeholder="ชื่อ"
                            value={form.firstName}
                            onChange={handleChange}
                            required
                            className="w-1/2 border border-slate-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#3674B5]"
                        />
                        <input
                            name="lastName"
                            placeholder="นามสกุล"
                            value={form.lastName}
                            onChange={handleChange}
                            required
                            className="w-1/2 border border-slate-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#3674B5]"
                        />
                    </div>

                    <input
                        name="email"
                        type="email"
                        placeholder="อีเมล"
                        value={form.email}
                        onChange={handleChange}
                        required
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#3674B5]"
                    />

                    <div className="relative">
                        <input
                            name="password"
                            type={showPass ? "text" : "password"}
                            placeholder="รหัสผ่าน"
                            value={form.password}
                            onChange={handleChange}
                            required
                            className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#3674B5]"
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
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#3674B5]"
                    >
                        <option value="">เลือกตำแหน่ง</option>
                        {positions.map((pos) => (
                            <option key={pos._id} value={pos._id}>
                                {pos.name}
                            </option>
                        ))}
                    </select>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#3674B5] hover:bg-[#2f5fa0] text-white rounded-lg py-2 font-semibold transition-all"
                    >
                        {loading ? "กำลังบันทึก..." : "เพิ่มพนักงาน"}
                    </button>
                </form>
            </div>
        </div>
    );
}
