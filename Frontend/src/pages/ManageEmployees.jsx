/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
    MagnifyingGlass,
    FunnelSimple,
    Plus,
    UserCircle,
    Users,
    CaretDown,
} from "phosphor-react";
import Header from "../components/shared/Header";
import Footer from "../components/shared/Footer";
import ManagePosition from "./ManagePosition";
import AddEmployeeModal from "../components/employees/AddEmployeeModal";
import { useStore } from "../context/StoreContext";

export default function ManageEmployees() {
    const navigate = useNavigate();
    const [showAdd, setShowAdd] = useState(false);
    const [activeTab, setActiveTab] = useState("all");
    const [employees, setEmployees] = useState([]);
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [search, setSearch] = useState("");
    const [positions, setPositions] = useState([]); // ✅ เพิ่มตำแหน่ง
    const [filterPosition, setFilterPosition] = useState("all");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [editData, setEditData] = useState(null);
    const { store } = useStore();
    const storeId = store?._id;

    const fetchEmployees = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return setError("กรุณาเข้าสู่ระบบก่อนเข้าหน้านี้");
            if (!storeId) return;

            const [empRes, posRes] = await Promise.all([
                axios.get(`http://localhost:3000/employees/${storeId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                }),
                axios.get(`http://localhost:3000/positions/${storeId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                }),
            ]);

            setEmployees(empRes.data.employees || []);
            setFilteredEmployees(empRes.data.employees || []);
            setPositions(posRes.data.positions || []);
        } catch (err) {
            console.error("Error fetching employees:", err);
            setError("ไม่สามารถโหลดข้อมูลพนักงานได้");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (store?._id) {
            fetchEmployees();
        }
    }, [store]);

    // 🔍 Search + Filter Position รวมกัน
    useEffect(() => {
        const lower = search.toLowerCase();
        const filtered = employees.filter((e) => {
            const matchSearch =
                e.firstName?.toLowerCase().includes(lower) ||
                e.lastName?.toLowerCase().includes(lower) ||
                e.email?.toLowerCase().includes(lower);

            const matchPosition =
                filterPosition === "all" ||
                e.positionId?.positionName === filterPosition;

            return matchSearch && matchPosition;
        });

        setFilteredEmployees(filtered);
    }, [search, filterPosition, employees]);

    const handleEdit = (employee) => {
        setEditData(employee);
        setShowAdd(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("ต้องการลบพนักงานคนนี้ใช่หรือไม่?")) return;
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`http://localhost:3000/employees/delete/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchEmployees();
        } catch (err) {
            console.error("Error deleting employee:", err);
            alert("เกิดข้อผิดพลาดในการลบพนักงาน");
        }
    };

    return (
        <>
            <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#E9F3FF] to-[#C8DCFF]">
                <Header storeName={store?.storeName} logoClick={() => navigate(`/main-menu/${store.storeType}/${storeId}`)}/>

                <main className="flex-1 px-6 sm:px-10 py-6">
                    {/* 🔹 Tabs */}
                    <div className="flex flex-wrap gap-3 mb-6">
                        {[
                            { key: "all", label: "พนักงานทั้งหมด", icon: <Users size={18} /> },
                            { key: "permission", label: "จัดการสิทธิ์", icon: <FunnelSimple size={18} /> },
                        ].map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all duration-200 shadow-sm ${activeTab === tab.key
                                    ? "bg-[#3674B5] text-white shadow-md"
                                    : "bg-white/90 text-slate-600 hover:bg-slate-100 border border-slate-200"
                                    }`}
                            >
                                {tab.icon} {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* ✅ Content */}
                    {activeTab === "all" ? (
                        <>
                            {/* 🔍 Search Bar + Filter + Add */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white/90 border border-slate-200 shadow-md rounded-xl p-4 mb-6 backdrop-blur-sm">
                                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto items-center">
                                    {/* Search */}
                                    <div className="relative flex-1 sm:w-72">
                                        <MagnifyingGlass
                                            size={18}
                                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                        />
                                        <input
                                            type="text"
                                            placeholder="ค้นหาพนักงาน..."
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            className="pl-9 pr-3 py-2 border border-slate-300 rounded-lg w-full focus:ring-2 focus:ring-[#3674B5] outline-none transition bg-white/80"
                                        />
                                    </div>

                                    {/* Filter by Position */}
                                    <div className="relative">
                                        <select
                                            value={filterPosition}
                                            onChange={(e) => setFilterPosition(e.target.value)}
                                            className="pl-3 pr-8 py-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-[#3674B5] outline-none transition appearance-none"
                                        >
                                            <option value="all">ตำแหน่งทั้งหมด</option>
                                            {positions.map((pos) => (
                                                <option key={pos._id} value={pos.positionName}>
                                                    {pos.positionName}
                                                </option>
                                            ))}
                                        </select>
                                        <CaretDown
                                            size={16}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                                        />
                                    </div>
                                </div>

                                <button
                                    onClick={() => {
                                        setEditData(null);
                                        setShowAdd(true);
                                    }}
                                    className="flex items-center justify-center gap-2 bg-[#3674B5] hover:bg-[#2f5fa0] text-white px-5 py-2.5 rounded-lg shadow-md transition mt-3 sm:mt-0"
                                >
                                    <Plus size={18} weight="bold" /> เพิ่มพนักงาน
                                </button>
                            </div>

                            {/* 📋 Employee Table */}
                            <div className="bg-white/90 rounded-xl shadow-lg border border-slate-200 p-5 overflow-x-auto backdrop-blur-sm">
                                {loading ? (
                                    <p className="text-center text-slate-500 py-6 animate-pulse">
                                        ⏳ กำลังโหลดข้อมูล...
                                    </p>
                                ) : error ? (
                                    <p className="text-center text-red-500">{error}</p>
                                ) : filteredEmployees.length > 0 ? (
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
                                            {filteredEmployees.map((emp) => (
                                                <tr
                                                    key={emp._id}
                                                    className="hover:bg-[#E9F3FF] text-center transition-all"
                                                >
                                                    <td className="py-3 px-3 font-medium text-slate-700">
                                                        {emp.firstName} {emp.lastName}
                                                    </td>
                                                    <td className="py-3 px-3 text-slate-600">
                                                        {emp.positionId?.positionName || "-"}
                                                    </td>
                                                    <td className="py-3 px-3 text-slate-600">{emp.email}</td>
                                                    <td className="py-3 px-3">
                                                        <button
                                                            className="text-blue-600 hover:text-blue-800 font-medium mr-3"
                                                            onClick={() => handleEdit(emp)}
                                                        >
                                                            แก้ไข
                                                        </button>
                                                        <button
                                                            className="text-red-500 hover:text-red-700 font-medium"
                                                            onClick={() => handleDelete(emp._id)}
                                                        >
                                                            ลบ
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <div className="text-center py-10 text-slate-500">
                                        <UserCircle size={60} className="mx-auto text-slate-400 mb-3" />
                                        <p className="text-lg font-medium mb-2">
                                            ไม่พบพนักงานที่ตรงกับการค้นหา
                                        </p>
                                        <button
                                            onClick={() => {
                                                setEditData(null);
                                                setShowAdd(true);
                                            }}
                                            className="bg-[#3674B5] hover:bg-[#2f5fa0] text-white px-4 py-2 rounded-lg shadow-md"
                                        >
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

            {showAdd && (
                <AddEmployeeModal
                    storeId={store?._id}
                    onClose={() => {
                        setShowAdd(false);
                        setEditData(null);
                    }}
                    onSuccess={fetchEmployees}
                    editData={editData}
                />
            )}
        </>
    );
}
