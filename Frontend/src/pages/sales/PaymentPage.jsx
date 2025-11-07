import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

export default function PaymentPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { cart = [], totalAmount = 0, storeId } = location.state || {};

    const [method, setMethod] = useState("cash");
    const [paid, setPaid] = useState("");
    const [change, setChange] = useState(0);

    const subtotal = totalAmount;
    const vat = subtotal * 0.07;
    const total = subtotal + vat;

    const handlePaidChange = (e) => {
        const value = Number(e.target.value);
        setPaid(value);
        setChange(value - total);
    };

    const handleConfirm = async () => {
        if (method === "cash" && paid < total) {
            alert("ยอดเงินไม่พอ กรุณาตรวจสอบอีกครั้ง");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            const headers = { Authorization: `Bearer ${token}` };

            const orderPayload = {
                storeId,
                userId: null, // ถ้ามีระบบ user ให้ใส่ userId ของพนักงาน
                items: cart.map((i) => ({
                    productId: i._id,
                    barcode: i.barcode,
                    name: i.name,
                    price: i.price,
                    qty: i.qty,
                    total: i.price * i.qty,
                    options: i.options || null
                })),
                subTotal: subtotal,
                tax: vat,
                total: total,
                paymentMethod: method,
                paidAmount: method === "cash" ? paid : total,
                changeAmount: method === "cash" ? change : 0
            };

            await axios.post("http://localhost:3000/orders/create", orderPayload, { headers });

            alert("✅ ชำระเงินสำเร็จ และบันทึกประวัติเรียบร้อย");
            navigate(-1);
        } catch (err) {
            console.error("❌ Error saving order:", err);
            alert("เกิดข้อผิดพลาดในการบันทึกประวัติการขาย");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#EAF2FF] to-[#C6D8FF] flex flex-col items-center justify-center px-6">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6">
                <div className="flex items-center justify-between mb-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="text-slate-500 hover:text-slate-700 flex items-center gap-1"
                    >
                        กลับ
                    </button>
                    <h2 className="text-xl font-semibold text-[#3674B5]">ชำระเงิน</h2>
                </div>

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
                            {opt.icon}
                            <span className="text-sm mt-1">{opt.label}</span>
                        </button>
                    ))}
                </div>

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
                        ยืนยันชำระเงิน
                    </button>
                </div>
            </div>
        </div>
    );
}
