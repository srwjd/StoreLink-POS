/* eslint-disable react-hooks/exhaustive-deps */

import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Storefront, Plus } from "phosphor-react";

import Header from "../components/shared/Header";
import Footer from "../components/shared/Footer";
import { useStore } from "../context/StoreContext";

export default function SelectStore() {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    const { selectStore } = useStore();
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userRole, setUserRole] = useState();
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const fetchStores = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/stores/my-stores`, {
                withCredentials: true,
            });

            setStores(response.data.stores);
            setUserRole(response.data.role);
        } catch (err) {
            console.error("Error fetching stores:", err);
            setError("ไม่สามารถโหลดข้อมูลร้านค้าได้");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStores();
    }, []);

    const handleSelect = ({ storeId, store }) => {
        selectStore(store);
        navigate(`/main-menu/${store.storeType}/${storeId}`);
    };

    return (
        <div className="min-h-screen flex flex-col bg-[#fff]">
            <Header mode="auth" />

            <main className="flex flex-col items-center justify-center flex-grow text-center px-4">
                <h1 className="text-3xl font-bold text-[#3674B5] mb-8">
                    เลือกร้านค้าของคุณ
                </h1>

                {loading ? (
                    <p className="text-slate-500">กำลังโหลดข้อมูลร้านค้า...</p>
                ) : error ? (
                    <p className="text-red-500">{error}</p>
                ) : (
                    <div className="flex flex-wrap justify-center gap-6">
                        {stores.map((store) => (
                            <button
                                key={store._id}
                                onClick={() => handleSelect({ storeId: store._id, store })}
                                className="flex flex-col items-center justify-center bg-gradient-to-b from-[#4A90E2] to-[#3674B5]
                                           text-white w-40 h-40 rounded-xl shadow-md hover:shadow-xl hover:translate-y-[-3px]
                                           transition-all duration-200 focus:outline-none"
                            >
                                <Storefront size={60} color="#fefbfb" weight="duotone" />
                                <p className="mt-2 text-md font-semibold">{store.storeName}</p>
                            </button>
                        ))}

                        {/* ปุ่มเพิ่มร้าน */}
                        {userRole === "Owner" && (
                            <button
                                onClick={() => navigate("/create-store")}
                                className="flex flex-col items-center justify-center bg-gradient-to-b from-[#4A90E2] to-[#3674B5]
                                       text-white w-40 h-40 rounded-xl shadow-md hover:shadow-xl hover:translate-y-[-3px]
                                       transition-all duration-200 focus:outline-none"
                            >
                                <Plus size={60} weight="bold" />
                            </button>
                        )}
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
