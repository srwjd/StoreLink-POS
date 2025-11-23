/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { XCircle, Eye, EyeSlash, User, Envelope, Phone, MapPin, Calendar, CreditCard, FileText, Briefcase, Lock, Upload, X, Image as ImageIcon } from "phosphor-react";
import { showError } from "../../utils/notify";

export default function AddEmployeeModal({ storeId, onClose, onSuccess, editData }) {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    const [positions, setPositions] = useState([]);
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [idCardImage, setIdCardImage] = useState(null);
    const [idCardImagePreview, setIdCardImagePreview] = useState(null);
    const fileInputRef = useRef(null);

    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        gender: "",
        birthDate: "",
        idCard: "",
        phone: "",
        email: "",
        address: "",
        emergencyContact: "",
        note: "",
        username: "",
        password: "",
        positionId: "",
        role: "Employee",
        status: "active",
        salary: "",
        idCardImage: "",
    });

    // 🧩 โหลดตำแหน่งจาก API
    const fetchPositions = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/positions/${storeId}`, {
                withCredentials: true
            });
            setPositions(res.data.positions || []);
        } catch (err) {
            console.error("Error fetching positions:", err);
        }
    };

    useEffect(() => {
        fetchPositions();
    }, []);

    // 🧠 โหลดข้อมูลเก่ามาแก้ไข
    useEffect(() => {
        if (editData) {
            setForm({
                firstName: editData.firstName || "",
                lastName: editData.lastName || "",
                gender: editData.gender || "",
                birthDate: editData.birthDate ? editData.birthDate.split('T')[0] : "",
                idCard: editData.idCard || "",
                phone: editData.phone || "",
                email: editData.email || "",
                address: editData.address || "",
                emergencyContact: editData.emergencyContact || "",
                note: editData.note || "",
                username: editData.username || "",
                password: "",
                positionId: editData.positionId?._id || "",
                role: editData.role || "Employee",
                status: editData.status || "active",
                salary: editData.salary || "",
                idCardImage: editData.idCardImage || "",
            });
            if (editData.idCardImage) {
                setIdCardImagePreview(editData.idCardImage);
            }
        }
    }, [editData]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // อัปโหลดไฟล์
    const handleFileUpload = async (file) => {
        if (!file) return;

        // ตรวจสอบประเภทไฟล์
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf'];
        if (!validTypes.includes(file.type)) {
            showError("กรุณาอัปโหลดไฟล์รูปภาพ (JPG, PNG) เท่านั้น");
            return;
        }

        // ตรวจสอบขนาดไฟล์ (10MB)
        if (file.size > 10 * 1024 * 1024) {
            showError("ขนาดไฟล์ต้องไม่เกิน 10MB");
            return;
        }

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);

            const res = await axios.post(`${API_BASE_URL}/upload`, formData, {
                withCredentials: true
            });

            setIdCardImage(file);
            setIdCardImagePreview(res.data.url);
            setForm({ ...form, idCardImage: res.data.url });
        } catch (err) {
            console.error("Upload error:", err);
            const errorMessage = err.response?.data?.message || err.message || "เกิดข้อผิดพลาดในการอัปโหลดไฟล์";
            showError(`❌ ${errorMessage}`);
        } finally {
            setUploading(false);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            handleFileUpload(file);
        }
    };

    const removeImage = () => {
        setIdCardImage(null);
        setIdCardImagePreview(null);
        setForm({ ...form, idCardImage: "" });
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // ตรวจสอบว่าต้องมี email หรือ username อย่างน้อยหนึ่งอย่าง
        if (!form.email && !form.username) {
            showError("กรุณากรอกอีเมลหรือชื่อผู้ใช้อย่างน้อยหนึ่งอย่าง");
            return;
        }

        setLoading(true);

        try {

            // เตรียมข้อมูลที่จะส่ง (ลบฟิลด์ว่างออก)
            const submitData = {};
            Object.keys(form).forEach(key => {
                if (form[key] !== "" && form[key] !== null && form[key] !== undefined) {
                    submitData[key] = form[key];
                }
            });

            if (editData) {
                // 🧩 ถ้ามี password ใหม่ → อัปเดตด้วย
                if (!submitData.password) delete submitData.password;

                await axios.put(
                    `${API_BASE_URL}/employees/update/${editData._id}`, {
                    submitData,
                    withCredentials: true
                });
            } else {
                await axios.post(
                    `${API_BASE_URL}/employees/create/${storeId}`,
                    submitData,
                    { withCredentials: true }
                );

            }

            onSuccess?.(); // โหลดข้อมูลใหม่จาก parent
            onClose();
        } catch (err) {
            console.error("Error saving employee:", err);
            showError(err.response?.data?.message || "เกิดข้อผิดพลาดในการบันทึกข้อมูล");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 animate-[fadeIn_0.3s_ease-out_forwards] p-4">
            <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl relative border border-slate-200 animate-[slideUp_0.25s_ease-out_forwards] max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="sticky top-0  text-[#3674B5] p-6 pb-0 rounded-t-2xl">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold">
                            {editData ? "แก้ไขข้อมูลพนักงาน" : "เพิ่มพนักงานใหม่"}
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-[#3674B5]/80 hover:text-[#3674B5] hover:bg-[#3674B5]/20 rounded-full p-1 transition"
                        >
                            <XCircle size={28} />
                        </button>
                    </div>
                </div>

                {/* Form Content */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* ข้อมูลพื้นฐาน */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100">
                        <div className="flex items-center gap-2 mb-4">
                            <User className="text-[#3674B5]" size={22} />
                            <h3 className="text-lg font-semibold text-slate-700">ข้อมูลพื้นฐาน</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-slate-600 mb-1.5">ชื่อ *</label>
                                <input
                                    name="firstName"
                                    value={form.firstName}
                                    onChange={handleChange}
                                    required
                                    className="w-full border border-slate-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#3674B5] focus:border-[#3674B5] shadow-sm text-sm bg-white"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-600 mb-1.5">นามสกุล *</label>
                                <input
                                    name="lastName"
                                    value={form.lastName}
                                    onChange={handleChange}
                                    required
                                    className="w-full border border-slate-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#3674B5] focus:border-[#3674B5] shadow-sm text-sm bg-white"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-600 mb-1.5">เพศ</label>
                                <select
                                    name="gender"
                                    value={form.gender}
                                    onChange={handleChange}
                                    className="w-full border border-slate-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#000000] focus:border-[#000000] shadow-sm text-sm bg-white"
                                >
                                    <option value="">เลือกเพศ (ไม่บังคับ)</option>
                                    <option value="Male">ชาย</option>
                                    <option value="Female">หญิง</option>
                                    <option value="Other">อื่นๆ</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-600 mb-1.5">วันเกิด</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        name="birthDate"
                                        type="date"
                                        value={form.birthDate}
                                        onChange={handleChange}
                                        className="w-full border border-slate-300 rounded-lg pl-10 pr-4 py-2.5 outline-none focus:ring-2 focus:ring-[#3674B5] focus:border-[#3674B5] shadow-sm text-sm bg-white"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-600 mb-1.5">รหัสบัตรประชาชน</label>
                                <div className="relative">
                                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        name="idCard"
                                        value={form.idCard}
                                        onChange={handleChange}
                                        placeholder="13 หลัก"
                                        className="w-full border border-slate-300 rounded-lg pl-10 pr-4 py-2.5 outline-none focus:ring-2 focus:ring-[#3674B5] focus:border-[#3674B5] shadow-sm text-sm bg-white"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-600 mb-1.5">เบอร์โทรศัพท์</label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        name="phone"
                                        type="tel"
                                        value={form.phone}
                                        onChange={handleChange}
                                        placeholder="08X-XXX-XXXX"
                                        className="w-full border border-slate-300 rounded-lg pl-10 pr-4 py-2.5 outline-none focus:ring-2 focus:ring-[#3674B5] focus:border-[#3674B5] shadow-sm text-sm bg-white"
                                    />
                                </div>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-xs font-medium text-slate-600 mb-1.5">ที่อยู่</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-3 text-slate-400" size={18} />
                                    <textarea
                                        name="address"
                                        value={form.address}
                                        onChange={handleChange}
                                        rows={2}
                                        placeholder="ที่อยู่ (ไม่บังคับ)"
                                        className="w-full border border-slate-300 rounded-lg pl-10 pr-4 py-2.5 outline-none focus:ring-2 focus:ring-[#3674B5] focus:border-[#3674B5] shadow-sm text-sm bg-white resize-none"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* สำเนาบัตรประชาชน */}
                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-5 border border-amber-100">
                        <div className="flex items-center gap-2 mb-4">
                            <FileText className="text-amber-600" size={22} />
                            <h3 className="text-lg font-semibold text-slate-700">สำเนาบัตรประชาชน</h3>
                        </div>
                        {idCardImagePreview ? (
                            <div className="relative">
                                <div className="border-2 border-dashed border-amber-300 rounded-lg p-4 bg-white">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <ImageIcon className="text-amber-600" size={24} />
                                            <div>
                                                <p className="text-sm font-medium text-slate-700">ไฟล์ที่อัปโหลดแล้ว</p>
                                                <p className="text-xs text-slate-500 truncate max-w-xs">{idCardImage?.name || "สำเนาบัตรประชาชน"}</p>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={removeImage}
                                            className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full p-2 transition"
                                        >
                                            <X size={20} />
                                        </button>
                                    </div>
                                    <div className="mt-3">
                                        <img
                                            src={idCardImagePreview}
                                            alt="สำเนาบัตรประชาชน"
                                            className="max-h-48 w-full object-contain rounded border border-slate-200"
                                        />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="border-2 border-dashed border-amber-300 rounded-lg p-8 text-center bg-white hover:border-amber-400 transition">
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*,.pdf"
                                    onChange={handleFileChange}
                                    className="hidden"
                                    id="idCardUpload"
                                />
                                <label
                                    htmlFor="idCardUpload"
                                    className="cursor-pointer flex flex-col items-center gap-3"
                                >
                                    <div className="bg-amber-100 rounded-full p-4">
                                        <Upload className="text-amber-600" size={32} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-700">
                                            {uploading ? "กำลังอัปโหลด..." : "คลิกเพื่ออัปโหลดสำเนาบัตรประชาชน"}
                                        </p>
                                        <p className="text-xs text-slate-500 mt-1">รองรับไฟล์ JPG, PNG (สูงสุด 10MB)</p>
                                    </div>
                                </label>
                            </div>
                        )}
                    </div>

                    {/* ข้อมูลการติดต่อ */}
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border border-green-100">
                        <div className="flex items-center gap-2 mb-4">
                            <Envelope className="text-green-600" size={22} />
                            <h3 className="text-lg font-semibold text-slate-700">ข้อมูลการติดต่อ</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-slate-600 mb-1.5">อีเมล</label>
                                <div className="relative">
                                    <Envelope className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        name="email"
                                        type="email"
                                        value={form.email || ""}
                                        onChange={handleChange}
                                        placeholder="example@email.com"
                                        className="w-full border border-slate-300 rounded-lg pl-10 pr-4 py-2.5 outline-none focus:ring-2 focus:ring-[#3674B5] focus:border-[#3674B5] shadow-sm text-sm bg-white"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-600 mb-1.5">ชื่อผู้ใช้</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        name="username"
                                        value={form.username}
                                        onChange={handleChange}
                                        placeholder="username"
                                        className="w-full border border-slate-300 rounded-lg pl-10 pr-4 py-2.5 outline-none focus:ring-2 focus:ring-[#3674B5] focus:border-[#3674B5] shadow-sm text-sm bg-white"
                                    />
                                </div>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-xs font-medium text-slate-600 mb-1.5">ผู้ติดต่อกรณีฉุกเฉิน</label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        name="emergencyContact"
                                        value={form.emergencyContact}
                                        onChange={handleChange}
                                        placeholder="ชื่อ + เบอร์โทรศัพท์"
                                        className="w-full border border-slate-300 rounded-lg pl-10 pr-4 py-2.5 outline-none focus:ring-2 focus:ring-[#3674B5] focus:border-[#3674B5] shadow-sm text-sm bg-white"
                                    />
                                </div>
                            </div>
                        </div>
                        <label className="block text-xs font-medium text-slate-600 mt-2">*ต้องมีอีเมลหรือชื่อผู้ใช้</label>
                    </div>

                    {/* ข้อมูลการเข้าสู่ระบบ */}
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-5 border border-purple-100">
                        <div className="flex items-center gap-2 mb-4">
                            <Lock className="text-purple-600" size={22} />
                            <h3 className="text-lg font-semibold text-slate-700">ข้อมูลการเข้าสู่ระบบ</h3>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1.5">
                                {editData ? "รหัสผ่านใหม่ (ไม่บังคับ)" : "รหัสผ่าน *"}
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    name="password"
                                    type={showPass ? "text" : "password"}
                                    value={form.password}
                                    onChange={handleChange}
                                    required={!editData}
                                    placeholder="••••••••"
                                    className="w-full border border-slate-300 rounded-lg pl-10 pr-12 py-2.5 outline-none focus:ring-2 focus:ring-[#3674B5] focus:border-[#3674B5] shadow-sm text-sm bg-white"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPass(!showPass)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#3674B5] transition"
                                >
                                    {showPass ? <EyeSlash size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* ข้อมูลการทำงาน */}
                    <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-5 border border-indigo-100">
                        <div className="flex items-center gap-2 mb-4">
                            <Briefcase className="text-indigo-600" size={22} />
                            <h3 className="text-lg font-semibold text-slate-700">ข้อมูลการทำงาน</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-slate-600 mb-1.5">ตำแหน่ง *</label>
                                <select
                                    name="positionId"
                                    value={form.positionId}
                                    onChange={handleChange}
                                    required
                                    className="w-full border border-slate-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#3674B5] focus:border-[#3674B5] shadow-sm text-sm bg-white"
                                >
                                    <option value="">เลือกตำแหน่ง</option>
                                    {positions.map((pos) => (
                                        <option key={pos._id} value={pos._id}>
                                            {pos.positionName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-600 mb-1.5">เงินเดือน</label>
                                <input
                                    name="salary"
                                    type="number"
                                    value={form.salary}
                                    onChange={handleChange}
                                    placeholder="0.00"
                                    className="w-full border border-slate-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#3674B5] focus:border-[#3674B5] shadow-sm text-sm bg-white"
                                />
                            </div>
                        </div>
                    </div>

                    {/* หมายเหตุ */}
                    <div className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-xl p-5 border border-slate-100">
                        <div className="flex items-center gap-2 mb-4">
                            <FileText className="text-slate-600" size={22} />
                            <h3 className="text-lg font-semibold text-slate-700">หมายเหตุ</h3>
                        </div>
                        <textarea
                            name="note"
                            value={form.note}
                            onChange={handleChange}
                            rows={3}
                            placeholder="หมายเหตุพิเศษ เช่น กะทำงาน, ทักษะพิเศษ..."
                            className="w-full border border-slate-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#3674B5] focus:border-[#3674B5] shadow-sm text-sm bg-white resize-none"
                        />
                    </div>

                    {/* ปุ่มบันทึก */}
                    <div className="flex gap-3 pt-2  bottom-0 bg-white">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 border-2 border-slate-300 text-slate-600 hover:bg-slate-50 rounded-lg py-3 font-semibold transition-all"
                        >
                            ยกเลิก
                        </button>
                        <button
                            type="submit"
                            disabled={loading || uploading}
                            className="flex-1 bg-gradient-to-r from-[#3674B5] to-[#2f5fa0] hover:from-[#2f5fa0] hover:to-[#2563a0] text-white rounded-lg py-3 font-semibold shadow-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {loading ? "กำลังบันทึก..." : uploading ? "กำลังอัปโหลด..." : editData ? "บันทึกการแก้ไข" : "เพิ่มพนักงาน"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
