/* eslint-disable react/prop-types */
import { useState } from "react";
import axios from "axios";
import Switch from '@mui/material/Switch';
import { ImageIcon } from "../../../public/icons/icons";
import { PencilSimple, Trash } from "phosphor-react";
import ProductModal from "./ProductModal";

export default function ProductTable({ products, refresh, storeId }) {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    const [showModal, setShowModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const getAuthHeader = () => {
        const token = localStorage.getItem("token");
        return token ? { Authorization: `Bearer ${token}` } : {};
    };

    const handleDelete = async (id) => {
        if (!window.confirm("คุณแน่ใจว่าต้องการลบสินค้านี้?")) return;
        try {
            await axios.delete(`${API_BASE_URL}/products/${id}`, { headers: getAuthHeader() });
            refresh();
        } catch (err) {
            console.error("Error deleting product:", err);
        }
    };

    const handleEdit = (product) => {
        setSelectedProduct(product);
        setShowModal(true);

    };

    const handleToggleStatus = async (product) => {
        try {
            const token = localStorage.getItem("token");
            const headers = { Authorization: `Bearer ${token}` };

            const newStatus = product.status === "available" ? "unavailable" : "available";

            await axios.put(
                `${API_BASE_URL}/products/${product._id}`,
                { status: newStatus },
                { headers }
            );

            refresh(); // รีเฟรชข้อมูลสินค้าในตาราง
        } catch (err) {
            console.error("Error updating status:", err);
            alert("เกิดข้อผิดพลาดในการเปลี่ยนสถานะสินค้า");
        }
    };


    return (
        <div className="overflow-x-auto bg-white rounded-md shadow-md border border-slate-200">
            <table className="w-full text-sm text-slate-700">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 text-left">
                    <tr>
                        <th className="px-4 py-3 font-semibold text-center">#</th>
                        <th className="px-4 py-3 font-semibold">ชื่อสินค้า</th>
                        <th className="px-4 py-3 font-semibold">หมวดหมู่</th>
                        <th className="px-4 py-3 font-semibold text-center">ราคา</th>
                        <th className="px-4 py-3 font-semibold text-center">คงเหลือ</th>
                        <th className="px-4 py-3 font-semibold text-center">สถานะ</th>
                        <th className="px-4 py-3 font-semibold text-center">การจัดการ</th>
                    </tr>
                </thead>

                <tbody>
                    {products.length ? (
                        products.map((p, index) => (
                            <tr
                                key={p._id}
                                className="border-b border-slate-100 hover:bg-slate-50 transition-all"
                            >
                                <td className="px-4 py-3 text-slate-500 text-center">{index + 1}</td>

                                {/* ชื่อ + รูปสินค้า */}
                                <td className="px-4 py-3 flex items-center gap-3">
                                    {p.productImage ? (
                                        <img
                                            src={p.productImage}
                                            alt={p.name}
                                            className="w-10 h-10 object-cover rounded-sm"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center text-[#808080] w-10 h-10 object-cover rounded-sm bg-slate-200">
                                            <ImageIcon size={20} />
                                        </div>
                                    )}
                                    <div>
                                        <p className="font-medium text-slate-800">{p.name}</p>
                                        <p className="text-xs text-slate-400">
                                            Barcode: {p.barcode || "-"}
                                        </p>
                                    </div>
                                </td>

                                <td className="px-4 py-3">{p.category || "-"}</td>

                                <td className="px-4 py-3 text-center font-medium text-slate-800">
                                    {p.price != null ? p.price.toLocaleString("th-TH", { minimumFractionDigits: 2 }) : "0.00"} ฿
                                </td>

                                <td className="px-4 py-3 text-center">
                                    {p.type === "serialized"
                                        ? (p.serialList || []).filter(
                                            (s) => s.status === "available"
                                        ).length
                                        : p.stockQty ?? "-"}
                                </td>

                                <td className="px-4 py-3 text-center">
                                    <Switch
                                        checked={p.status === "available"}
                                        onChange={() => handleToggleStatus(p)}
                                    />
                                </td>

                                <td className="px-4 py-3 text-center">
                                    <div className="flex justify-center gap-3">
                                        <button
                                            onClick={() => handleEdit(p)}
                                            className="text-[#3674B5] hover:text-[#2f5fa0] flex items-center gap-1 text-sm">
                                            <PencilSimple size={16} /> แก้ไข
                                        </button>
                                        <button
                                            onClick={() => handleDelete(p._id)}
                                            className="text-red-500 hover:text-red-700 flex items-center gap-1 text-sm"
                                        >
                                            <Trash size={16} /> ลบ
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td
                                colSpan="7"
                                className="text-center py-6 text-slate-400 bg-slate-50"
                            >
                                ยังไม่มีสินค้าในระบบ
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {showModal &&
                <ProductModal
                    storeId={storeId}
                    type="product"
                    onClose={() => setShowModal(false)}
                    onSuccess={refresh}
                    editingProduct={selectedProduct}
                />
            }
        </div >
    );
}
