/* eslint-disable react/prop-types */
import { PencilSimple, Trash } from "phosphor-react";
import axios from "axios";
import { useState } from "react";
import { useStore } from "../../context/StoreContext";
import { ImageIcon } from "../../../public/icons/icons";
import ProductModal from "./ProductModal";

export default function ProductCardGrid({ products, refresh }) {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    const { store } = useStore();
    const getAuthHeader = () => {
        const token = localStorage.getItem("token");
        return token ? { Authorization: `Bearer ${token}` } : {};
    };
    const [showModal, setShowModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);


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

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {products.length ? (
                products.map((p) => (
                    <div
                        key={p._id}
                        className="bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition p-4 flex flex-col justify-between"
                    >
                        <div>
                            {p.productImage ? (
                                <img
                                    src={p.productImage}
                                    alt={p.name}
                                    className="rounded-lg w-full h-32 object-cover mb-3"
                                />
                            ) : (
                                <div className="bg-[#3674B5]/10 text-[#3674B5] w-full h-32 rounded-lg flex items-center justify-center mb-3">
                                    <ImageIcon size={52} />
                                </div>
                            )}

                            <h3 className="font-semibold text-[#3674B5] text-sm">{p.name}</h3>
                            <p className="text-slate-500 text-xs">{p.category}</p>
                            <p className="text-sm mt-1 font-medium text-slate-700">
                                {p.price} ฿ / {p.unit}
                            </p>
                            <p className={`${store.storeType === "restaurant" && "hidden"} text-xs text-slate-500 mt-1`}>
                                คงเหลือ: {p.type === "serialized"
                                    ? ((p.serialList || []).filter((s) => s.status === "available").length)
                                    : (p.stockQty ?? "-")}
                            </p>
                        </div>
                        <div className="flex justify-between mt-3 text-sm">
                            <button
                                onClick={() => handleEdit(p)}
                                className="text-blue-600 flex items-center gap-1 hover:underline">
                                <PencilSimple size={14} /> แก้ไข
                            </button>
                            <button
                                onClick={() => handleDelete(p._id)}
                                className="text-red-500 flex items-center gap-1 hover:underline"
                            >
                                <Trash size={14} /> ลบ
                            </button>
                        </div>
                    </div>
                ))
            ) : (
                <p className="col-span-full text-center text-slate-500 py-10">
                    ยังไม่มีสินค้าในระบบ
                </p>
            )}
            {showModal &&
                <ProductModal
                    storeId={store._id}
                    type="product"
                    onClose={() => setShowModal(false)}
                    onSuccess={refresh}
                    editingProduct={selectedProduct}
                />
            }
        </div>
    );
}
