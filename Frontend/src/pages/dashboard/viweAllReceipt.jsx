/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import axios from "axios";
import ReceiptLayout from "../../components/receipt/ReceiptLayout";
import Header from "../../components/shared/Header";

export default function ViewAllReceipt() {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const storeId = localStorage.getItem("currentStore");

    const [receipts, setReceipts] = useState([]);
    const [selectedReceipt, setSelectedReceipt] = useState(null);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    // 📅 วันที่เริ่มต้นและสิ้นสุด
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    useEffect(() => {
        const fetchReceipts = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/orders/${storeId}/all-receipts`, { withCredentials: true });
                setReceipts(res.data);
            } catch (err) {
                console.error("❌ Error fetching receipts:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchReceipts();
    }, [storeId]);

    if (loading) return <p className="text-center mt-10 text-gray-500">กำลังโหลดข้อมูลใบเสร็จ...</p>;

    // 🗓️ ฟังก์ชันกรองตามวันที่
    const filterByDateRange = (receiptDate) => {
        if (!startDate && !endDate) return true;
        const date = new Date(receiptDate);
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;
        if (start && end) return date >= start && date <= end;
        if (start) return date >= start;
        if (end) return date <= end;
        return true;
    };

    // ✅ ฟิลเตอร์ตามคำค้นหาและช่วงวันที่
    const filteredReceipts = receipts.filter((r) => {
        const name = (r.userId?.firstName || "") + " " + (r.userId?.lastName || "");
        const matchSearch =
            r._id?.toLowerCase().includes(search.toLowerCase()) ||
            name.toLowerCase().includes(search.toLowerCase());
        return matchSearch && filterByDateRange(r.createdAt);
    });

    return (
        <div className="h-screen bg-[#E9F3FF]">
            <Header />
            <div className="max-h-[calc(100vh-64px)] p-5">
                {/* ส่วนบน */}
                <div className="flex items-center justify-between md:flex-row gap-4 bg-white rounded-lg shadow p-3 mb-3">
                    {/* 🔍 ค้นหา */}
                    <div className="flex w-full md:w-1/2 gap-2">
                        <input
                            type="text"
                            placeholder="ค้นหาตามเลขออเดอร์ / พนักงาน"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="flex-1 border border-slate-300 rounded-lg px-3 py-2 shadow-sm focus:ring-2 focus:ring-[#3674B5]"
                        />
                    </div>

                    {/* 🗓️ ช่องเลือกวันที่ */}
                    <div className="flex gap-2 flex-wrap justify-center">
                        <div className="flex items-center gap-2 bg-white rounded-lg shadow px-3 py-2">
                            <label className="text-sm text-slate-600">เริ่มต้น</label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="border border-slate-300 rounded px-2 py-1 text-sm focus:ring-1 focus:ring-[#3674B5]"
                            />
                        </div>
                        <div className="flex items-center gap-2 bg-white rounded-lg shadow px-3 py-2">
                            <label className="text-sm text-slate-600">สิ้นสุด</label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="border border-slate-300 rounded px-2 py-1 text-sm focus:ring-1 focus:ring-[#3674B5]"
                            />
                        </div>
                    </div>
                </div>

                {/* 🔸 layout หลัก: list order + ใบเสร็จ */}
                <div className="grid grid-cols-1 gap-6 overflow-y-auto lg:grid-cols-3">
                    {/* ✅ กล่องซ้าย: ลิสต์ออเดอร์ */}
                    <div className="col-span-2 bg-white rounded-xl shadow p-4 overflow-y-auto h-[calc(100vh-180px)]">
                        <h2 className="text-slate-600 font-medium mb-3">ลิสต์ออเดอร์</h2>
                        {filteredReceipts.length > 0 ? (
                            <ul className="space-y-2">
                                {filteredReceipts.map((r) => (
                                    <li
                                        key={r._id}
                                        onClick={() => setSelectedReceipt(r)}
                                        className={`border rounded-lg p-3 cursor-pointer transition
                                                ${selectedReceipt?._id === r._id
                                                ? "bg-[#3674B5]/10 border-[#3674B5]"
                                                : "hover:bg-slate-50"
                                            }`}
                                    >
                                        <div className="flex justify-between items-center">
                                            <p className="text-sm font-medium text-slate-700">
                                                #{r._id.slice(-6)}
                                            </p>
                                            <span className="text-xs text-slate-500">
                                                {new Date(r.createdAt).toLocaleString("th-TH")}
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-500 mt-1">
                                            {r.userId?.firstName || "ไม่ระบุ"} — {r.paymentMethod}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-center text-slate-400">ไม่พบออเดอร์</p>
                        )}
                    </div>

                    {/* ✅ กล่องขวา: ใบเสร็จ */}
                    <div className="h-[calc(100vh-180px)] overflow-y-auto bg-white rounded-xl shadow p-4 flex justify-center items-start">
                        {selectedReceipt ? (
                            <ReceiptLayout receipt={selectedReceipt} />
                        ) : (
                            <p className="text-slate-400 mt-10">เลือกออเดอร์ทางซ้ายเพื่อดูใบเสร็จ</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
