/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import axios from "axios";
import { useStore } from "../../context/StoreContext";
import { ImageIcon, MagnifyingGlass } from "../../../public/icons/icons";
import Header from "../../components/shared/Header";
import { SelectStaffModal } from "../../components/service/SelectStaffModal";
import { toast } from "react-hot-toast";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const token = localStorage.getItem("token");
const headers = { Authorization: `Bearer ${token}` };

export default function SalesRestaurant() {
    const { store } = useStore();

    // 🔹 State หลัก
    const [menu, setMenu] = useState([]);
    const [category, setCategory] = useState(["ทั้งหมด"]);
    const [activeCategory, setActiveCategory] = useState("ทั้งหมด");
    const [orders, setOrders] = useState([]);
    const [activeState, setActiveState] = useState("all");
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [staffList, setStaffList] = useState([]);
    const [showStaffModal, setShowStaffModal] = useState(false);
    const [selectedService, setSelectedService] = useState(null);

    const [loading, setLoading] = useState(false);

    // 🔹 ดึงเมนูบริการ
    const fetchMenu = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/products/all/${store._id}`, {
                headers,
            });
            setMenu(res.data.products);
            const uniqueCats = [...new Set(res.data.products.map((p) => p.category).filter(Boolean))];
            setCategory(["ทั้งหมด", ...uniqueCats]);
        } catch (err) {
            console.error("Error fetching menu:", err);
        }
    };

    // 🔹 ดึงพนักงาน
    const fetchStaff = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/employees/staff/${store._id}`, { headers });
            setStaffList(res.data.employees || []);
        } catch (err) {
            console.error("Error fetching staff:", err);
        }
    };

    useEffect(() => {
        fetchMenu();
        fetchOrders();
        fetchStaff();
    }, [store._id]);


    // 🔹 ดึงคิวบริการทั้งหมด
    const fetchOrders = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/service-orders/${store._id}`, {
                headers,
            });
            setOrders(res.data);
        } catch (err) {
            console.error("Error fetching orders:", err);
        }
    };

    // 🟦 โหลดข้อมูล
    useEffect(() => {
        fetchMenu();
        fetchOrders();
        fetchStaff();
    }, [store._id]);

    // 🔹 สร้างคิวใหม่หรือเพิ่มบริการในคิวที่ยังไม่จ่าย
    const handleSelectService = (item) => {
        setSelectedService(item);
        setShowStaffModal(true);
    };

    // 🔹 สร้างคิวใหม่
    const handleConfirmStaff = async (staff) => {
        try {
            setLoading(true);
            setShowStaffModal(false);

            const body = {
                storeId: store._id,
                services: [
                    { serviceId: selectedService._id, name: selectedService.name, price: selectedService.price },
                ],
                staffId: staff?._id || null,
                staffName: staff ? `${staff.firstName} ${staff.lastName || ""}` : "",
            };

            await axios.post(`${API_BASE_URL}/service-orders/create`, body, { headers });
            toast.success(`สร้างคิวใหม่ (${selectedService.name})${staff ? " โดย " + staff.firstName : ""}`);
            await fetchOrders();
        } catch (err) {
            toast.error("ไม่สามารถสร้างคิวได้");
        } finally {
            setLoading(false);
            setSelectedService(null);
        }
    };


    // 🔹 อัปเดตสถานะคิว
    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await axios.patch(`${API_BASE_URL}/service-orders/${orderId}/status`, { status: newStatus }, { headers });
            toast.success(`อัปเดตสถานะเป็น ${newStatus}`);
            await fetchOrders();
        } catch (err) {
            toast.error("อัปเดตสถานะไม่สำเร็จ");
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#EAF2FF] to-[#C6D8FF]">
            <Header />
            <main className="flex-1 p-3">
                <div className="grid grid-cols-4 gap-3 rounded-xl">
                    {/* 🟩 ด้านซ้าย: เมนูบริการ */}
                    <div className="flex flex-col gap-2 p-4 col-span-3 h-[calc(100vh-85px)] overflow-y-auto bg-white rounded-xl shadow-md">

                        {/* ค้นหา */}
                        <div className="relative h-[40px]">
                            <MagnifyingGlass size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="ค้นหาบริการ..."
                                className="w-full h-full rounded-lg border border-slate-200 px-10 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:border-slate-400"
                            />
                        </div>

                        {/* คิว */}
                        <div className="flex flex-col gap-2 h-[150px]">
                            <div className="flex gap-2 overflow-x-auto">
                                {["all", "waiting", "inProgress", "done", "paid"].map((state) => (
                                    <button
                                        key={state}
                                        onClick={() => setActiveState(state)}
                                        className={`px-3 py-1 rounded-full text-sm font-medium transition ${activeState === state
                                            ? "bg-[#3674B5] text-white shadow-md"
                                            : "border border-[#3674B5] text-slate-600 hover:bg-slate-200"
                                            }`}
                                    >
                                        {state}
                                    </button>
                                ))}
                            </div>

                            {/* รายการคิว */}
                            {orders.length === 0 ? (
                                <p className="bg-slate-200 p-2 rounded-md h-[90px] flex items-center justify-center text-slate-400">ยังไม่มีคิว</p>
                            ) : (
                                <div className="flex gap-2 overflow-x-auto">
                                    {orders
                                        .filter((o) => activeState === "all" || o.status === activeState)
                                        .map((o) => (
                                            <button
                                                key={o._id}
                                                onClick={() => setSelectedOrder(o)}
                                                className={`h-[90px] w-[150px] rounded-lg px-2 text-slate-700 text-center font-semibold
                        ${o.status === "waiting"
                                                        ? "bg-[#FFD571]/50 border-[1.5px] border-[#FFD571]"
                                                        : o.status === "inProgress"
                                                            ? "bg-[#80C4F1]/50 border-[1.5px] border-[#80C4F1]"
                                                            : o.status === "done"
                                                                ? "bg-[#61D167]/50 border-[1.5px] border-[#61D167]"
                                                                : "bg-[#D9D9D9]/50 border-[1.5px] border-[#D9D9D9]"
                                                    }`}
                                            >
                                                คิว {o.queueNumber}
                                                <p className="text-xs mt-1 text-slate-600">{o.services.length} รายการ</p>
                                            </button>
                                        ))}
                                </div>
                            )}
                        </div>

                        {/* รายการบริการ */}
                        <div className="flex flex-col gap-2 h-[calc(100vh-250px)] overflow-y-auto">
                            <div className="flex gap-2 overflow-x-auto">
                                {category.map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => setActiveCategory(cat)}
                                        className={`px-3 py-1 rounded-full text-sm font-medium transition ${activeCategory === cat
                                            ? "bg-[#3674B5] text-white shadow-md"
                                            : "border border-[#3674B5] text-slate-600 hover:bg-slate-200"
                                            }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>

                            <div className="flex flex-wrap gap-3 max-h-[48vh] overflow-y-auto">
                                {menu.length === 0 ? (
                                    <p className="text-center text-slate-400 w-full mt-6">ไม่พบเมนู</p>
                                ) : (
                                    menu
                                        .filter((m) => activeCategory === "ทั้งหมด" || m.category === activeCategory)
                                        .map((item) => (
                                            <button
                                                key={item._id}
                                                onClick={() => handleSelectService(item)}
                                                disabled={loading}
                                                className={`flex items-center gap-2 min-w-[180px] border-[1.5px] border-[#C4D9FA] rounded-2xl p-2 text-[#3674B5] 
                          hover:border-[#3674B5] hover:text-[#3674B5] shadow-sm hover:shadow-md transition-all duration-300 ${loading ? "opacity-60 cursor-not-allowed" : ""
                                                    }`}
                                            >
                                                {item.productImage ? (
                                                    <img
                                                        src={item.productImage}
                                                        alt={item.name}
                                                        className="w-20 h-20 object-cover rounded-xl border border-[#C7D8F5] shadow-sm"
                                                    />
                                                ) : (
                                                    <div className="w-20 h-20 flex items-center justify-center rounded-xl border border-[#C7D8F5] shadow-sm">
                                                        <ImageIcon size={30} />
                                                    </div>
                                                )}
                                                <div className="text-center">
                                                    <p className="font-semibold text-slate-700">{item.name}</p>
                                                    <p className="text-sm text-[#3674B5] mt-1">{item.price} บาท</p>
                                                </div>
                                            </button>
                                        ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* 🟨 ด้านขวา: ใบงาน */}
                    <div className="flex flex-col gap-3 p-4 col-span-1 h-[calc(100vh-85px)] bg-white rounded-xl shadow-md">
                        {selectedOrder ? (
                            <>
                                <h3 className="text-lg font-semibold text-[#3674B5]">
                                    ใบงานคิว #{selectedOrder.queueNumber}
                                </h3>
                                <ul className="flex-1 overflow-y-auto text-sm">
                                    {selectedOrder.services.map((s, i) => (
                                        <li key={i} className="flex justify-between py-1 border-b text-slate-700">
                                            <span>{s.name}</span>
                                            <span>{s.price.toLocaleString("th-TH")}฿</span>
                                        </li>
                                    ))}
                                </ul>
                                <div className="text-right text-slate-800 font-semibold">
                                    รวมทั้งหมด: {selectedOrder.total.toLocaleString("th-TH")}฿
                                </div>

                                <div className="flex gap-2 mt-4">
                                    {selectedOrder.status === "waiting" && (
                                        <button
                                            onClick={() => handleStatusChange(selectedOrder._id, "inProgress")}
                                            className="flex-1 bg-[#3674B5] hover:bg-[#285c92] text-white py-2 rounded-lg"
                                        >
                                            ▶️ เริ่มบริการ
                                        </button>
                                    )}
                                    {selectedOrder.status === "inProgress" && (
                                        <button
                                            onClick={() => handleStatusChange(selectedOrder._id, "done")}
                                            className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg"
                                        >
                                            ✅ เสร็จสิ้น
                                        </button>
                                    )}
                                    {selectedOrder.status === "done" && (
                                        <button
                                            onClick={() => handleStatusChange(selectedOrder._id, "paid")}
                                            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg"
                                        >
                                            💵 ชำระเงิน
                                        </button>
                                    )}
                                </div>
                            </>
                        ) : (
                            <p className="text-center text-slate-400 mt-20">เลือกคิวจากด้านซ้ายเพื่อดูรายละเอียด</p>
                        )}
                    </div>
                </div>
            </main>
            <SelectStaffModal
                isOpen={showStaffModal}
                onClose={() => setShowStaffModal(false)}
                staffList={staffList}
                onConfirm={handleConfirmStaff}
            />

        </div>
    );
}
