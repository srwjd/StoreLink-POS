import { ShoppingCart, Notebook, CalendarPlus, ChartBar, Users, Gear } from "phosphor-react";
import Header from "../shared/Header";
import Footer from "../shared/Footer";
import { useStore } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";

export default function MainMenuService() {
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

    const menuItems = [
        { icon: <ShoppingCart size={48} />, label: "ขาย" },
        { icon: <Notebook size={48} />, label: "บริการ" },
        { icon: <CalendarPlus size={48} />, label: "จองคิว" },
        { icon: <ChartBar size={48} />, label: "รายงาน" },
        { icon: <Users size={48} />, label: "พนักงาน", navigateTo: `/manage-employees/${storeId}` },
        { icon: <Gear size={48} />, label: "ตั้งค่า" },
    ];

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#E9F3FF] to-[#C8DCFF]">
            <Header storeName={store.storeName} />
            <main className="flex flex-1 justify-center items-center px-6">
                <div className="grid grid-cols-3 gap-8">
                    {menuItems.map((item, i) => (
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
            </main>
            <Footer />
        </div>
    );
}
