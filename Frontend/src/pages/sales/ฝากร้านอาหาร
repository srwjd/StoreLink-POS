import { useState } from "react";
import {
    Storefront,
    ShoppingBag,
} from "phosphor-react";
import Header from "../../components/shared/Header";
import RestaurantTableView from "../../components/restaurant/RestaurantTableView";
import RestaurantOrderPanel from "../../components/restaurant/RestaurantOrderPanel";

export default function SalesRestaurant() {
    const [mode, setMode] = useState(null); // dine-in | takeaway
    const [selectedTable, setSelectedTable] = useState(null);

    // 🟢 new: เก็บข้อมูลโต๊ะทั้งหมด
    const [tableList, setTableList] = useState([
        { id: "T01", name: "โต๊ะ 1", status: "available" },
        { id: "T02", name: "โต๊ะ 2", status: "pending" },
        { id: "T03", name: "โต๊ะ 3", status: "served" },
        { id: "T04", name: "โต๊ะ 4", status: "available" },
    ]);

    // 🟢 new: ฟังก์ชันอัปเดตสถานะโต๊ะ (mock)
    const updateTableStatus = (tableId, newStatus) => {
        setTableList((prev) =>
            prev.map((t) =>
                t.id === tableId ? { ...t, status: newStatus } : t
            )
        );
    };

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#EAF2FF] to-[#C6D8FF]">
            <Header />

            <main className="flex-1 p-6">
                {/* 🔹 เลือกรูปแบบการขาย */}
                {!mode && (
                    <div className="flex flex-col items-center justify-center h-full text-center text-[#3674B5]">
                        <h2 className="text-2xl font-semibold mb-6">
                            เลือกรูปแบบการขาย
                        </h2>

                        <div className="flex flex-wrap justify-center item-center gap-6">
                            <button
                                onClick={() => setMode("dine-in")}
                                className="flex flex-col items-center justify-center w-48 h-48 bg-white shadow-lg rounded-2xl hover:bg-[#E9F3FF] hover:shadow-xl transition-all duration-200"
                            >
                                <Storefront size={64} />
                                <span className="mt-3 font-semibold text-lg">ทานที่ร้าน</span>
                            </button>

                            <button
                                onClick={() => setMode("takeaway")}
                                className="flex flex-col items-center justify-center w-48 h-48 bg-white shadow-lg rounded-2xl hover:bg-[#E9F3FF] hover:shadow-xl transition-all duration-200"
                            >
                                <ShoppingBag size={64} />
                                <span className="mt-3 font-semibold text-lg">สั่งกลับบ้าน</span>
                            </button>
                        </div>
                    </div>
                )}

                {/* 🔹 โหมด dine-in: หน้าเลือกโต๊ะ */}
                {mode === "dine-in" && !selectedTable && (
                    <RestaurantTableView
                        tables={tableList} // 🟢 ส่งข้อมูลโต๊ะลงไป
                        onSelectTable={(tableId) => setSelectedTable(tableId)}
                        onBack={() => setMode(null)}
                    />
                )}

                {/* 🔹 หน้า OrderPanel */}
                {(mode === "takeaway" || selectedTable) && (
                    <RestaurantOrderPanel
                        mode={mode}
                        tableId={selectedTable}
                        onBack={() => {
                            setSelectedTable(null);
                            setMode(null);
                        }}
                        onOpenBill={(tableId) => updateTableStatus(tableId, "pending")} // 🟢 จำลองเปิดบิล
                    />
                )}
            </main>
        </div>
    );
}
