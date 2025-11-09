/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import axios from "axios";
import { useStore } from "../../../context/StoreContext";

import ProductTable from "../../../components/products/ProductTable";
import ProductCardGrid from "../../../components/products/ProductCardGrid";
import ProductModal from "../../../components/products/ProductModal";

import { PlusCircle } from "phosphor-react";
import Header from "../../../components/shared/Header";

export default function BaseProductTemplate() {
    const { store } = useStore();
    const [products, setProducts] = useState([]);
    const [viewMode, setViewMode] = useState("table"); // table | card
    const [isModalOpen, setIsModalOpen] = useState(false);
    const storeId = store._id;

    const API_BASE = "http://localhost:3000/products";

    const getAuthHeader = () => {
        const token = localStorage.getItem("token");
        return token ? { Authorization: `Bearer ${token}` } : {};
    };

    const fetchProducts = async () => {
        try {
            const res = await axios.get(`${API_BASE}/all/${storeId}`, {
                headers: getAuthHeader(),
            });
            setProducts(res.data.products || []);
        } catch (err) {
            console.error("Error fetching products:", err);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#E9F3FF] to-[#C8DCFF]">
            <Header storeName={store.storeName} />
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-semibold text-[#3674B5]">จัดการสินค้า</h1>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="flex items-center gap-2 bg-[#3674B5] hover:bg-[#2f5fa0] text-white px-4 py-2 rounded-lg shadow-md"
                        >
                            <PlusCircle size={18} /> เพิ่มสินค้า
                        </button>
                        <button
                            onClick={() =>
                                setViewMode(viewMode === "table" ? "card" : "table")
                            }
                            className="flex items-center gap-2 border border-[#3674B5] text-[#3674B5] px-3 py-2 rounded-lg hover:bg-[#EAF1FF]"
                        >
                            {viewMode === "table" ? (
                                <>
                                    มุมมองการ์ด
                                </>
                            ) : (
                                <>
                                    มุมมองตาราง
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {viewMode === "table" ? (
                    <ProductTable products={products} refresh={fetchProducts} />
                ) : (
                    <ProductCardGrid products={products} refresh={fetchProducts} />
                )}

                {isModalOpen && (
                    <ProductModal
                        storeId={storeId}
                        type="product"
                        onClose={() => setIsModalOpen(false)}
                        onSuccess={fetchProducts}
                    />
                )}
            </div>
        </div>
    );
}
