/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState,  } from "react";
import { useNavigate } from "react-router-dom";
import { Check, Money } from "phosphor-react";

import Header from "../components/shared/Header";
import Footer from "../components/shared/Footer";


export default function CreateStore() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [form, setForm] = useState({
        name: "",
        type: "",
        address: "",
        phone: "",
        taxRate: 0,
        paymentSettings: {
            cash: true,
            qrPromptPay: false,
            promptPayNumber: "",
        },
    });

    const handleChange = (key, value) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const handlePaymentChange = (key, value) => {
        setForm((prev) => ({
            ...prev,
            paymentSettings: { ...prev.paymentSettings, [key]: value },
        }));
    };

    <style>
        {
            ` @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-5px); }
            to { opacity: 1; transform: translateY(0); }
            }`
        }
    </style>


    const [error, setError] = useState(""); // ✅ เก็บข้อความเตือน
    const prev = () => setStep((s) => Math.max(s - 1, 1));
    const next = () => {
        if (!validateStep(step)) return;
        setStep((s) => Math.min(s + 1, 4));
    };

    const validateStep = (currentStep) => {
        setError(""); // เคลียร์ก่อนทุกครั้ง

        if (currentStep === 1) {
            if (!form.name || !form.type) {
                setError("กรุณากรอกชื่อร้านและเลือกประเภทร้าน");
                return false;
            }
        }
        if (currentStep === 3) {
            const pay = form.paymentSettings;
            if (!pay.cash && !pay.qrPromptPay) {
                setError("กรุณาเลือกช่องทางการชำระเงินอย่างน้อย 1 ช่องทาง");
                return false;
            }
            if (pay.qrPromptPay && pay.promptPayNumber.trim() === "") {
                setError("กรุณากรอกหมายเลขพร้อมเพย์");
                return false;
            }
        }

        return true;
    };


    const handleSubmit = async () => {
        const token = localStorage.getItem("token");
        try {
            const res = await fetch("http://localhost:3000/stores/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            if (res.ok) {
                alert("สร้างร้านค้าสำเร็จ!");
                console.log("✅ Store created:", data.store);
                navigate("/select-store");
            } else {
                alert(data.message || "ไม่สามารถสร้างร้านได้");
            }
        } catch (err) {
            alert("เชื่อมต่อเซิร์ฟเวอร์ไม่สำเร็จ");
        }
    };

    return (
        <div className="relative flex flex-col min-h-screen bg-[#DFEEFF]">
            <Header mode="none" />
            <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center z-50">
                <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-2xl border border-[#3674B5]/30">
                    {/* Step Indicator */}
                    <div className="flex items-center justify-center mb-2 w-full">
                        {[1, 2, 3, 4].map((n) => (
                            <div key={n} className="flex items-center">
                                <div
                                    className={`rounded-full h-8 w-8 flex items-center justify-center text-sm font-semibold transition-all duration-300
                                        ${step === n
                                            ? "bg-[#3674B5] text-white"
                                            : step > n
                                                ? "bg-[#3674B5] text-white"
                                                : "bg-gray-300 text-gray-700"
                                        }`}
                                >
                                    {step > n ? <Check size={16} /> : n}
                                </div>
                                {n < 4 && (
                                    <div
                                        className={`w-12 h-[2px] transition-all duration-300 ${step > n ? "bg-[#3674B5]" : "bg-gray-300"
                                            }`}
                                    ></div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Step Content */}
                    <div className="text-center min-h-[200px]">
                        {step === 1 && <Step1 form={form} onChange={handleChange} />}
                        {step === 2 && <Step2 form={form} onChange={handleChange} />}
                        {step === 3 && <Step3 form={form} onPaymentChange={handlePaymentChange} />}
                        {step === 4 && <Step4 form={form} />}
                    </div>

                    {/* Buttons */}
                    <div className="mt-3 flex flex-col items-center">
                        {error && (
                            <div className="mb-2 text-[#E50046] text-sm text-center animate-[fadeIn_0.3s_ease-in-out]">
                                {error}
                            </div>
                        )}

                        <div className="flex justify-between w-full">
                            {step > 1 ? (
                                <button
                                    onClick={prev}
                                    className="bg-gray-300 text-slate-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                                >
                                    กลับ
                                </button>
                            ) : (
                                <div />
                            )}
                            {step < 4 ? (
                                <button
                                    onClick={next}
                                    className="bg-[#3674B5] text-white px-5 py-2 rounded-lg hover:bg-[#2f5fa0]"
                                >
                                    ถัดไป
                                </button>
                            ) : (
                                <button
                                    onClick={handleSubmit}
                                    className="bg-[#3674B5] text-white px-5 py-2 rounded-lg hover:bg-[#2f5fa0]"
                                >
                                    เสร็จสิ้น
                                </button>
                            )}
                        </div>
                    </div>

                </div>
            </div>
            <Footer />
        </div>
    );
}

function Step1({ form, onChange }) {
    const storeTypes = [
        { id: "retail", name: "ร้านขายปลีก", image: "/supermarket.png" },
        { id: "restaurant", name: "ร้านอาหาร", image: "/restaurant.png" },
        { id: "service", name: "ร้านให้บริการ", image: "/barbershop.png" },
    ];

    return (
        <div>
            <p className="text-[#3674B5] font-semibold text-md">ตั้งชื่อและเลือกประเภทร้านของคุณ</p>
            <input
                placeholder="ชื่อร้านค้า"
                value={form.name}
                onChange={(e) => onChange("name", e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 mt-4 outline-none focus:ring-2 focus:ring-[#3674B5]"
            />

            <div className="grid grid-cols-3 gap-3 mt-4">
                {storeTypes.map((type) => (
                    <div
                        key={type.id}
                        onClick={() => onChange("type", type.id)}
                        className={`cursor-pointer rounded-xl border-2 p-3 flex flex-col items-center transition
                            ${form.type === type.id ? "border-[#3674B5] bg-[#DFEEFF]" : "border-gray-200 hover:border-[#3674B5]/50"}`}
                    >
                        <img src={type.image} alt={type.name} className="w-full rounded-lg" />
                        <p className={`${form.type === type.id ? "text-[#3674B5]" : "text-gray-700"} mt-2`}>
                            {type.name}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}

function Step2({ form, onChange }) {
    const handleTaxChange = (e) => {
        const value = e.target.value.trim();
        onChange("taxRate", value === "" ? 0 : Number(value));
    };

    return (
        <div>
            <p className="text-[#3674B5] font-semibold text-md mb-4">ข้อมูลร้านค้า</p>
            <div className="space-y-3">
                <input
                    placeholder="ที่อยู่ร้าน"
                    value={form.address}
                    onChange={(e) => onChange("address", e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-[#3674B5]"
                />
                <input
                    placeholder="เบอร์โทร"
                    value={form.phone}
                    onChange={(e) => onChange("phone", e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-[#3674B5]"
                />
                <input
                    placeholder="อัตราภาษี (%)"
                    value={form.taxRate || ""}
                    onChange={handleTaxChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-[#3674B5]"
                    min="0"
                />
            </div>
        </div>
    );
}

function Step3({ form, onPaymentChange }) {
    const pay = form.paymentSettings;

    const toggle = (key) => onPaymentChange(key, !pay[key]);

    return (
        <div>
            <p className="text-[#3674B5] font-semibold text-md">เลือกรูปแบบการชำระเงินที่ร้านของคุณรองรับ</p>
            <p className="text-slate-600 mb-5 text-sm">(เลือกได้มากกว่าหนึ่ง)</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-4">
                {/* เงินสด */}
                <div
                    onClick={() => toggle("cash")}
                    className={`cursor-pointer flex flex-col items-center justify-center border-2 rounded-xl py-6 transition-all duration-300 shadow-sm hover:shadow-md
                        ${pay.cash ? "border-[#3674B5] bg-[#DFEEFF]" : "border-gray-200 hover:border-[#3674B5]/40"}`}
                >
                    <Money size={40} color={pay.cash ? "#3674B5" : "#64748b"} />
                    <p className={`font-medium ${pay.cash ? "text-[#3674B5]" : "text-gray-700"}`}>
                        เงินสด (Cash)
                    </p>
                </div>

                {/* พร้อมเพย์ */}
                <div
                    onClick={() => toggle("qrPromptPay")}
                    className={`cursor-pointer flex flex-col items-center justify-center border-2 rounded-xl py-6 transition-all duration-300 shadow-sm hover:shadow-md
                        ${pay.qrPromptPay ? "border-[#3674B5] bg-[#DFEEFF]" : "border-gray-200 hover:border-[#3674B5]/40"}`}
                >
                    <img src="../../public/prompt-pay-logo.svg" alt="" className="h-9" />
                    <p className={`font-medium ${pay.qrPromptPay ? "text-[#3674B5]" : "text-gray-700"}`}>
                        พร้อมเพย์ (PromptPay)
                    </p>
                </div>
            </div>

            {/* Input หมายเลขพร้อมเพย์ */}
            <div
                className={`transition-all duration-500 ease-in-out ${pay.qrPromptPay ? "max-h-24 mt-3 mb-3" : "max-h-0 mt-0"
                    }`}
            >
                {pay.qrPromptPay && (
                    <div className="text-left px-4">
                        <label className="block text-sm text-slate-700 mb-2">
                            หมายเลขพร้อมเพย์
                        </label>
                        <input
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            placeholder="กรอกหมายเลขพร้อมเพย์"
                            value={pay.promptPayNumber}
                            onChange={(e) => {
                                const value = e.target.value;
                                // ✅ รับเฉพาะตัวเลขเท่านั้น
                                if (/^\d*$/.test(value)) {
                                    onPaymentChange("promptPayNumber", value);
                                }
                            }}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-[#3674B5]"
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

import { MapPin, Phone, Storefront, Receipt } from "phosphor-react";

function Step4({ form }) {
    const { name, type, address, phone, taxRate, paymentSettings } = form;

    const nameType = () => {
        if (type === "retail") return "ร้านขายปลีก";
        if (type === "restaurant") return "ร้านอาหาร";
        if (type === "service") return "ร้านให้บริการ";
    };

    return (
        <div className="text-left space-y-5">
            <h2 className="text-xl font-bold text-[#3674B5] text-center">ตรวจสอบข้อมูลร้านค้า</h2>

            <div className="space-x-5 flex flex-row w-[100%]">
                {/* 🏪 ข้อมูลร้าน */}
                <div className="bg-[#fff]/40 border border-[#3674B5]/20 rounded-xl p-5 shadow-sm w-[50%]">
                    <h3 className="font-semibold text-[#3674B5] mb-3">ข้อมูลทั่วไป</h3>
                    <div className="space-y-2 text-slate-700 text-sm">
                        <div className="flex items-center gap-2">
                            <Storefront size={18} color="#3674B5" />
                            <span><strong>ชื่อร้าน :</strong> {name || "-"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Receipt size={18} color="#3674B5" />
                            <span><strong>ประเภท :</strong> {nameType() || "-"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <MapPin size={18} color="#3674B5" />
                            <span><strong>ที่อยู่ :</strong> {address || "-"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Phone size={18} color="#3674B5" />
                            <span><strong>เบอร์โทร :</strong> {phone || "-"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Receipt size={18} color="#3674B5" />
                            <span><strong>อัตราภาษี :</strong> {taxRate ?? 0}%</span>
                        </div>
                    </div>
                </div>

                {/* 💳 ช่องทางชำระเงิน */}
                <div className="bg-white border border-[#3674B5]/20 rounded-xl p-5 shadow-sm w-[50%]">
                    <h3 className="font-semibold text-[#3674B5] mb-3">ช่องทางการชำระเงิน</h3>
                    <ul className="space-y-2 text-sm text-slate-700">
                        {paymentSettings.cash && (
                            <li className="flex items-center gap-2">
                                <div className="flex items-center gap-2 bg-[#3674B5] rounded-lg p-1"><Money className="w-5 h-5" color="#fff" /></div>
                                เงินสด
                            </li>
                        )}
                        {paymentSettings.qrPromptPay && (
                            <li className="flex items-center gap-2">
                                <div className="flex items-center gap-2 bg-[#3674B5] rounded-lg p-1"><img src="/pp.svg" alt="" className="w-5 h-5" /></div>

                                พร้อมเพย์ (
                                {paymentSettings.promptPayNumber || "ไม่ระบุ"})
                            </li>
                        )}
                        {!paymentSettings.cash && !paymentSettings.qrPromptPay && (
                            <li className="text-slate-500">ยังไม่ได้เลือกช่องทางชำระเงิน</li>
                        )}
                    </ul>
                </div>

            </div>
            <p className="text-center text-xs text-slate-500 mt-2">
                โปรดตรวจสอบข้อมูลให้ถูกต้องก่อนกด “เสร็จสิ้น”
            </p>
        </div>
    );
}

