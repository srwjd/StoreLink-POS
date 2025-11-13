
import { useState, useEffect } from "react";
import axios from "axios";
import Header from "../shared/Header";
import { toast } from "react-hot-toast";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const token = localStorage.getItem("token");
const headers = { Authorization: `Bearer ${token}` };
const storeId = localStorage.getItem("currentStore");

export default function Kitchen() {
    const [orders, setOrders] = useState([]);

    const fetchOrders = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/orders/${storeId}/all-receipts`, { headers });
            setOrders(res.data);
        } catch (err) {
            console.error("Error fetching kitchen orders:", err);
        }
    };

    const updateStatus = async (orderId, newStatus) => {
        try {
            await axios.put(`${API_BASE_URL}/orders/${orderId}/kitchen-status`, { kitchenStatus: newStatus, orderId }, { headers });
            toast.success(`อัปเดตสถานะเป็น "${newStatus}"`);
            fetchOrders();
        } catch {
            toast.error("อัปเดตสถานะไม่สำเร็จ");
        }
    };

    useEffect(() => {
        fetchOrders();
        const interval = setInterval(fetchOrders, 5000);
        return () => clearInterval(interval);
    }, []);

    // 🧩 ตัวช่วยแสดงสีตามสถานะ
    const getStatusColor = (status) => {
        switch (status) {
            case "waiting":
                return "bg-[#FFF6E0] border-[#FFD571]";
            case "cooking":
                return "bg-[#E7F3FF] border-[#80C4F1]";
            case "done":
                return "bg-[#E9FFE5] border-[#61D167]";
            default:
                return "bg-white border-slate-300";
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#EAF2FF] to-[#C6D8FF]">
            <Header />

            <main className="flex-1 w-full overflow-x-auto p-6">

                {orders.length === 0 ? (
                    <p className="text-slate-400 text-center mt-10">ยังไม่มีใบเสร็จเข้ามาในระบบ</p>
                ) : (
                    <div className="flex gap-4 min-h-[calc(100vh-130px)]">
                        {orders.map((order) => (
                            <div
                                key={order._id}
                                className={` ${order.kitchenStatus === "done" && "hidden"} flex-shrink-0 w-[270px] ${getStatusColor(order.kitchenStatus)} 
                  border-[1.5px] rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 p-4`}
                            >
                                {/* Header Order */}
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="font-semibold text-[#3674B5] text-lg">
                                        บิล #{order._id.slice(-6)}
                                    </h3>
                                    <span
                                        className={`text-xs px-2 py-0.5 rounded-full font-medium 
                      ${order.kitchenStatus === "waiting"
                                                ? "bg-[#FFD571] text-slate-700"
                                                : order.kitchenStatus === "cooking"
                                                    ? "bg-[#80C4F1] text-white"
                                                    : "bg-[#61D167] text-white"}`}
                                    >
                                        {order.kitchenStatus || "waiting"}
                                    </span>
                                </div>

                                {/* รายการอาหาร */}
                                <div className="bg-white/60 rounded-xl border border-white/40 p-2 mb-2 shadow-inner max-h-[120px] overflow-y-auto">
                                    <ul className="text-sm text-slate-700 space-y-1">
                                        {order.items.map((i, index) => (
                                            <li key={index} className="flex justify-between">
                                                <span>• {i.name}</span>
                                                <span>x{i.qty}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* ปุ่มสถานะ */}
                                <div className="flex flex-col gap-2 mt-2">
                                    {order.kitchenStatus === "waiting" && (
                                        <button
                                            onClick={() => updateStatus(order._id, "cooking")}
                                            className="bg-[#3674B5] hover:bg-[#2f5fa0] text-white py-2 rounded-lg font-medium text-sm transition"
                                        >
                                            เริ่มทำ
                                        </button>
                                    )}
                                    {order.kitchenStatus === "cooking" && (
                                        <button
                                            onClick={() => updateStatus(order._id, "done")}
                                            className="bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-medium text-sm transition"
                                        >
                                            เสร็จแล้ว
                                        </button>
                                    )}
                                    {order.kitchenStatus === "done" && (
                                        <button
                                            disabled
                                            className="bg-slate-300 text-slate-600 py-2 rounded-lg font-medium text-sm cursor-default"
                                        >
                                            🟢  เสร็จสิ้น
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
