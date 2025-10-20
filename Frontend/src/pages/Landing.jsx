/* eslint-disable react/prop-types */
import { useState } from "react";

import Header from "../components/shared/Header";
import Footer from "../components/shared/Footer";
import Register from "../components/Register";
import Login from "../components/Login";

import {
    Users, Money, Package, ChartLine
} from "phosphor-react"

const IconBag = () => (<Money size={32} weight="fill" color="#3674B5" />);
const IconBox = () => (<Package size={32} weight="fill" color="#3674B5" />);
const IconUsers = () => (<Users size={32} weight="fill" color="#3674B5" />);
const IconChart = () => (<ChartLine size={32} weight="fill" color="#3674B5" />);

export default function Landing() {

    const [showRegister, setShowRegister] = useState(false);
    const [showLogin, setShowLogin] = useState(false);

    return (
        <div className="relative flex flex-col min-h-screen bg-white">
            <div>
                <Header mode="landing" onSignup={() => setShowRegister(true)} onLogin={() => setShowLogin(true)} />
                <div className="h-[60vh] bg-[#DFEEFF]"></div>

                <section className="absolute bottom-[50vh] left-1/2 -translate-x-1/2 mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 text-center">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-800">
                        ระบบขายหน้าร้าน (POS) ใช้งานง่าย ครบในที่เดียว
                    </h1>
                    <p className="mt-3 text-slate-600">
                        จัดการสินค้า ออเดอร์ รายงาน และพนักงานในระบบเดียว
                    </p>
                    <button
                        className="mt-6 inline-flex h-10 items-center rounded-lg bg-[#3674B5] px-6 text-white font-medium shadow-md hover:opacity-95 transition"
                        onClick={() => setShowRegister(true)}
                    >
                        ทดลองใช้งานฟรี
                    </button>
                </section>
            </div>

            <section className="absolute top-[55vh] left-1/2 -translate-x-1/2 w-full max-w-6xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <FeatureCard
                        icon={<IconBag />}
                        title="ขายได้ทันที"
                        desc="POS รองรับสแกนบาร์โค้ด / คำนวณ VAT / ส่วนลด"
                    />
                    <FeatureCard
                        icon={<IconBox />}
                        title="จัดการสินค้า"
                        desc="เพิ่ม/แก้ไขสินค้า อัปเดตสต๊อกแบบเรียลไทม์"
                    />
                    <FeatureCard
                        icon={<IconUsers />}
                        title="จัดการพนักงาน"
                        desc="กำหนดบทบาท Owner / Employee และสิทธิ์การเข้าถึง"
                    />
                    <FeatureCard
                        icon={<IconChart />}
                        title="รายงานอัตโนมัติ"
                        desc="ดูยอดขายรายวัน/เดือน และสินค้าขายดี"
                    />
                </div>
            </section>

            <Footer />

            {showRegister && <Register onClose={() => setShowRegister(false)} onLogin={() => { setShowLogin(true), setShowRegister(false) }} />}
            {showLogin && <Login onClose={() => setShowLogin(false)} onRegister={() => { setShowRegister(true), setShowLogin(false) }} />}
        </div>
    );
}

// === Component ย่อย ===
function FeatureCard({ icon, title, desc }) {
    return (
        <div className="flex flex-col rounded-2xl justify-center bg-white px-6 shadow-md ring-1 ring-slate-200 h-[200px]">
            <div className="mb-3 flex justify-center">{icon}</div>
            <div className="font-semibold text-slate-800 text-center">{title}</div>
            <div className="text-sm text-slate-600 mt-2 text-center">{desc}</div>
        </div>
    );
}
