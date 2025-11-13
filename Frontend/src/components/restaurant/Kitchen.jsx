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
            const res = await axios.get(`${API_BASE_URL}/orders/${storeId}/kitchen-orders`, { headers });
            setOrders(res.data);
        } catch (err) {
            console.error("Error fetching kitchen orders:", err);
        }
    };

    const updateStatus = async (orderId, newStatus) => {
        try {
            await axios.patch(`${API_BASE_URL}/orders/${orderId}/kitchen-status`, { status: newStatus }, { headers });
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

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#EAF2FF] to-[#C6D8FF]">
            <Header />
            <main className="flex-1 w-full overflow-x-auto p-5">
                <div className="flex gap-4 min-h-[calc(100vh-107px)]">
                    {orders.length === 0 ? (
                        <p className="text-slate-400 text-center w-full mt-10">ยังไม่มีใบเสร็จ</p>
                    ) : (
                        orders.map((order) => (
                            <div
                                key={order._id}
                                className={`flex-shrink-0 w-[250px] bg-white border-[1.5px] rounded-xl shadow-sm hover:shadow-md transition p-4 ${order.kitchenStatus === "waiting"
                                        ? "border-[#FFD571]"
                                        : order.kitchenStatus === "cooking"
                                            ? "border-[#80C4F1]"
                                            : "border-[#61D167]"
                                    }`}
                            >
                                <h2 className="font-semibold text-[#3674B5] mb-1">บิล #{order.queueNumber}</h2>
                                <p className="text-sm text-slate-500 mb-2">
                                    สถานะ: {order.kitchenStatus || "waiting"}
                                </p>

                                <ul className="text-sm text-slate-700 max-h-[120px] overflow-y-auto border-t pt-2">
                                    {order.items.map((i, index) => (
                                        <li key={index}>
                                            • {i.name} × {i.qty}
                                        </li>
                                    ))}
                                </ul>

                                <div className="flex flex-col gap-2 mt-3">
                                    {order.kitchenStatus !== "done" && (
                                        <>
                                            {order.kitchenStatus === "waiting" && (
                                                <button
                                                    onClick={() => updateStatus(order._id, "cooking")}
                                                    className="bg-[#3674B5] hover:bg-[#2f5fa0] text-white py-1 rounded-lg text-sm"
                                                >
                                                    ▶️ เริ่มทำ
                                                </button>
                                            )}
                                            {order.kitchenStatus === "cooking" && (
                                                <button
                                                    onClick={() => updateStatus(order._id, "done")}
                                                    className="bg-green-500 hover:bg-green-600 text-white py-1 rounded-lg text-sm"
                                                >
                                                    ✅ เสร็จแล้ว
                                                </button>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </main>
        </div>
    );
}
