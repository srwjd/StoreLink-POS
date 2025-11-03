import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import {
    Barcode,
    PlusCircle,
    Trash,
    CreditCard,
} from "phosphor-react";
import Header from "../components/shared/Header";

export default function SalesGeneral() {
    const navigate = useNavigate();
    const { store, storeId } = useStore();
    const [barcode, setBarcode] = useState("");
    const [items, setItems] = useState([]);

    // ✅ เพิ่มสินค้าโดย mock ชั่วคราว (จะเชื่อม API ทีหลัง)
    const handleAdd = () => {
        if (!barcode.trim()) return;
        const product = {
            code: barcode,
            name: "สินค้าทั่วไป",
            price: 120,
            qty: 1,
        };
        setItems((prev) => [...prev, product]);
        setBarcode("");
    };

    const handleRemove = (i) => {
        setItems(items.filter((_, index) => index !== i));
    };

    const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#EAF2FF] to-[#C6D8FF]">
            {/* 🔹 Header */}
            <Header
                storeName={store?.storeName}
                logoClick={() =>
                    navigate(`/main-menu/${store.storeType}/${storeId}`)
                }
            />

            {/* 🔹 Main */}
            <main className="flex flex-1 p-6 gap-6">
                {/* ✅ Left Section - รายการขาย */}
                <div className="flex-1 bg-white rounded-xl shadow-lg p-6">
                    <h1 className="text-2xl font-semibold text-[#3674B5] mb-4">
                        ขายสินค้าทั่วไป
                    </h1>

                    {/* ช่องกรอกรหัสสินค้า */}
                    <div className="flex gap-3 items-center mb-5">
                        <div className="relative flex-1">
                            <Barcode
                                size={18}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                            />
                            <input
                                type="text"
                                value={barcode}
                                onChange={(e) => setBarcode(e.target.value)}
                                placeholder="กรอกรหัสสินค้า / Barcode..."
                                className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#3674B5] outline-none transition"
                            />
                        </div>
                        <button
                            onClick={handleAdd}
                            className="flex items-center gap-1 bg-[#3674B5] text-white px-4 py-2 rounded-lg shadow hover:bg-[#2f5fa0] transition"
                        >
                            <PlusCircle size={18} /> เพิ่ม
                        </button>
                    </div>

                    {/* ตารางสินค้า */}
                    <table className="w-full border-separate border-spacing-y-2 text-sm">
                        <thead>
                            <tr className="bg-[#3674B5] text-white text-center">
                                <th className="py-2 rounded-tl-lg">รหัสสินค้า</th>
                                <th>ชื่อสินค้า</th>
                                <th>ราคา</th>
                                <th>จำนวน</th>
                                <th>รวม</th>
                                <th className="rounded-tr-lg">ลบ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan="6"
                                        className="text-center py-6 text-slate-400"
                                    >
                                        ยังไม่มีรายการสินค้า
                                    </td>
                                </tr>
                            ) : (
                                items.map((i, index) => (
                                    <tr
                                        key={index}
                                        className="hover:bg-[#E9F3FF] text-center bg-slate-50 transition"
                                    >
                                        <td className="py-2">{i.code}</td>
                                        <td>{i.name}</td>
                                        <td>{i.price.toFixed(2)}</td>
                                        <td>
                                            <input
                                                type="number"
                                                min="1"
                                                value={i.qty}
                                                onChange={(e) => {
                                                    const qty = Number(e.target.value);
                                                    setItems((prev) =>
                                                        prev.map((p, idx) =>
                                                            idx === index ? { ...p, qty } : p
                                                        )
                                                    );
                                                }}
                                                className="w-16 border border-slate-300 rounded-md text-center"
                                            />
                                        </td>
                                        <td>{(i.price * i.qty).toFixed(2)}</td>
                                        <td>
                                            <button
                                                onClick={() => handleRemove(index)}
                                                className="text-red-500 hover:text-red-700 transition"
                                            >
                                                <Trash size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* ✅ Right Section - สรุปยอด */}
                <div className="w-80 bg-white rounded-xl shadow-lg p-6 flex flex-col justify-between">
                    <div>
                        <h2 className="text-lg font-semibold mb-3 text-[#3674B5]">
                            สรุปยอดชำระ
                        </h2>
                        <div className="flex justify-between mb-2 text-slate-600">
                            <span>รวม</span>
                            <span>{total.toFixed(2)} ฿</span>
                        </div>
                        <div className="flex justify-between mb-2 text-slate-600">
                            <span>ภาษี (7%)</span>
                            <span>{(total * 0.07).toFixed(2)} ฿</span>
                        </div>
                        <div className="flex justify-between text-lg font-bold text-[#3674B5] border-t pt-3">
                            <span>ยอดสุทธิ</span>
                            <span>{(total * 1.07).toFixed(2)} ฿</span>
                        </div>
                    </div>

                    <button
                        disabled={items.length === 0}
                        className={`flex items-center justify-center gap-2 py-2.5 rounded-lg mt-6 font-medium transition shadow ${items.length === 0
                                ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                                : "bg-[#3674B5] hover:bg-[#2f5fa0] text-white"
                            }`}
                    >
                        <CreditCard size={20} /> ชำระเงิน
                    </button>
                </div>
            </main>
        </div>
    );
}
