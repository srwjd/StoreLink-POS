/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import axios from "axios";
import { CheckSquare, TimeIcon, XSquare } from "../../public/icons/icons.jsx";
import {
    MagnifyingGlass,
    Plus,
    PencilSimple,
    Trash,
    UserCircle,
} from "phosphor-react";
import { showError, showConfirm } from "../utils/notify";
import { useStore } from "../context/StoreContext";

export default function ManagePosition() {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    const { store } = useStore();
    const storeId = store?._id;

    const [positions, setPositions] = useState([]);
    const [filteredPositions, setFilteredPositions] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [editData, setEditData] = useState(null);

    const [form, setForm] = useState({
        positionName: "",
        permissions: {
            sale: false,
            all_receipts: false,
            kitchen: false,
            product: false,
            report: false,
            manage_employees: false,
            settings: false,
        },
    });

    const fetchPositions = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get(`${API_BASE_URL}/positions/${storeId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setPositions(res.data.positions || []);
            setFilteredPositions(res.data.positions || []);
        } catch (err) {
            console.error("Error fetching positions:", err);
            setError("ไม่สามารถโหลดข้อมูลตำแหน่งได้");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (storeId) fetchPositions();
    }, [storeId]);

    useEffect(() => {
        const lower = search.toLowerCase();
        setFilteredPositions(
            positions.filter((p) =>
                p.positionName.toLowerCase().includes(lower)
            )
        );
    }, [search, positions]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleTogglePerm = (perm) => {
        setForm({
            ...form,
            permissions: { ...form.permissions, [perm]: !form.permissions[perm] },
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");

        // 🔁 แปลง object permissions → array ของ string
        const permissionArray = Object.keys(form.permissions).filter(
            (key) => form.permissions[key] === true
        );

        const payload = {
            positionName: form.positionName,
            permissions: permissionArray,
        };

        try {
            if (editData) {
                await axios.put(
                    `${API_BASE_URL}/positions/update/${editData._id}`,
                    payload,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            } else {
                await axios.post(
                    `${API_BASE_URL}/positions/create/${storeId}`,
                    payload,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            }

            setShowModal(false);
            setEditData(null);
            fetchPositions();
        } catch (err) {
            console.error("Error saving position:", err);
            showError("เกิดข้อผิดพลาดในการบันทึกตำแหน่ง");
        }
    };


    const handleDelete = async (id) => {
        const ok = await showConfirm("ต้องการลบตำแหน่งนี้ใช่หรือไม่?");
        if (!ok) return;
        const token = localStorage.getItem("token");
        try {
            await axios.delete(`${API_BASE_URL}/positions/delete/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchPositions();
        } catch (err) {
            console.error("Error deleting position:", err);
            showError("เกิดข้อผิดพลาดในการลบ");
        }
    };

    const openEdit = (pos) => {
        setEditData(pos);
        setForm({
            positionName: pos.positionName,
            permissions: {
                sale: pos.permissions.includes("sale"),
                all_receipts: pos.permissions.includes("all_receipts"),
                kitchen: pos.permissions.includes("kitchen"),
                manage_employees: pos.permissions.includes("manage_employees"),
                report: pos.permissions.includes("report"),
                settings: pos.permissions.includes("settings"),
                product: pos.permissions.includes("product"),
            },
        });

        setShowModal(true);
    };

    const openAdd = () => {
        setEditData(null);
        setForm({
            positionName: "",
            permissions: {
                sale: false,
                report: false,
                manage_employees: false,
                settings: false,
                product: false,
                all_receipts: false,
                kitchen: false,
            },
        });
        setShowModal(true);
    };

    return (
        <div className="flex flex-col">

            <main className="flex-1">
                {/* 🔍 Search + Add Button */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white/90 border border-slate-200 shadow-md rounded-xl p-4 mb-6 backdrop-blur-sm">
                    <div className="relative flex-1 sm:w-72 mb-3 sm:mb-0">
                        <MagnifyingGlass
                            size={18}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        />
                        <input
                            type="text"
                            placeholder="ค้นหาตำแหน่ง..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className=" pl-9 pr-3 py-2 border border-slate-300 rounded-lg w-1/3 focus:ring-2 focus:ring-[#3674B5] outline-none transition bg-white/80"
                        />
                    </div>

                    <button
                        onClick={openAdd}
                        className="flex items-center justify-center gap-2 bg-[#3674B5] hover:bg-[#2f5fa0] text-white px-5 py-2.5 rounded-lg shadow-md transition"
                    >
                        <Plus size={18} weight="bold" /> เพิ่มตำแหน่ง
                    </button>
                </div>

                {/* 📋 Table */}
                <div className="bg-white rounded-xl shadow-md border border-slate-200 p-5 overflow-x-auto">
                    {loading ? (
                        <p className="text-center text-slate-500 py-6 animate-pulse">
                            <TimeIcon size={20} className="inline mr-1 text-[#3674B5]" /> กำลังโหลดข้อมูล...
                        </p>
                    ) : error ? (
                        <p className="text-center text-red-500">{error}</p>
                    ) : filteredPositions.length > 0 ? (
                        <table className="w-full text-sm border-separate border-spacing-y-2">
                            <thead>
                                <tr className="bg-[#3674B5] text-white text-center">
                                    <th className="py-3 px-4 rounded-tl-lg">ชื่อตำแหน่ง</th>
                                    <th className="py-3 px-4">ขาย</th>
                                    <th className="py-3 px-4">รายงาน</th>
                                    <th className="py-3 px-4">พนักงาน</th>
                                    <th className="py-3 px-4">ตั้งค่า</th>
                                    <th className="py-3 px-4">สินค้า</th>
                                    <th className="py-3 px-4">ครัว</th>
                                    <th className="py-3 px-4">ดูใบเสร็จ</th>
                                    <th className="py-3 px-4 rounded-tr-lg">การจัดการ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredPositions.map((pos) => (
                                    <tr
                                        key={pos._id}
                                        className={`text-center  hover:bg-[#EAF1FF] transition-all duration-150`}
                                    >
                                        <td className="py-3 px-4 font-medium text-slate-700">
                                            {pos.positionName}
                                        </td>
                                        {["sale", "report", "manage_employees", "settings", "product", "all_receipts", "kitchen"].map((perm) => (
                                            <td key={perm} className="py-3 px-4 align-middle">
                                                <div className="flex items-center justify-center">
                                                    {pos.permissions?.includes(perm) ? (
                                                        <CheckSquare
                                                            size={20}
                                                            color="#3674B5"
                                                            weight="fill"
                                                            className="text-center w-full"
                                                        />
                                                    ) : (
                                                        <XSquare size={20} color="#3674B5" weight="fill" />
                                                    )}
                                                </div>
                                            </td>
                                        ))}
                                        <td className="py-3 px-4 align-middle w-1/8">
                                            <div className="flex items-center justify-center">
                                                <button
                                                    className="text-blue-600 hover:underline mr-3 flex items-center gap-1"
                                                    onClick={() => openEdit(pos)}
                                                >
                                                    <PencilSimple size={16} /> แก้ไข
                                                </button>
                                                <button
                                                    className="text-red-500 hover:underline flex items-center gap-1"
                                                    onClick={() => handleDelete(pos._id)}
                                                >
                                                    <Trash size={16} /> ลบ
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="text-center py-10 text-slate-500">
                            <UserCircle size={60} className="mx-auto text-slate-400 mb-3" />
                            <p className="text-lg font-medium mb-2">
                                ไม่พบตำแหน่งที่ตรงกับการค้นหา
                            </p>
                            <button
                                onClick={openAdd}
                                className="bg-[#3674B5] hover:bg-[#2f5fa0] text-white px-4 py-2 rounded-lg shadow-md"
                            >
                                + เพิ่มตำแหน่งใหม่
                            </button>
                        </div>
                    )}
                </div>
            </main>

            {/* 🟦 Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative">
                        <h2 className="text-xl font-semibold text-[#3674B5] mb-4 text-center">
                            {editData ? "แก้ไขตำแหน่ง" : "เพิ่มตำแหน่งใหม่"}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input
                                type="text"
                                name="positionName"
                                value={form.positionName}
                                onChange={handleChange}
                                placeholder="ชื่อตำแหน่ง เช่น แคชเชียร์"
                                className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#3674B5]"
                                required
                            />

                            <div>
                                <p className="font-medium text-slate-600 mb-2">
                                    สิทธิ์การเข้าถึง:
                                </p>
                                <div className="grid grid-cols-2 gap-2">
                                    {Object.keys(form.permissions).map((perm) => (
                                        <label
                                            key={perm}
                                            className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-lg cursor-pointer hover:bg-slate-100"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={form.permissions[perm]}
                                                onChange={() => handleTogglePerm(perm)}
                                                className="accent-[#3674B5]"
                                            />
                                            <span className="capitalize">
                                                {perm === "sale"
                                                    ? "ขาย"
                                                    : perm === "report"
                                                        ? "รายงาน"
                                                        : perm === "manage_employees"
                                                            ? "พนักงาน"
                                                            : perm === "settings"
                                                                ? "ตั้งค่า"
                                                                : perm === "product"
                                                                    ? "สินค้า"
                                                                    : perm === "all_receipts"
                                                                        ? "ใบเสร็จ"
                                                                        : perm === "kitchen"
                                                                            ? "ครัว"
                                                                            : "ไม่ระบุ"}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 mt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium"
                                >
                                    ยกเลิก
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2 rounded-lg bg-[#3674B5] hover:bg-[#2f5fa0] text-white font-semibold shadow-md"
                                >
                                    {editData ? "บันทึกการแก้ไข" : "เพิ่มตำแหน่ง"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
