/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Avatar from "@mui/material/Avatar";
import {
    AddIcon,
    MagnifyingGlass,
    FunnelSimple,
    UserCircle,
    Users,
    CaretDown,
    MailIcon,
    PhoneIcon,
    TimeIcon,
} from "../../public/icons/icons";
import Header from "../components/shared/Header";
import Footer from "../components/shared/Footer";
import ManagePosition from "./ManagePosition";
import AddEmployeeModal from "../components/employees/AddEmployeeModal";
import EmployeeDetailModal from "../components/employees/EmployeeDetailModal";
import DropdownKebab from "../components/employees/dropdownKebab";
import { useStore } from "../context/StoreContext";

export default function ManageEmployees() {
    const navigate = useNavigate();
    const [showAdd, setShowAdd] = useState(false);
    const [activeTab, setActiveTab] = useState("all");
    const [employees, setEmployees] = useState([]);
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [search, setSearch] = useState("");
    const [positions, setPositions] = useState([]);
    const [filterPosition, setFilterPosition] = useState("all");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [editData, setEditData] = useState(null);
    const { store } = useStore();
    const storeId = store?._id;
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [showDetail, setShowDetail] = useState(false);

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
            setPositions(posRes.data.positions || []);
            setFilteredEmployees(empRes.data.employees || []);
        } catch (err) {
            console.error("Error fetching employees:", err);
            setError("ไม่สามารถโหลดข้อมูลพนักงานได้");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (store?._id) fetchEmployees();
    }, [store]);

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
                <Header
                    storeName={store?.storeName}
                    logoClick={() =>
                        navigate(`/main-menu/${store.storeType}/${storeId}`)
                    }
                />

                <main className="flex-1 px-6 pb-0 sm:px-10 py-6">
                    {/* 🔹 Tabs */}
                    <div className="flex flex-wrap gap-3 mb-4">
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
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white/90 border border-slate-200 shadow-md rounded-xl p-4 mb-4  backdrop-blur-sm">
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
                                    <AddIcon size={16} className="inline mr-1" /> เพิ่มพนักงาน
                                </button>
                            </div>

                            {/* 📋 Employee Card List */}
                            <div className="bg-white/90 rounded-xl shadow-lg border border-slate-200 p-3 backdrop-blur-sm">
                                {loading ? (
                                    <p className="text-center text-slate-500 py-6 animate-pulse">
                                        <TimeIcon size={20} className="inline mr-1 text-[#3674B5]" /> กำลังโหลดข้อมูล...
                                    </p>
                                ) : error ? (
                                    <p className="text-center text-red-500">{error}</p>
                                ) : filteredEmployees.length > 0 ? (
                                    <div className="h-[calc(100vh-335px)] overflow-y-auto p-2 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-5">
                                        {filteredEmployees.map((emp) => (
                                            <Card
                                                key={emp._id}
                                                sx={{
                                                    boxShadow: "0 4px 7px rgba(0, 0, 0, 0.15)",
                                                    borderRadius: "12px",
                                                    height: 'max-content',
                                                }}
                                            >
                                                <CardContent>
                                                    {/* Header */}
                                                    <div className="flex items-start justify-between mb-3">
                                                        <div className="flex items-center gap-3">
                                                            <Avatar
                                                                alt={emp.firstName}
                                                                src={emp.profileImage || "/default-avatar.png"}
                                                                sx={{ width: 40, height: 40, backgroundColor: "#3674B5" }}
                                                            />
                                                            <div>
                                                                <h3 className="font-semibold text-slate-800">
                                                                    {emp.firstName} {emp.lastName}
                                                                </h3>
                                                                <p className="text-sm text-slate-500">
                                                                    {emp.positionId?.positionName || "-"}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <DropdownKebab
                                                            emp={emp}
                                                            onEdit={handleEdit}
                                                            onDelete={handleDelete}
                                                        />
                                                    </div>

                                                    {/* Info */}
                                                    <div className="text-sm border-t border-slate-100 pt-3 space-y-1">
                                                        <div className="flex justify-between">
                                                            <span className="text-slate-500">Position</span>
                                                            <span className="font-medium text-slate-700">
                                                                {emp.positionId?.positionName || "-"}
                                                            </span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-slate-500">Hired Date</span>
                                                            <span className="font-medium text-slate-700">
                                                                {emp.createdAt
                                                                    ? new Date(emp.createdAt).toLocaleDateString()
                                                                    : "-"}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Contact */}
                                                    <div className="text-xs text-slate-600 border-t border-slate-100 pt-2 mt-2">
                                                        <p className="truncate">
                                                            <MailIcon size={16} className="inline mr-1 text-slate-500" /> {emp.email || "-"}
                                                        </p>
                                                        <p><PhoneIcon size={16} className="inline mr-1 text-slate-500" /> {emp.phone || "-"}</p>
                                                    </div>

                                                    {/* more */}
                                                    <div className="text-xs text-slate-600 border-t border-slate-100 pt-2 mt-2">
                                                        <button
                                                            onClick={() => {
                                                                setSelectedEmployee(emp);
                                                                setShowDetail(true);
                                                            }}
                                                            className="text-[#3674B5] hover:text-[#2f5fa0] font-medium"
                                                        >
                                                            เพิ่มเติม
                                                        </button>
                                                    </div>

                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-10 text-slate-500">
                                        <UserCircle
                                            size={60}
                                            className="mx-auto text-slate-400 mb-3"
                                        />
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

            {showDetail && (
                <EmployeeDetailModal
                    open={showDetail}
                    onClose={() => setShowDetail(false)}
                    employee={selectedEmployee}
                />
            )}

        </>
    );
}
