/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import axios from "axios";
import {
    ResponsiveContainer,
    LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid
} from "recharts";
import { ChartLineUp, ShoppingBag, Receipt } from "phosphor-react";

import Header from "../../components/shared/Header";

export default function DashboardPage() {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    const [summary, setSummary] = useState({});
    const [salesData, setSalesData] = useState([]);
    const [topProducts, setTopProducts] = useState([]);
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [range, setRange] = useState("today");

    const storeId = localStorage.getItem("currentStore");

    const selectView = [
        { title: "วันนี้", value: "today" },
        { title: "สัปดาห์นี้", value: "week" },
        { title: "เดือนนี้", value: "month" },
        { title: "ปีนี้", value: "year" },
    ]

    useEffect(() => {
        fetchData();
    }, [range]);

    const fetchData = async () => {
        try {
            const summaryRes = await axios.get(`${API_BASE_URL}/reports/summary/${storeId}`, {
                headers,
                params: { range },
            });
            const salesRes = await axios.get(`${API_BASE_URL}/reports/sales-chart/${storeId}`, {
                headers,
            })
            const topProductsRes = await axios.get(`${API_BASE_URL}/reports/top-products/${storeId}`, {
                headers,
            });
            const recentOrdersRes = await axios.get(`${API_BASE_URL}/reports/recent/${storeId}`, {
                headers,
            });

            setSummary(summaryRes.data);
            setSalesData(salesRes.data);
            setTopProducts(topProductsRes.data);
            setRecentOrders(recentOrdersRes.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching data:", error);
            setLoading(false);
        }
    };






    if (loading) return <p className="text-center mt-20 text-slate-500">กำลังโหลดแดชบอร์ด...</p>;

    return (
        <div className="bg-gradient-to-b from-[#EAF2FF] to-[#C6D8FF]">
            <Header />
            <main className="max-h-[100vh-64px] overflow-y-auto mx-auto p-6">
                {/* เลือกดูตามวันนี้ เดือนนี้ ปีนี้ */}
                <div className="flex items-center justify-center gap-2 mb-6">
                    {selectView.map((item, index) => (
                        <button
                            key={index}
                            onClick={() => setRange(item.value)}
                            className={`
                                transition shadow-md px-4 py-2 rounded-lg text-sm font-semibold
                                hover:bg-[#3674B5] hover:text-white hover:translate-y-[-1px] 
                                ${range === item.value ? "bg-[#3674B5] text-white translate-y-[-1px]" : "bg-white text-[#3674B5]"}
                            `}
                        >
                            {item.title}
                        </button>
                    ))}
                </div>

                {/* 🔹 สรุปยอดรวม */}
                <div className=" grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    <SummaryCard
                        icon={<ChartLineUp size={32} />}
                        title="ยอดขายรวม"
                        value={`฿ ${(summary?.totalSales || 0).toLocaleString()}`}
                    />
                    <SummaryCard
                        icon={<Receipt size={32} />}
                        title="จำนวนบิล"
                        value={`${summary.totalOrders} บิล`}
                    />
                    <SummaryCard
                        icon={<ShoppingBag size={32} />}
                        title="สินค้าขายดี"
                        value={summary.bestProduct}
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* 🔸 กราฟยอดขาย */}
                    <div className="col-span-2 bg-white rounded-xl shadow-md p-6 mb-6">
                        <h2 className="text-lg font-semibold text-slate-700 mb-3">ยอดขายรายวัน</h2>
                        <ResponsiveContainer width="100%" height={200}>
                            <LineChart data={salesData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="sales" stroke="#3674B5" strokeWidth={3} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    {/* 🔸 สินค้าขายดี */}
                    <div className="col-span-1 bg-white rounded-xl shadow-md p-6 mb-6">
                        <h2 className="text-lg font-semibold text-slate-700 mb-4">สินค้าขายดี</h2>
                        <table className="w-full text-sm text-slate-700">
                            <thead className="bg-slate-50 border-b text-slate-500">
                                <tr>
                                    <th className="text-left py-2 px-3">สินค้า</th>
                                    <th className="text-center py-2 px-3">จำนวน</th>
                                    <th className="text-right py-2 px-3">ยอดขาย</th>
                                </tr>
                            </thead>
                            <tbody>
                                {topProducts.map((p, i) => (
                                    <tr key={i} className="border-b hover:bg-slate-50">
                                        <td className="py-2 px-3">{p.name}</td>
                                        <td className="text-center py-2 px-3">{p.qty}</td>
                                        <td className="text-right py-2 px-3 text-[#3674B5] font-medium">฿ {p.total}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* 🔸 รายการล่าสุด */}
                <div className="bg-white rounded-xl shadow-md p-6">
                    <h2 className="text-lg font-semibold text-slate-700 mb-4">รายการขายล่าสุด</h2>
                    <table className="w-full text-sm text-slate-700">
                        <thead className="bg-slate-50 border-b text-slate-500">
                            <tr>
                                <th className="text-left py-2 px-3">เวลา</th>
                                <th className="text-left py-2 px-3">พนักงาน</th>
                                <th className="text-right py-2 px-3">ยอดขาย</th>
                                <th className="text-center py-2 px-3">วิธีชำระ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentOrders.map((o, i) => (
                                <tr key={i} className="border-b hover:bg-slate-50">
                                    <td className="py-2 px-3">{o.time}</td>
                                    <td className="py-2 px-3">{o.staff}</td>
                                    <td className="text-right py-2 px-3 text-[#3674B5] font-medium">฿ {o.total}</td>
                                    <td className="text-center py-2 px-3">{o.payment}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </main>
        </div>
    );
}

// 🔹 Component ย่อย: Summary Card
function SummaryCard({ icon, title, value }) {
    return (
        <div className="bg-white rounded-xl shadow-md p-4 flex items-center gap-4">
            <div className="bg-[#3674B5]/10 text-[#3674B5] w-12 h-12 rounded-lg flex items-center justify-center">
                {icon}
            </div>
            <div>
                <p className="text-sm text-slate-500">{title}</p>
                <p className="text-lg font-semibold text-slate-800">{value}</p>
            </div>
        </div>
    );
}
