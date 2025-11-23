/* eslint-disable react/prop-types */
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ExitIcon } from "../../../public/icons/icons";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function Header({ logoSrc = "", storeName = "", onSignup, onLogin, mode = "back", logoClick }) {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await axios.post(
                `${API_BASE_URL}/auth/logout`,
                {},
                { withCredentials: true }
            );
            localStorage.removeItem("currentStore");
            navigate("/");   // กลับหน้าแรก
        } catch (err) {
            console.error("Logout failed", err);
        }
    };

    return (
        <header className="sticky top-0 z-50 bg-[#3674B5] backdrop-blur">
            <div className="mx-auto max-w-full px-4 sm:px-6">
                <div className="flex h-14 items-center justify-between">
                    {/* โลโก้ด้านซ้าย */}
                    <div
                        onClick={logoClick}
                        className="flex items-center gap-2 group cursor-pointer"
                    >
                        {logoSrc ? (
                            <img
                                src={logoSrc}
                                alt="StoreLink POS"
                                className="h-8 w-8 rounded-lg object-cover ring-1 ring-slate-200"
                            />
                        ) : (
                            <div className="h-8 w-8 rounded-lg bg-white grid place-items-center text-[#3674B5] text-md font-bold">
                                S
                            </div>
                        )}
                        {storeName ? (
                            <span className="text-white font-semibold tracking-wide">
                                {storeName}
                            </span>
                        ) : (
                            <span className="text-white font-semibold tracking-wide">
                                StoreLink POS
                            </span>
                        )}
                    </div>

                    {/* ปุ่มด้านขวา */}
                    <div className="flex items-center gap-2">
                        {mode === "landing" && (
                            <>
                                <button
                                    onClick={onSignup}
                                    className="hidden sm:inline-flex h-9 items-center rounded-3xl border border-white px-3 text-sm font-medium text-white shadow-md hover:translate-y-[-1px] hover:bg-white hover:text-[#3674B5] transition"
                                >
                                    สมัครสมาชิก
                                </button>
                                <button
                                    onClick={onLogin}
                                    className="inline-flex gap-2 h-9 items-center rounded-3xl bg-white px-3 text-sm font-medium text-[#3674B5] shadow-md hover:translate-y-[-1px] hover:bg-slate-100 active:bg-slate-200 transition"
                                >
                                    เข้าสู่ระบบ
                                </button>
                            </>
                        )}

                        {mode === "auth" && (
                            <button
                                onClick={handleLogout}
                                className="inline-flex gap-2 h-9 items-center rounded-3xl bg-white px-3 text-sm font-medium text-[#3674B5] shadow-md hover:translate-y-[-1px] hover:bg-slate-100 active:bg-slate-200 transition"
                            >
                                <ExitIcon size={18} className="text-[#3674B5]" />
                                ออกจากระบบ
                            </button>
                        )}

                        {mode === "back" && (
                            <button
                                onClick={() => navigate(-1)}
                                className="inline-flex gap-2 h-9 items-center rounded-3xl bg-white px-3 text-sm font-medium text-[#3674B5] shadow-md hover:translate-y-[-1px] hover:bg-slate-100 active:bg-slate-200 transition"
                            >
                                <ArrowLeft size={18} className="text-[#3674B5]" />
                                ย้อนกลับ
                            </button>
                        )}

                        {/* mode === "none" → ไม่มีปุ่มเลย */}
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;
