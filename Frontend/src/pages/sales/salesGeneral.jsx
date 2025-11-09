
/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../../context/StoreContext";
import {
    Barcode,
    PlusCircle,
    Trash,
    CreditCard,
    MinusCircle,
    MagnifyingGlass,
    X,
} from "phosphor-react";
import Header from "../../components/shared/Header";

export default function SalesGeneral() {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    const navigate = useNavigate();
    const inputRef = useRef(null);
    const inputSerialRef = useRef(null);
    const { store } = useStore();
    const [barcode, setBarcode] = useState("");
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [serialModal, setSerialModal] = useState({ open: false, product: null, quantity: 1, available: [], selected: [] });
    const [serialSearch, setSerialSearch] = useState("");

    // โฟกัสช่องค้นหา SN เมื่อป๊อปอัพเปิด
    useEffect(() => {
        if (serialModal.open) {
            // หน่วงเล็กน้อยให้ DOM พร้อม
            setTimeout(() => {
                if (inputSerialRef.current) inputSerialRef.current.focus();
            }, 50);
        }
    }, [serialModal.open]);
    const token = localStorage.getItem("token");
    const storeId = localStorage.getItem("currentStore");


    const fetchAllProduct = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/products/all/${storeId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setProducts(res.data.products);
        } catch (err) {
            console.error("Error fetching products:", err);
        }
    };

    useEffect(() => {
        fetchAllProduct();
        inputRef.current?.focus();
    }, [storeId]);

    const handleAdd = async () => {
        try {
            let quantity = 1;
            let code = barcode.trim();

            // ✅ ถ้ามีรูปแบบ 10*8851234567890
            if (barcode.includes("*")) {
                const [qtyPart, codePart] = barcode.split("*");
                const parsedQty = parseInt(qtyPart);
                if (!isNaN(parsedQty) && parsedQty > 0) {
                    quantity = parsedQty;
                }
                code = codePart.trim();
            }

            const product = products.find((p) => p.barcode === code);

            if (product) {
                if (product.type === "serialized") {
                    const available = (product.serialList || []).filter((s) => s.status === "available");
                    if (available.length === 0) {
                        alert("สินค้านี้ไม่มี Serial Number พร้อมขาย");
                    } else {
                        setSerialModal({ open: true, product, quantity, available, selected: [] });
                    }
                } else {
                    const existingItem = cart.find((i) => i._id === product._id);
                    if (existingItem) {
                        setCart(cart.map((i) => i === existingItem ? { ...i, qty: i.qty + quantity } : i));
                    } else {
                        setCart([...cart, { ...product, qty: quantity }]);
                    }
                }
            }

            setBarcode(""); // เคลียร์ช่องหลังเพิ่ม
            inputRef.current?.focus();
        } catch (err) {
            console.error("Error adding product:", err);
            inputRef.current?.focus();
        }
    };


    const handleRemove = (index) => {
        setCart(cart.filter((_, idx) => idx !== index));
    };

    const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

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
                <div className="flex-1 bg-white rounded-xl shadow-xl p-6 border border-slate-200">
                   
                    {/* ช่องกรอกรหัสสินค้า */}
                    <div className="flex gap-3 items-center mb-3">
                        <div className="relative flex-1">
                            <Barcode
                                size={18}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                            />
                            <input
                                type="text"
                                ref={inputRef}
                                value={barcode}
                                onChange={(e) => setBarcode(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && barcode.trim() !== "") {
                                        handleAdd();
                                    }
                                }}
                                placeholder="กรอกรหัสสินค้า / Barcode..."
                                className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#3674B5] outline-none transition"
                            />

                        </div>
                        <button
                            onClick={handleAdd}
                            className="flex items-center gap-1 bg-[#3674B5] text-white px-4 py-2 rounded-lg shadow hover:bg-[#2f5fa0] transition-all duration-200"
                        >
                            <PlusCircle size={18} /> เพิ่ม
                        </button>
                    </div>

                    {/* ตารางสินค้า */}
                    <div className="flex-1 overflow-x-auto">
                        <table className="flex-1 w-full border-separate border-spacing-y-2 text-sm">
                            <thead>
                                <tr className="text-slate-500 text-center">
                                    <th className="py-2 rounded-tl-lg font-medium w-1/6">รหัสสินค้า</th>
                                    <th className="font-medium w-">ชื่อสินค้า</th>
                                    <th className="font-medium w-1/6">ราคา</th>
                                    <th className="font-medium w-1/8">จำนวน</th>
                                    <th className="font-medium w-1/6">รวม</th>
                                    <th className="rounded-tr-lg font-medium w-1/10">ลบ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cart.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="6"
                                            className="text-center py-8 text-slate-400 bg-slate-50 rounded-lg"
                                        >
                                            ยังไม่มีรายการสินค้า
                                        </td>
                                    </tr>
                                ) : (
                                    cart.map((i, index) => (
                                        <tr
                                            key={index}
                                            className="text-center bg-white"
                                        >
                                            <td className="text-center text-slate-600">{i.barcode}</td>
                                            <td className="text-slate-700 font-medium">{i.name}</td>
                                            <td className="text-center text-slate-600">
                                                {i.price.toFixed(2)}&nbsp;&nbsp;บาท
                                            </td>
                                            <td className="text-center">
                                                {i.type === "serialized" && i.selectedSerial ? (
                                                    <div className="flex items-center justify-center gap-2">
                                                        <span className="w-6 text-center text-slate-700 font-semibold">1</span>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center justify-center gap-2">
                                                        <button
                                                            onClick={() =>
                                                                setCart((prev) =>
                                                                    prev.map((p, idx) =>
                                                                        idx === index
                                                                            ? { ...p, qty: Math.max(1, p.qty - 1) }
                                                                            : p
                                                                    )
                                                                )
                                                            }
                                                            className=" rounded-full hover:bg-slate-200 text-slate-600"
                                                        >
                                                            <MinusCircle size={18} />
                                                        </button>
                                                        <span className="w-6 text-center text-slate-700 font-semibold">
                                                            {i.qty}
                                                        </span>
                                                        <button
                                                            onClick={() =>
                                                                setCart((prev) =>
                                                                    prev.map((p, idx) =>
                                                                        idx === index ? { ...p, qty: p.qty + 1 } : p
                                                                    )
                                                                )
                                                            }
                                                            className="rounded-full hover:bg-slate-200 text-slate-600"
                                                        >
                                                            <PlusCircle size={18} />
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="text-center text-slate-700 font-semibold">
                                                {(i.price * i.qty).toFixed(2)}&nbsp;&nbsp;บาท
                                            </td>
                                            <td className="text-center">
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
                        onClick={() => {
                            if (cart.length === 0) return alert("ยังไม่มีรายการสินค้า");
                            navigate(`/sales/payment/${storeId}`, { state: { cart, totalAmount: total, storeId } })
                        }}
                        className="flex items-center justify-center gap-2 py-2.5 rounded-lg mt-6 font-medium transition shadow bg-[#3674B5] hover:bg-[#2f5fa0] text-white"
                    >
                        <CreditCard size={20} /> ชำระเงิน
                    </button>

                </div>
            </main>

            {/* 🟦 Modal เลือก Serial Number สำหรับสินค้าแบบ Serialized */}
            {serialModal.open && serialModal.product && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-gradient-to-b from-white to-[#F6FAFF] rounded-2xl shadow-2xl w-full max-w-xl p-6 border border-[#D7E6FF] relative">
                        <button
                            onClick={() => setSerialModal({ open: false, product: null, quantity: 1, available: [], selected: [] })}
                            className="absolute right-4 top-4 text-slate-500 hover:text-slate-700"
                            aria-label="Close"
                        >
                            <X size={18} />
                        </button>
                        <h3 className="text-xl font-semibold text-[#2E6FDB] text-center">เลือก Serial Number</h3>
                        <p className="text-sm text-slate-600 mt-1 text-center">สินค้า: <span className="font-medium text-slate-700">{serialModal.product.name}</span></p>
                        <div className="flex items-center justify-center gap-3 text-xs text-slate-600 mt-2">
                            <span className="px-2 py-0.5 rounded-full bg-[#EAF2FF] border border-[#C4D9FA]">ต้องการ {serialModal.quantity}</span>
                            <span className="px-2 py-0.5 rounded-full bg-[#F1F5FF] border border-[#DDE8FF]">พร้อมขาย {(serialModal.available || []).length}</span>
                            <span className="px-2 py-0.5 rounded-full bg-[#F3FFF7] border border-[#CDEFD9]">เลือกแล้ว {serialModal.selected.length}</span>
                        </div>

                        {/* ค้นหา SN */}
                        <div className="relative mt-4">
                            <MagnifyingGlass size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                ref={inputSerialRef}
                                value={serialSearch}
                                onChange={(e) => setSerialSearch(e.target.value)}
                                placeholder="ค้นหา Serial Number..."
                                className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#3674B5] outline-none transition"
                            />
                        </div>

                        <div className="max-h-72 overflow-y-auto border border-slate-200 rounded-lg p-3 mt-3 bg-white/80">
                            {(serialModal.available || []).filter((s) =>
                                s.serialNumber?.toLowerCase().includes(serialSearch.toLowerCase())
                            ).map((s, idx) => {
                                const isChecked = serialModal.selected.includes(s.serialNumber);
                                const disabled = !isChecked && serialModal.selected.length >= serialModal.quantity;
                                return (
                                    <label key={idx} className={`flex items-center justify-between px-3 py-2 rounded-xl border mb-2 shadow-sm ${isChecked ? "bg-[#EEF5FF] border-[#C7DBFF]" : "bg-white border-slate-200 hover:bg-[#F7FAFF]"}`}>
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="checkbox"
                                                checked={isChecked}
                                                disabled={disabled}
                                                onChange={(e) => {
                                                    setSerialModal((prev) => {
                                                        const nextSelected = e.target.checked
                                                            ? [...prev.selected, s.serialNumber]
                                                            : prev.selected.filter((x) => x !== s.serialNumber);
                                                        return { ...prev, selected: nextSelected };
                                                    });
                                                }}
                                            />
                                            <span className="text-sm font-medium text-slate-700">{s.serialNumber}</span>
                                        </div>
                                        <span className="text-xs text-slate-500">สถานะ: {s.status}</span>
                                    </label>
                                );
                            })}
                            {serialModal.available && (serialModal.available.filter((s) => s.serialNumber?.toLowerCase().includes(serialSearch.toLowerCase())).length === 0) && (
                                <p className="text-center text-slate-500 py-8">ไม่พบ Serial ที่ตรงกับคำค้นหา</p>
                            )}
                            {(!serialModal.available || serialModal.available.length === 0) && (
                                <p className="text-center text-slate-500 py-8">ไม่มี Serial Number พร้อมขาย</p>
                            )}
                        </div>
                        <div className="flex justify-between items-center gap-3 mt-5">
                            <div className="text-xs text-slate-500">เลือก {serialModal.selected.length}/{Math.min(serialModal.quantity, (serialModal.available || []).length)}</div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setSerialModal({ open: false, product: null, quantity: 1, available: [], selected: [] })}
                                    className="px-4 py-2 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700"
                                >ยกเลิก</button>
                                <button
                                    disabled={serialModal.selected.length !== Math.min(serialModal.quantity, (serialModal.available || []).length)}
                                    onClick={() => {
                                        const chosen = serialModal.selected;
                                        const items = chosen.map((sn) => ({ ...serialModal.product, qty: 1, selectedSerial: sn }));
                                        setCart((prev) => [...prev, ...items]);
                                        setSerialModal({ open: false, product: null, quantity: 1, available: [], selected: [] });
                                        setSerialSearch("");
                                        inputRef.current?.focus();
                                    }}
                                    className={`px-4 py-2 rounded-lg text-white ${serialModal.selected.length === Math.min(serialModal.quantity, (serialModal.available || []).length) ? "bg-[#3674B5] hover:bg-[#2f5fa0]" : "bg-slate-300 cursor-not-allowed"}`}
                                >ยืนยัน</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
