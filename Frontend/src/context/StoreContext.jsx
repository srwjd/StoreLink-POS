/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
// src/context/StoreContext.jsx
import { createContext, useContext, useState } from "react";

// ① สร้าง context ว่าง ๆ
const StoreContext = createContext();

// ② สร้าง Provider (หุ้มส่วนของแอปที่อยากให้เข้าถึงได้)
export const StoreProvider = ({ children }) => {
    const [store, setStore] = useState(null); // ข้อมูลร้านที่เลือกไว้

    return (
        <StoreContext.Provider value={{ store, setStore }}>
            {children}
        </StoreContext.Provider>
    );
};

// ③ สร้าง hook สำหรับเรียกใช้ได้สะดวก
export const useStore = () => useContext(StoreContext);
