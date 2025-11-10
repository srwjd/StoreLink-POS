/* eslint-disable react-hooks/exhaustive-deps */
import { jwtDecode } from "jwt-decode";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../../components/shared/Header";
import axios from "axios";

export default function PaymentPage() {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const navigate = useNavigate();
    const location = useLocation();

    // 🔹 รับค่าที่มาจากหน้า Sales หรือ Table
    const { cart = [], totalAmount = 0, storeId, tableNumber = null } = location.state || {};

    const [method, setMethod] = useState("cash");
    const [paid, setPaid] = useState("");
    const [change, setChange] = useState(0);
    const [promptPayNumber, setPromptPayNumber] = useState("");
    const [showFullQR, setShowFullQR] = useState(false);

    const subtotal = totalAmount;
    const vat = subtotal * 0.07;
    const total = subtotal + vat;


    // 🔹 ดึงหมายเลขพร้อมเพย์ของร้าน
    useEffect(() => {
        const fetchStoreData = async () => {
            const token = localStorage.getItem("token");
            try {
                const res = await axios.get(`${API_BASE_URL}/stores/${storeId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setPromptPayNumber(res.data.paymentSettings?.promptPayNumber || "");
            } catch (err) {
                console.error("Error fetching store data:", err);
            }
        };
        if (storeId) fetchStoreData();
    }, [storeId]);

    const handlePaidChange = (e) => {
        const value = Number(e.target.value);
        setPaid(value);
        setChange(value - total);
    };

    // ✅ แก้ logic ให้รองรับทั้งร้านทั่วไป และร้านอาหาร
    const handleConfirm = async () => {
        if (method === "cash" && paid < total) {
            alert("ยอดเงินไม่พอ กรุณาตรวจสอบอีกครั้ง");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            const headers = { Authorization: `Bearer ${token}` };

            // ✅ ดึง userId จาก JWT token
            let userId = null;
            try {
                const decoded = jwtDecode(token);
                userId = decoded.id || decoded._id;
            } catch (err) {
                console.warn("ไม่สามารถอ่าน userId จาก token ได้:", err);
            }

            // ✅ สร้าง payload สำหรับส่งไป backend
            const orderPayload = {
                storeId,
                userId,
                tableNumber, // ถ้ามีถือว่าร้านอาหาร
                isInstantPay: !tableNumber, // ถ้าไม่มีโต๊ะ = จ่ายเลย
                items: cart.map((i) => ({
                    productId: i._id,
                    barcode: i.barcode,
                    name: i.name,
                    price: i.price,
                    qty: i.qty,
                    total: i.price * i.qty,
                    options: i.options || null,
                })),
                subTotal: subtotal,
                tax: vat,
                total: total,
                paymentMethod: method,
                paidAmount: method === "cash" ? paid : total,
                changeAmount: method === "cash" ? change : 0,
            };

            // ✅ เรียก backend เพื่อสร้าง order
            const res = await axios.post(`${API_BASE_URL}/orders/create`, orderPayload, { headers });

            console.log("✅ Order created:", res.data);

            // ✅ เมื่อสร้างออเดอร์สำเร็จ
            if (res.data.order && res.data.order._id) {
                alert("✅ ชำระเงินสำเร็จ และบันทึกประวัติเรียบร้อย");

                // 👉 ไปหน้าใบเสร็จโดยใช้ order._id ที่ backend ส่งกลับมา
                navigate(`/receipt/${res.data.order._id}`);
            } else {
                alert("❌ ไม่พบข้อมูลใบเสร็จจากเซิร์ฟเวอร์");
            }

        } catch (err) {
            console.error("❌ Error saving order:", err);
            alert("เกิดข้อผิดพลาดในการบันทึกประวัติการขาย");
        }
    };


    return (
        <div className="min-h-screen bg-gradient-to-b from-[#EAF2FF] to-[#C6D8FF]">
            <Header />
            <div className="min-h-[calc(100vh-56px)] flex flex-col items-center justify-center px-6">
                <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6 relative">
                    <div className="flex items-center justify-between mb-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="text-slate-500 hover:text-slate-700 flex items-center gap-1"
                        >
                            กลับ
                        </button>
                        <h2 className="text-xl font-semibold text-[#3674B5]">ชำระเงิน</h2>
                    </div>

                    {/* 💬 แสดงชื่อโต๊ะถ้ามี */}
                    {tableNumber && (
                        <p className="text-center text-slate-600 mb-3 text-sm">
                            โต๊ะที่กำลังใช้งาน: <span className="font-semibold text-[#3674B5]">{tableNumber}</span>
                        </p>
                    )}

                    {/* 💰 สรุปยอด */}
                    <div className="bg-slate-50 rounded-lg p-4 mb-5">
                        <div className="flex justify-between text-slate-600 mb-1">
                            <span>ยอดรวม</span>
                            <span>{subtotal.toFixed(2)} ฿</span>
                        </div>
                        <div className="flex justify-between text-slate-600 mb-1">
                            <span>ภาษี (7%)</span>
                            <span>{vat.toFixed(2)} ฿</span>
                        </div>
                        <div className="flex justify-between font-semibold text-[#3674B5] text-lg border-t pt-2">
                            <span>ยอดสุทธิ</span>
                            <span>{total.toFixed(2)} ฿</span>
                        </div>
                    </div>

                    {/* วิธีชำระ */}
                    <p className="font-medium text-slate-700 mb-2">เลือกวิธีชำระ</p>
                    <div className="grid grid-cols-2 gap-3 mb-5">
                        {[
                            { key: "cash", label: "เงินสด" },
                            { key: "promptpay", label: "พร้อมเพย์" },
                        ].map((opt) => (
                            <button
                                key={opt.key}
                                onClick={() => setMethod(opt.key)}
                                className={`flex flex-col items-center justify-center p-3 rounded-lg border ${method === opt.key
                                    ? "bg-[#3674B5] text-white border-[#3674B5]"
                                    : "bg-white border-slate-300 text-slate-600 hover:bg-slate-100"
                                    } transition`}
                            >
                                <span className="text-sm mt-1">{opt.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* เงินสด */}
                    {method === "cash" && (
                        <div className="mb-5">
                            <label className="block text-sm text-slate-700 mb-1">เงินที่ลูกค้าชำระ (บาท)</label>
                            <input
                                type="number"
                                value={paid}
                                onChange={handlePaidChange}
                                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#3674B5]"
                            />
                            <p className="text-right text-slate-600 mt-2">
                                เงินทอน:{" "}
                                <span
                                    className={`font-semibold ${change < 0 ? "text-red-500" : "text-[#3674B5]"
                                        }`}
                                >
                                    {change.toFixed(2)} ฿
                                </span>
                            </p>
                        </div>
                    )}

                    {/* พร้อมเพย์ */}
                    {method === "promptpay" && (
                        <div className="mb-5">
                            {promptPayNumber ? (
                                <>
                                    {/* 🔹 QR ย่อ */}
                                    {!showFullQR && (
                                        <div
                                            className="flex cursor-pointer"
                                            onClick={() => setShowFullQR(true)}
                                        >
                                            <img
                                                src={`https://promptpay.io/${promptPayNumber}/${total.toFixed(2)}`}
                                                alt="PromptPay QR"
                                                className="mx-auto w-24 h-24 border rounded-lg shadow-md hover:scale-105 transition-transform"
                                            />
                                            <div className="text-left ml-3">
                                                <p className="text-slate-700 mb-1 font-medium">พร้อมเพย์</p>
                                                <p className="text-slate-600 text-sm">PromptPay: {promptPayNumber}</p>
                                                <p className="font-semibold text-[#3674B5] text-sm">
                                                    ยอด {total.toFixed(2)} ฿
                                                </p>
                                                <p className="text-xs text-slate-400 mt-1">(แตะเพื่อขยาย)</p>
                                            </div>
                                        </div>
                                    )}

                                    {/* 🔸 QR เต็มจอ */}
                                    {showFullQR && (
                                        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center z-50">
                                            <img
                                                src={`https://promptpay.io/${promptPayNumber}/${total.toFixed(2)}`}
                                                alt="PromptPay QR Fullscreen"
                                                className="w-80 h-80 rounded-xl shadow-xl border-4 border-white"
                                            />
                                            <p className="mt-3 text-white font-semibold text-lg">
                                                สแกนเพื่อชำระ {total.toFixed(2)} ฿
                                            </p>
                                            <p className="text-slate-100 mt-1">PromptPay: {promptPayNumber}</p>

                                            <button
                                                onClick={() => setShowFullQR(false)}
                                                className="mt-5 bg-white text-[#3674B5] px-6 py-2 rounded-full shadow-md hover:bg-slate-100 font-medium"
                                            >
                                                ✕ ปิด
                                            </button>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <p className="text-red-500 text-sm">
                                    ❌ ร้านนี้ยังไม่ได้ตั้งค่าหมายเลขพร้อมเพย์
                                </p>
                            )}
                        </div>
                    )}

                    <div className="flex gap-3 justify-end">
                        <button
                            onClick={() => navigate(-1)}
                            className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-4 py-2 rounded-lg"
                        >
                            ยกเลิก
                        </button>
                        <button
                            onClick={handleConfirm}
                            className="bg-[#3674B5] hover:bg-[#2f5fa0] text-white px-5 py-2 rounded-lg font-semibold shadow-md"
                        >
                            {tableNumber ? "เปิดบิล" : "ยืนยันชำระเงิน"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
