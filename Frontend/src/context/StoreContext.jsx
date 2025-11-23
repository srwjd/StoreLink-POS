/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const [store, setStore] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storeId = localStorage.getItem("currentStore");

        axios
            .get(`${API_BASE_URL}/auth/profile`, {
                headers: { withCredentials: true },
            })
            .then((res) => {
                setUser(res.data.user);

                // ✅ ถ้ามีร้านใน localStorage ให้ลองโหลด
                if (storeId) {
                    axios
                        .get(`${API_BASE_URL}/stores/${storeId}`, {
                            withCredentials: true,
                        })
                        .then((sRes) => setStore(sRes.data))
                        .catch((err) => {
                            console.warn("⚠️ โหลดร้านไม่สำเร็จ (อาจถูกลบ)", err.response?.status);
                            localStorage.removeItem("currentStore");
                            setStore(null);
                        });
                }
            })
            .catch(() => {
                setUser(null);
            })
            .finally(() => setLoading(false));
    }, []);


    // ✅ เมื่อเลือก store → บันทึกลง localStorage
    const selectStore = (storeData) => {
        setStore(storeData);
        localStorage.setItem("currentStore", storeData._id);
    };

    const logout = () => {
        setStore(null);
        setUser(null);
        localStorage.removeItem("currentStore");
    };

    return (
        <StoreContext.Provider value={{ user, store, selectStore, logout, loading }}>
            {children}
        </StoreContext.Provider>
    );
};

export const useStore = () => useContext(StoreContext);
