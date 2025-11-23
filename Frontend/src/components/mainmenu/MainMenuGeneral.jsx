
import { useState, useEffect } from "react";
import { ShoppingCart, Package, ChartBar, Users, Gear } from "phosphor-react";
import Header from "../shared/Header";
import Footer from "../shared/Footer";
import { useStore } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";
import { Receipt } from "../../../public/icons/icons";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function MainMenuGeneral() {
    const navigate = useNavigate();
    const { store, loading } = useStore();
    const [permissions, setPermissions] = useState([]);

    // ⭐ ดึง role + positionId ของ user ผ่าน cookie
    const fetchUserPermissions = async () => {
        try {
            // 1) เช็คข้อมูล user จาก cookie
            const userRes = await axios.get(
                `${API_BASE_URL}/auth/profile`,
                { withCredentials: true }
            );

            const user = userRes.data.user;

            // ⭐ Owner มีสิทธิ์เต็ม
            if (user.role === "Owner") {
                setPermissions([
                    "sale",
                    "report",
                    "manage_employees",
                    "settings",
                    "product",
                    "all_receipts",
                    "kitchen",
                ]);
                return;
            }

            // ⭐ Employee → ดึง permissions จากตำแหน่ง
            if (user.positionId) {
                const posRes = await axios.get(
                    `${API_BASE_URL}/positions/detail/${user.positionId}`,
                    { withCredentials: true }
                );

                const posPermissions =
                    posRes.data.permissions ||
                    posRes.data.position?.permissions ||
                    [];

                setPermissions(posPermissions);
            }

        } catch (err) {
            console.error("❌ Error fetching user permissions:", err);
        }
    };

    useEffect(() => {
        fetchUserPermissions();
    }, []);

    if (loading || !store) {
        return (
            <div className="flex items-center justify-center h-screen text-slate-600">
                กำลังโหลดข้อมูลร้านค้า...
            </div>
        );
    }

    const storeId = store._id;
    const storeType = store.storeType;

    // ⭐ เมนูทั้งหมด
    const allMenuItems = [
        { key: "sale", icon: <ShoppingCart size={48} />, label: "ขาย", navigateTo: `/sales/${storeType}/${storeId}` },
        { key: "all_receipts", icon: <Receipt size={48} />, label: "ใบเสร็จ", navigateTo: `/all-receipts/${storeId}` },
        { key: "product", icon: <Package size={48} />, label: "สินค้า", navigateTo: `/products/product/${storeId}` },
        { key: "report", icon: <ChartBar size={48} />, label: "แดชบอร์ด", navigateTo: `/dashboard/${storeId}` },
        { key: "manage_employees", icon: <Users size={48} />, label: "พนักงาน", navigateTo: `/manage-employees/${storeId}` },
        { key: "settings", icon: <Gear size={48} />, label: "ตั้งค่า", navigateTo: `/settings/${storeId}` },
    ];

    // ⭐ กรองเมนูตามสิทธิ์
    const visibleMenu = allMenuItems.map((item) => ({
        ...item,
        disabled: !permissions.includes(item.key),
    }));

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#E9F3FF] to-[#C8DCFF]">
            <Header storeName={store.storeName} />

            <main className="flex flex-1 justify-center items-center px-6">
                <div className="flex flex-col items-center gap-8">

                    <div className="flex gap-8 justify-center">
                        {visibleMenu.slice(0, 3).map((item, i) => (
                            <button
                                key={i}
                                onClick={() => !item.disabled && navigate(item.navigateTo)}
                                disabled={item.disabled}
                                className={`flex flex-col items-center justify-center w-36 h-36 rounded-xl shadow-md 
                                    transition-all duration-300 focus:outline-none
                                    ${item.disabled
                                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                        : "bg-gradient-to-b from-[#4A90E2] to-[#3674B5] text-white hover:shadow-xl hover:-translate-y-2"
                                    }`}
                            >
                                {item.icon}
                                <p className="mt-3 text-md font-semibold">{item.label}</p>
                            </button>
                        ))}
                    </div>

                    <div className="flex gap-8 justify-center">
                        {visibleMenu.slice(3).map((item, i) => (
                            <button
                                key={i}
                                onClick={() => !item.disabled && navigate(item.navigateTo)}
                                disabled={item.disabled}
                                className={`flex flex-col items-center justify-center w-36 h-36 rounded-xl shadow-md 
                                    transition-all duration-300 focus:outline-none
                                    ${item.disabled
                                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                        : "bg-gradient-to-b from-[#4A90E2] to-[#3674B5] text-white hover:shadow-xl hover:-translate-y-2"
                                    }`}
                            >
                                {item.icon}
                                <p className="mt-3 text-md font-semibold">{item.label}</p>
                            </button>
                        ))}
                    </div>

                </div>
            </main>

            <Footer />
        </div>
    );
}
