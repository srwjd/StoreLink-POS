import { useState } from "react";
import {
    Storefront,
    ShoppingBag,
    // ArrowLeft,
} from "phosphor-react";
import Header from "../../components/shared/Header";
import RestaurantTableView from "../../components/restaurant/RestaurantTableView";
import RestaurantOrderPanel from "../../components/restaurant/RestaurantOrderPanel";


export default function SalesRestaurant() {
    const [mode, setMode] = useState(null); // dine-in | takeaway
    const [selectedTable, setSelectedTable] = useState(null);

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#EAF2FF] to-[#C6D8FF]">
            {/* Header */}
            <Header />

            <main className="flex-1 p-6">
                {/* 🔹 หน้าหลัก เลือกรูปแบบการขาย */}
                {!mode && (
                    <div className="flex flex-col  items-center justify-center h-full text-center text-[#3674B5]">
                        <h2 className="text-2xl font-semibold mb-6">
                            เลือกรูปแบบการขาย
                        </h2>

                        <div className="flex flex-wrap justify-center item-center gap-6">
                            {/* ปุ่ม dine-in */}
                            <button
                                onClick={() => setMode("dine-in")}
                                className="flex flex-col items-center justify-center w-48 h-48 bg-white shadow-lg rounded-2xl hover:bg-[#E9F3FF] hover:shadow-xl transition-all duration-200"
                            >
                                <Storefront size={64} />
                                <span className="mt-3 font-semibold text-lg">ทานที่ร้าน</span>
                            </button>

                            {/* ปุ่ม takeaway */}
                            <button
                                onClick={() => setMode("takeaway")}
                                className="flex flex-col items-center justify-center w-48 h-48 bg-white shadow-lg rounded-2xl hover:bg-[#E9F3FF] hover:shadow-xl transition-all duration-200"
                            >
                                <ShoppingBag size={64} />
                                <span className="mt-3 font-semibold text-lg">
                                    สั่งกลับบ้าน
                                </span>
                            </button>
                        </div>
                    </div>
                )}

                {/* 🔹 โหมดมีโต๊ะ */}
                {mode === "dine-in" && !selectedTable && (
                    <RestaurantTableView
                        onSelectTable={(tableId) => setSelectedTable(tableId)}
                        onBack={() => setMode(null)}
                    />
                )}

                {/* 🔹 หน้าสั่งอาหาร */}
                {(mode === "takeaway" || selectedTable) && (
                    <RestaurantOrderPanel
                        mode={mode}
                        tableId={selectedTable}
                        onBack={() => {
                            setSelectedTable(null);
                            setMode(null);
                        }}
                    />
                )}
            </main>
        </div>
    );
}
