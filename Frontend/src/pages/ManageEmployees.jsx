/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import axios from "axios";

import { MagnifyingGlass, FunnelSimple, Plus, UserCircle } from "phosphor-react";

import Header from "../components/shared/Header";
import Footer from "../components/shared/Footer";
import ManagePosition from "./ManagePosition";
import AddEmployeeModal from "../components/employees/AddEmployeeModal";

import { useStore } from "../context/StoreContext";

export default function ManageEmployees() {
    const [showAdd, setShowAdd] = useState(false);
    const [activeTab, setActiveTab] = useState("all");
    const [employees, setEmployees] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const { store } = useStore();
    const storeId = store._id;
    

    const fetchEmployees = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return setError("กรุณาเข้าสู่ระบบก่อนเข้าหน้านี้");

            if (!storeId) return;

            const res = await axios.get(`http://localhost:3000/employees/${storeId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setEmployees(res.data.employees);
        } catch (err) {
            console.error("Error fetching employees:", err);
            setError("ไม่สามารถโหลดข้อมูลพนักงานได้");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    return (
        <>
            <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#E9F3FF] to-[#C8DCFF]">
                <Header storeName={store?.storeName} />

                <main className="flex-1 px-8 py-6">
                    {/* 🔹 Tabs */}
                    <div className="flex gap-3 mb-6">
                        {[
                            { key: "all", label: "พนักงานทั้งหมด" },
                            { key: "permission", label: "จัดการสิทธิ์" },
                        ].map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-200 shadow-sm ${activeTab === tab.key
                                    ? "bg-[#3674B5] text-white shadow-md"
                                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* ✅ เงื่อนไขสลับหน้าระหว่าง “พนักงานทั้งหมด” กับ “จัดการสิทธิ์” */}
                    {activeTab === "all" ? (
                        <>
                            {/* 🔍 Search Bar + Filter + Add Button */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white border border-slate-200 shadow-sm rounded-xl p-4 mb-6">
                                <div className="flex gap-3 w-full sm:w-auto">
                                    <div className="relative flex-1 sm:w-64">
                                        <MagnifyingGlass
                                            size={18}
                                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                        />
                                        <input
                                            type="text"
                                            placeholder="ค้นหาพนักงาน..."
                                            className="pl-9 pr-3 py-2 border border-slate-300 rounded-lg w-full focus:ring-2 focus:ring-[#3674B5] outline-none transition"
                                        />
                                    </div>

                                    <button className="flex items-center justify-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-2 rounded-lg transition">
                                        <FunnelSimple size={18} />
                                        กรอง
                                    </button>
                                </div>

                                <button
                                    onClick={() => setShowAdd(true)}
                                    className="flex items-center gap-2 bg-[#3674B5] hover:bg-[#2f5fa0] text-white px-4 py-2 rounded-lg shadow-md transition mt-3 sm:mt-0"
                                >
                                    <Plus size={18} weight="bold" /> เพิ่มพนักงาน
                                </button>
                            </div>

                            {/* 📋 Employee Table */}
                            <div className="bg-white rounded-xl shadow-md border border-slate-200 p-5 overflow-x-auto">
                                {loading ? (
                                    <p className="text-center text-slate-500 py-6">กำลังโหลดข้อมูล...</p>
                                ) : error ? (
                                    <p className="text-center text-red-500">{error}</p>
                                ) : employees.length > 0 ? (
                                    <table className="w-full text-sm border-separate border-spacing-y-2">
                                        <thead>
                                            <tr className="bg-[#3674B5] text-white text-center">
                                                <th className="py-2 px-3 rounded-tl-lg">ชื่อพนักงาน</th>
                                                <th className="py-2 px-3">ตำแหน่ง</th>
                                                <th className="py-2 px-3">อีเมล</th>
                                                <th className="py-2 px-3 rounded-tr-lg">การจัดการ</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {employees.map((emp) => (
                                                <tr
                                                    key={emp._id}
                                                    className="hover:bg-[#E9F3FF] text-center transition-all"
                                                >
                                                    <td className="py-3 px-3 font-medium text-slate-700">
                                                        {emp.firstName} {emp.lastName}
                                                    </td>
                                                    <td className="py-3 px-3 text-slate-600">
                                                        {emp.positionId?.name || "-"}
                                                    </td>
                                                    <td className="py-3 px-3 text-slate-600">{emp.email}</td>
                                                    <td className="py-3 px-3">
                                                        <button className="text-blue-600 hover:underline mr-3">
                                                            แก้ไข
                                                        </button>
                                                        <button className="text-red-500 hover:underline">ลบ</button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <div className="text-center py-10 text-slate-500">
                                        <UserCircle
                                            size={60}
                                            className="mx-auto text-slate-400 mb-2"
                                        />
                                        <p className="text-lg font-medium mb-2">
                                            ยังไม่มีพนักงานในระบบ
                                        </p>
                                        <button onClick={() => setShowAdd(true)} className="bg-[#3674B5] hover:bg-[#2f5fa0] text-white px-4 py-2 rounded-lg shadow-md">
                                            + เพิ่มพนักงาน
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <ManagePosition />
                    )}
                </main>

                <Footer />
            </div>

            {
                showAdd && (
                    <AddEmployeeModal
                        storeId={store?._id}
                        onClose={() => setShowAdd(false)}
                        onSuccess={fetchEmployees} // reload list หลังเพิ่มเสร็จ
                    />
                )
            }

        </>
    );
}
