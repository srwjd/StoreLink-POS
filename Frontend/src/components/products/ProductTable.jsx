/* eslint-disable react/prop-types */
import { PencilSimple, Trash } from "phosphor-react";
import axios from "axios";

export default function ProductTable({ products, refresh }) {
    const API_BASE = "http://localhost:3000/products";
    const getAuthHeader = () => {
        const token = localStorage.getItem("token");
        return token ? { Authorization: `Bearer ${token}` } : {};
    };

    const handleDelete = async (id) => {
        if (!window.confirm("คุณแน่ใจว่าต้องการลบสินค้านี้?")) return;
        try {
            await axios.delete(`${API_BASE}/${id}`, { headers: getAuthHeader() });
            refresh();
        } catch (err) {
            console.error("Error deleting product:", err);
        }
    };

    return (
        <div className="overflow-x-auto bg-white rounded-xl shadow-md border border-slate-200">
            <table className="w-full text-sm text-slate-700">
                <thead className="bg-[#3674B5] text-white">
                    <tr>
                        <th className="px-4 py-3 text-left">ชื่อสินค้า</th>
                        <th className="px-4 py-3">หมวดหมู่</th>
                        <th className="px-4 py-3">หน่วย</th>
                        <th className="px-4 py-3">ราคา</th>
                        <th className="px-4 py-3">คงเหลือ</th>
                        <th className="px-4 py-3">ประเภท</th>
                        <th className="px-4 py-3">การจัดการ</th>
                    </tr>
                </thead>
                <tbody>
                    {products.length ? (
                        products.map((p) => (
                            <tr
                                key={p._id}
                                className="border-t hover:bg-[#EAF1FF] transition"
                            >
                                <td className="px-4 py-2 font-medium">{p.name}</td>
                                <td className="px-4 py-2">{p.category || "-"}</td>
                                <td className="px-4 py-2">{p.unit || "-"}</td>
                                <td className="px-4 py-2">{p.price} ฿</td>
                                <td className="px-4 py-2 text-center">{p.type === "serialized"
                                    ? ((p.serialList || []).filter((s) => s.status === "available").length)
                                    : (p.stockQty ?? "-")}
                                </td>
                                <td className="px-4 py-2 text-center">
                                    {p.type === "serialized" ? "มี SN" : "ทั่วไป"}
                                </td>
                                <td className="px-4 py-2 flex gap-2 justify-center">
                                    <button className="text-blue-600 hover:underline flex items-center gap-1">
                                        <PencilSimple size={16} /> แก้ไข
                                    </button>
                                    <button
                                        onClick={() => handleDelete(p._id)}
                                        className="text-red-500 hover:underline flex items-center gap-1"
                                    >
                                        <Trash size={16} /> ลบ
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7" className="text-center py-5 text-slate-500">
                                ยังไม่มีสินค้าในระบบ
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
