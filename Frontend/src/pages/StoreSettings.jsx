
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { showConfirm, showSuccess, showError } from "../utils/notify";
import Header from "../components/shared/Header";
import { BsGearFill } from "react-icons/bs";
import { Money, Phone, Storefront, Upload, X, Image as ImageIcon, Lock } from "phosphor-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function StoreSettings() {
  const { storeId } = useParams();
  const navigate = useNavigate();

  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [logo, setLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [passwordModal, setPasswordModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [onConfirmPassword, setOnConfirmPassword] = useState(null);

  const [form, setForm] = useState({
    storeName: "",
    address: "",
    phone: "",
    cash: true,
    qrPromptPay: false,
    promptPayNumber: "",
    storeImage: "",
  });

  useEffect(() => {
    if (!storeId) return;
    const fetchStore = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/stores/${storeId}`, {
          withCredentials: true,
        });
        const data = res.data;
        setStore(data);
        setForm({
          storeName: data.storeName,
          address: data.address || "",
          phone: data.phone || "",
          cash: data.paymentSettings.cash,
          qrPromptPay: data.paymentSettings.qrPromptPay,
          promptPayNumber: data.paymentSettings.promptPayNumber,
          storeImage: data.storeImage,
        });
        setLogoPreview(data.storeImage);
      } catch {
        showError("โหลดข้อมูลร้านล้มเหลว");
      } finally {
        setLoading(false);
      }
    };
    fetchStore();
  }, [storeId]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#EAF2FF] to-[#C6D8FF]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-[#3674B5]"></div>
      </div>
    );

  const askPassword = async () => {
    return new Promise((resolve) => {
      setPasswordInput("");
      setPasswordModal(true);
      setOnConfirmPassword(() => (pwd) => resolve(pwd));
    });
  };


  const handleLogoUpload = async (file) => {
    if (!file) return;

    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      showError("กรุณาอัปโหลดไฟล์รูปภาพ JPG, PNG หรือ WEBP เท่านั้น");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      showError("ขนาดไฟล์ต้องไม่เกิน 10MB");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await axios.post(`${API_BASE_URL}/upload`, formData, {
        withCredentials: true,
      });

      setLogo(file);
      setLogoPreview(res.data.url);
      showSuccess("อัปโหลดโลโก้สำเร็จ");
    } catch (err) {
      console.error("Upload error:", err);
      showError("เกิดข้อผิดพลาดในการอัปโหลดโลโก้");
    } finally {
      setUploading(false);
    }
  };

  // 🧹 ลบโลโก้
  const removeLogo = () => {
    setLogo(null);
    setLogoPreview(null);
  };

  const handleSaveAll = async () => {
    const password = await askPassword();
    if (!password) return;
    setSaving(true);
    try {
      await axios.put(
        `${API_BASE_URL}/stores/update/${storeId}`,
        { ...form, password },
        { withCredentials: true }
      );

      showSuccess("บันทึกการแก้ไขสำเร็จ");
    } catch (err) {
      showError(err.response?.data?.message || "เกิดข้อผิดพลาด");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteStore = async () => {
    const ok = await showConfirm("คุณแน่ใจหรือไม่ว่าจะลบร้านนี้?");
    if (!ok) return;
    const password = await askPassword();
    if (!password) return;

    try {
      await axios.delete(`${API_BASE_URL}/settings/${storeId}`, {
        data: { password },
        withCredentials: true,
      });
      showSuccess("ลบร้านเรียบร้อยแล้ว");
      navigate("/select-store");
    } catch (err) {
      showError(err.response?.data?.message || "เกิดข้อผิดพลาด");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#EAF2FF] to-[#C6D8FF]">
      <Header />
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-[#C7D8F5] p-10 relative overflow-y-auto max-h-[calc(100vh-130px)]">
          {/* Heading */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-[#3674B5] flex items-center gap-5">
              <BsGearFill size={32} />ตั้งค่าร้านค้า
            </h2>
            {store && (
              <span className="text-sm text-slate-500 italic">
                Store ID: {storeId}
              </span>
            )}
          </div>

          {/* Section: Store Name */}
          <section className="mb-5 border-b border-slate-200 pb-6">
            <label className="flex gap-3 font-semibold text-slate-700 text-lg">
              <Storefront size={24} />ชื่อร้าน
            </label>
            <input
              type="text"
              className="mt-3 border border-slate-300 p-3 w-full rounded-xl focus:ring-2 focus:ring-[#3674B5] outline-none transition"
              value={form.storeName}
              onChange={(e) =>
                setForm({ ...form, storeName: e.target.value })
              }
            />
          </section>

          {/* Section: Contact */}
          <section className="mb-5 border-b border-slate-200 pb-6">
            <h3 className="flex gap-3 font-semibold text-slate-700 text-lg mb-3">
              <Phone size={24} />ข้อมูลติดต่อ
            </h3>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="ที่อยู่ร้าน"
                className="border border-slate-300 p-3 w-full rounded-xl focus:ring-2 focus:ring-[#3674B5] outline-none transition"
                value={form.address}
                onChange={(e) =>
                  setForm({ ...form, address: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="เบอร์โทรร้าน"
                className="border border-slate-300 p-3 w-full rounded-xl focus:ring-2 focus:ring-[#3674B5] outline-none transition"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>
          </section>

          {/* Section: Payment */}
          <section className="mb-5 border-b border-slate-200 pb-6">
            <h3 className="font-semibold text-slate-700 text-lg mb-3">
              <Money size={24} /> การตั้งค่าชำระเงิน
            </h3>
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-slate-700">
                <input
                  type="checkbox"
                  checked={form.cash}
                  onChange={(e) =>
                    setForm({ ...form, cash: e.target.checked })
                  }
                />
                เงินสด
              </label>
              <label className="flex items-center gap-2 text-slate-700">
                <input
                  type="checkbox"
                  checked={form.qrPromptPay}
                  onChange={(e) =>
                    setForm({ ...form, qrPromptPay: e.target.checked })
                  }
                />
                QR พร้อมเพย์
              </label>

              {form.qrPromptPay && (
                <input
                  type="text"
                  placeholder="หมายเลขพร้อมเพย์"
                  className="border border-slate-300 p-3 w-full rounded-xl focus:ring-2 focus:ring-[#3674B5] outline-none transition"
                  value={form.promptPayNumber}
                  onChange={(e) =>
                    setForm({ ...form, promptPayNumber: e.target.value })
                  }
                />
              )}
            </div>
          </section>

          {/* Section: Logo */}
          <section className="mb-8">
            <h3 className="font-semibold text-slate-700 text-lg mb-3">โลโก้ร้าน</h3>
            {logoPreview ? (
              <div className="border-2 border-dashed border-[#C7D8F5] rounded-xl p-4 bg-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <ImageIcon className="text-[#3674B5]" size={24} />
                    <div>
                      <p className="text-sm font-medium text-slate-700">ไฟล์โลโก้ที่อัปโหลดแล้ว</p>
                      <p className="text-xs text-slate-500 truncate max-w-xs">
                        {logo?.name || "โลโก้ร้านปัจจุบัน"}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={removeLogo}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full p-2 transition"
                  >
                    <X size={20} />
                  </button>
                </div>
                <div className="mt-3">
                  <img
                    src={logoPreview}
                    alt="โลโก้ร้าน"
                    className="max-h-40 w-full object-contain rounded border border-slate-200"
                  />
                </div>
              </div>
            ) : (
              <div className="border-2 border-dashed border-[#C7D8F5] rounded-xl p-8 text-center bg-white hover:border-[#3674B5] transition">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleLogoUpload(e.target.files[0])}
                  className="hidden"
                  id="storeLogoUpload"
                />
                <label
                  htmlFor="storeLogoUpload"
                  className="cursor-pointer flex flex-col items-center gap-3"
                >
                  <div className="bg-blue-100 rounded-full p-4">
                    <Upload className="text-[#3674B5]" size={32} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-700">
                      {uploading ? "กำลังอัปโหลด..." : "คลิกเพื่ออัปโหลดโลโก้ร้าน"}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">รองรับ JPG, PNG, WEBP (สูงสุด 10MB)</p>
                  </div>
                </label>
              </div>
            )}
          </section>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4 border-t border-slate-200">
            <button
              onClick={handleSaveAll}
              disabled={saving}
              className={`flex-1 py-3 rounded-xl font-semibold text-white transition-all shadow-md ${saving
                ? "bg-slate-400 cursor-not-allowed"
                : "bg-[#3674B5] hover:bg-[#2f5fa0]"
                }`}
            >
              {saving ? "กำลังบันทึก..." : "บันทึกการแก้ไข"}
            </button>

            <button
              onClick={handleDeleteStore}
              className="flex-1 py-3 rounded-xl font-semibold bg-red-500 hover:bg-red-600 text-white transition-all shadow-md"
            >
              ลบร้าน
            </button>
          </div>
        </div>
      </main>
      {passwordModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-[90%] max-w-md border border-slate-200">
            <h3 className="text-xl font-semibold text-[#3674B5] mb-3 text-center">
              <div className="flex items-center justify-center gap-2">
                <Lock /> ยืนยันรหัสผ่าน
              </div>
            </h3>
            <p className="text-sm text-slate-600 text-center mb-5">
              กรุณากรอกรหัสผ่านของคุณเพื่อยืนยันการบันทึก
            </p>
            <input
              type="password"
              placeholder="กรอกรหัสผ่าน"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-5 outline-none focus:ring-2 focus:ring-[#3674B5]"
            />

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setPasswordModal(false);
                  onConfirmPassword(null);
                }}
                className="flex-1 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold transition"
              >
                ยกเลิก
              </button>
              <button
                onClick={() => {
                  if (!passwordInput.trim()) return;
                  setPasswordModal(false);
                  onConfirmPassword(passwordInput);
                }}
                className="flex-1 py-2 rounded-lg bg-[#3674B5] hover:bg-[#2f5fa0] text-white font-semibold transition"
              >
                ยืนยัน
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
