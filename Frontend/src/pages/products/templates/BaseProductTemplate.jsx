/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import axios from "axios";
import { useStore } from "../../../context/StoreContext";
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';

import ProductTable from "../../../components/products/ProductTable";
import ProductCardGrid from "../../../components/products/ProductCardGrid";
import ProductModal from "../../../components/products/ProductModal";
import Header from "../../../components/shared/Header";

import { PlusCircle } from "phosphor-react";
import {
    GalleryViewIcon,
    ListViewIcon,
    CaretDown,
} from "../../../../public/icons/icons";

export default function BaseProductTemplate() {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    const { store } = useStore();
    const [products, setProducts] = useState([]);
    const [activeCategory, setActiveCategory] = useState("ทั้งหมด");
    const [categories, setCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [viewMode, setViewMode] = useState("table");
    const storeId = localStorage.getItem("currentStore");

    const getAuthHeader = () => {
        const token = localStorage.getItem("token");
        return token ? { Authorization: `Bearer ${token}` } : {};
    };

    const fetchProducts = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/products/all/${storeId}`, {
                headers: getAuthHeader(),
            });
            setProducts(res.data.products || []);
            const uniqueCats = [...new Set(res.data.products.map((p) => p.category).filter(Boolean))];
            setCategories(["ทั้งหมด", ...uniqueCats]);
        } catch (err) {
            console.error("Error fetching products:", err);
        }
    };

    const viewModeOptions = [
        { value: "table", label: "Table", icon: <ListViewIcon size={20} /> },
        { value: "card", label: "Card", icon: <GalleryViewIcon size={20} /> },
    ];

    useEffect(() => {
        fetchProducts();
    }, []);

    const filteredProducts = products.filter((p) => {
        const matchesCategory = activeCategory === "ทั้งหมด" || p.category === activeCategory;
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#E9F3FF] to-[#C8DCFF]">
            <Header storeName={store?.storeName} />

            <div className="p-6">
                {/* ส่วนหัว: ปุ่ม view mode + ค้นหา + เพิ่มสินค้า */}
                <div className="flex justify-between items-center mb-4 bg-white p-2 rounded-md shadow-sm">
                    <div className="flex gap-3 items-center flex-wrap">
                        {/* ปุ่มสลับมุมมอง */}
                        <ButtonGroup
                            variant="outlined"
                            aria-label="outlined button group"
                            sx={{
                                "& .MuiButtonGroup-grouped": {
                                    border: "1px solid #E2E8F0",
                                    minWidth: 40,
                                    padding: "4px 6px",
                                    transition: "all 0.2s",
                                    "&:hover": {
                                        backgroundColor: "#EDF2F7",
                                    },
                                },
                            }}
                        >
                            {viewModeOptions.map((option) => (
                                <Button
                                    key={option.value}
                                    onClick={() => setViewMode(option.value)}
                                    sx={{
                                        backgroundColor:
                                            viewMode === option.value ? "#FFFFFF" : "#F2F3F4",
                                        color:
                                            viewMode === option.value ? "#3674B5" : "#A0AEC0",
                                        borderColor:
                                            viewMode === option.value ? "#3674B5" : "#E2E8F0",
                                        borderRadius: "8px",
                                        "&:hover": {
                                            backgroundColor:
                                                viewMode === option.value ? "#FFFFFF" : "#E9EEF5",
                                            color: "#3674B5",
                                        },
                                    }}
                                >
                                    {option.icon}
                                </Button>
                            ))}
                        </ButtonGroup>

                        {/* ช่องค้นหา */}
                        <input
                            type="text"
                            placeholder="ค้นหาสินค้า..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="border border-gray-300 rounded-md px-4 py-2 outline-none focus:ring-1 focus:ring-[#3674B5] text-sm w-64"
                        />

                        {/* แสดงตามหมวดหมู่ */}
                        <div className="relative">
                            <select
                                value={activeCategory}
                                onChange={(e) => setActiveCategory(e.target.value)}
                                className="pl-3 pr-8 py-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-[#3674B5] outline-none transition appearance-none"
                            >
                                {categories.map((cat) => (
                                    <option key={cat}>{cat}</option>
                                ))}
                            </select>
                            <CaretDown
                                size={20}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none"
                            />
                        </div>

                    </div>
                    {/* ปุ่มเพิ่มสินค้า */}
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 bg-[#3674B5] hover:bg-[#2f5fa0] text-white px-4 py-2 rounded-lg shadow-md text-sm"
                    >
                        <PlusCircle size={18} /> เพิ่มสินค้า
                    </button>
                </div>

                {/* ✅ แสดงสินค้าตาม viewMode */}
                {viewMode === "table" ? (
                    <ProductTable products={filteredProducts} refresh={fetchProducts} storeId={storeId} />
                ) : (
                    <ProductCardGrid products={filteredProducts} refresh={fetchProducts} />
                )}

                {/* Modal เพิ่มสินค้า */}
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
