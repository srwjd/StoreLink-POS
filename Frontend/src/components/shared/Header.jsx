/* eslint-disable react/prop-types */
import { useNavigate } from "react-router-dom";

function Header({ logoSrc = "", StoreName = "", onSignup, onLogin, mode = "auth" }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/"); // กลับไปหน้าแรก
    };

    return (
        <header className="sticky top-0 z-50 bg-[#3674B5] backdrop-blur">
            <div className="mx-auto max-w-full px-4 sm:px-6">
                <div className="flex h-14 items-center justify-between">
                    {/* โลโก้ด้านซ้าย */}
                    <div
                        className="flex items-center gap-2 group cursor-pointer"
                        onClick={() => navigate("/")}
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
                        {StoreName ? (
                            <span className="text-white font-semibold tracking-wide">
                                {StoreName}
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
                                    className="hidden sm:inline-flex h-9 items-center rounded-lg border border-white px-3 text-sm font-medium text-white hover:bg-white hover:text-[#3674B5] transition"
                                >
                                    สมัครสมาชิก
                                </button>
                                <button
                                    onClick={onLogin}
                                    className="inline-flex h-9 items-center rounded-lg bg-white px-3 text-sm font-medium text-[#3674B5] hover:bg-slate-100 active:bg-slate-200 transition"
                                >
                                    เข้าสู่ระบบ
                                </button>
                            </>
                        )}

                        {mode === "auth" && (
                            <button
                                onClick={handleLogout}
                                className="inline-flex h-9 items-center rounded-lg bg-white px-3 text-sm font-medium text-[#3674B5] hover:bg-slate-100 active:bg-slate-200 transition"
                            >
                                ออกจากระบบ
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
