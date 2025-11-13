import Header from "../shared/Header";
import Footer from "../shared/Footer";
import { useStore } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";

import { ShoppingCart, ForkKnife, ChartBar, Users, Gear } from "phosphor-react";
import { KitchenIcon, Receipt } from "../../../public/icons/icons";


export default function MainMenuRestaurant() {
    const navigate = useNavigate();
    const { store, loading } = useStore();



    if (loading || !store) {
        return (
            <div className="flex items-center justify-center h-screen text-slate-600">
                กำลังโหลดข้อมูลร้านค้า...
            </div>
        );
    }



    const storeId = store._id;
    const storeType = store.storeType;

    const menuItems = [
        { icon: <ShoppingCart size={48} />, label: "ขาย", navigateTo: `/sales/${storeType}/${storeId}` },
        { icon: <Receipt size={48} />, label: "ใบเสร็จ", navigateTo: `/all-receipts/${storeId}` },
        { icon: <KitchenIcon size={48} />, label: "ครัว", navigateTo: `/kitchen/${storeId}` },
        { icon: <ForkKnife size={48} />, label: "เมนูอาหาร", navigateTo: `/products/menu/${storeId}` },
        { icon: <ChartBar size={48} />, label: "แดชบอร์ด", navigateTo: `/dashboard/${storeId}` },
        { icon: <Users size={48} />, label: "พนักงาน", navigateTo: `/manage-employees/${storeId}` },
        { icon: <Gear size={48} />, label: "ตั้งค่า", navigateTo: `/settings/${storeId}` },
    ];

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#E9F3FF] to-[#C8DCFF]">
            <Header storeName={store.storeName} />
            <main className="flex flex-1 justify-center items-center px-6">
                <div className="flex flex-col items-center gap-8">
                    <div className="flex gap-8 justify-center">
                        {menuItems.slice(0, 3).map((item, i) => (
                            <button
                                key={i}
                                onClick={() => item.navigateTo && navigate(item.navigateTo)}
                                className="flex flex-col items-center justify-center bg-gradient-to-b 
                         from-[#4A90E2] to-[#3674B5] text-white w-36 h-36 rounded-xl shadow-md 
                         hover:shadow-xl hover:-translate-y-2 transition-all duration-300 focus:outline-none"
                            >
                                {item.icon}
                                <p className="mt-3 text-md font-semibold">{item.label}</p>
                            </button>
                        ))}
                    </div>
                    <div className="flex gap-8 justify-center">
                        {menuItems.slice(3).map((item, i) => (
                            <button
                                key={`bottom-${i}`}
                                onClick={() => item.navigateTo && navigate(item.navigateTo)}
                                className="flex flex-col items-center justify-center bg-gradient-to-b 
                         from-[#4A90E2] to-[#3674B5] text-white w-36 h-36 rounded-xl shadow-md 
                         hover:shadow-xl hover:-translate-y-2 transition-all duration-300 focus:outline-none"
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
