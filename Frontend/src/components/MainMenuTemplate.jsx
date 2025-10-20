import { ShoppingCart, Notebook, ChartBar, Users, Gear, ForkKnife, CalendarPlus, Package, } from "phosphor-react";
import Header from "../components/shared/Header";
import Footer from "../components/shared/Footer";
import { useStore } from "../context/StoreContext";

export default function MainMenuTemplate() {
    const { store } = useStore();
    const type = store?.type || "retail";

    // 🎯 เมนูพื้นฐาน (ใช้ได้กับทุกประเภท)
    let menuItems = [
        { icon: <ShoppingCart size={48} />, label: "ขาย" },
        { icon: <ChartBar size={48} />, label: "รายงาน" },
        { icon: <Users size={48} />, label: "พนักงาน" },
        { icon: <Gear size={48} />, label: "ตั้งค่า" },
    ];

    // 🍎 กำหนดเมนูเฉพาะแต่ละประเภท
    if (type === "retail") {
        menuItems.splice(1, 0, { icon: <Notebook size={48} />, label: "สินค้า" }, { icon: <Package size={48} />, label: "คลังสินค้า" });
    } else if (type === "restaurant") {
        menuItems.splice(1, 0, { icon: <ForkKnife size={48} />, label: "เมนูอาหาร" });
    } else if (type === "service") {
        menuItems.splice(1, 0, { icon: <Notebook size={48} />, label: "บริการ" }, { icon: <CalendarPlus size={48} />, label: "จองคิว" });
    }

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#E9F3FF] to-[#C8DCFF]">
            {/* Header */}
            <Header storeName={store?.name || "ชื่อร้าน"} showLogout={true} />

            {/* Main Menu */}
            <main className="flex flex-1 justify-center items-center px-6">
                <div className="grid grid-cols-3 gap-8 ">
                    {menuItems.map((item, i) => (
                        <button
                            key={i}
                            className="flex flex-col items-center justify-center 
                   bg-gradient-to-b from-[#4A90E2] to-[#3674B5] 
                   text-white w-36 h-36 rounded-xl shadow-md 
                   hover:shadow-xl hover:-translate-y-2 
                   transition-all duration-300 focus:outline-none"
                        >
                            {item.icon}
                            <p className="mt-3 text-md font-semibold">{item.label}</p>
                        </button>
                    ))}
                </div>
            </main>


            {/* Footer */}
            <Footer />
        </div>
    );
}
