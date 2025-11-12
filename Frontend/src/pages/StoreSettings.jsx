import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function StoreSettings() {
  const { storeId } = useParams();
  const navigate = useNavigate();
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false); // สำหรับ loading ปุ่มบันทึก
  const [form, setForm] = useState({
    storeName: "",
    address: "",
    phone: "",
    cash: true,
    qrPromptPay: false,
    promptPayNumber: "",
  });
  const [logo, setLogo] = useState(null);
  const token = localStorage.getItem("token");

  // โหลดข้อมูลร้าน
  useEffect(() => {
    if (!storeId) return;
    const fetchStore = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/stores/${storeId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStore(res.data);
        setForm({
          storeName: res.data.storeName,
          address: res.data.address || "",
          phone: res.data.phone || "",
          cash: res.data.paymentSettings.cash,
          qrPromptPay: res.data.paymentSettings.qrPromptPay,
          promptPayNumber: res.data.paymentSettings.promptPayNumber,
        });
      } catch {
        toast.error("โหลดข้อมูลร้านล้มเหลว");
      } finally {
        setLoading(false);
      }
    };
    fetchStore();
  }, [storeId]);

  if (loading) return <p className="text-center p-6">กำลังโหลด...</p>;

  const askPassword = async () => {
    const password = prompt("กรุณากรอกรหัสผ่านเพื่อยืนยันการบันทึก:");
    if (!password) {
      toast.error("กรุณากรอกรหัสผ่าน");
      return null;
    }
    return password;
  };

  // บันทึกการแก้ไขทั้งหมด
  const handleSaveAll = async () => {
    const password = await askPassword();
    if (!password) return;

    setSaving(true);
    try {
      // 1️⃣ อัปเดตชื่อร้าน
      await axios.put(
        `${API_BASE_URL}/settings/${storeId}/name`,
        { storeName: form.storeName, password },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // 2️⃣ อัปเดตการตั้งค่าชำระเงิน
      await axios.put(
        `${API_BASE_URL}/settings/${storeId}/payment`,
        {
          cash: form.cash,
          qrPromptPay: form.qrPromptPay,
          promptPayNumber: form.promptPayNumber,
          password,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // 3️⃣ อัปเดตข้อมูลติดต่อ
      await axios.put(
        `${API_BASE_URL}/settings/${storeId}/contact`,
        { address: form.address, phone: form.phone, password },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // 4️⃣ อัปโหลดโลโก้ถ้ามี
      if (logo) {
        const formData = new FormData();
        formData.append("logo", logo);
        formData.append("password", password);

        await axios.put(`${API_BASE_URL}/settings/${storeId}/logo`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
      }

      toast.success("บันทึกการแก้ไขสำเร็จ");
    } catch (err) {
      toast.error(err.response?.data?.message || "เกิดข้อผิดพลาด");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteStore = async () => {
    if (!window.confirm("คุณแน่ใจหรือไม่ว่าจะลบร้านนี้?")) return;
    const password = await askPassword();
    if (!password) return;

    try {
      await axios.delete(`${API_BASE_URL}/settings/${storeId}`, {
        data: { password },
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("ลบร้านเรียบร้อยแล้ว");
      navigate("/select-store");
    } catch (err) {
      toast.error(err.response?.data?.message || "เกิดข้อผิดพลาด");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white rounded-3xl shadow-xl border border-gray-200">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">🛠 ตั้งค่าร้านค้า</h2>

      {/* ชื่อร้าน */}
      <div className="mb-6">
        <label className="font-medium text-gray-700">ชื่อร้าน</label>
        <input
          type="text"
          className="border border-gray-300 p-3 w-full rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={form.storeName}
          onChange={(e) => setForm({ ...form, storeName: e.target.value })}
        />
      </div>

      {/* ข้อมูลติดต่อ */}
      <div className="mb-6">
        <h3 className="font-medium mb-2 text-gray-700">📇 ข้อมูลติดต่อ</h3>
        <input
          type="text"
          placeholder="ที่อยู่ร้าน"
          className="border border-gray-300 p-2 w-full rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
        />
        <input
          type="text"
          placeholder="เบอร์โทรร้าน"
          className="border border-gray-300 p-2 w-full rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
      </div>

      {/* การชำระเงิน */}
      <div className="mb-6">
        <h3 className="font-medium mb-2 text-gray-700">💰 การตั้งค่าชำระเงิน</h3>
        <div className="space-y-2">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.cash}
              onChange={(e) => setForm({ ...form, cash: e.target.checked })}
            />
            เงินสด
          </label>
          <label className="flex items-center gap-2">
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
              className="border border-gray-300 p-2 w-full rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={form.promptPayNumber}
              onChange={(e) =>
                setForm({ ...form, promptPayNumber: e.target.value })
              }
            />
          )}
        </div>
      </div>

      {/* โลโก้ร้าน */}
      <div className="mb-6">
        <h3 className="font-medium mb-2 text-gray-700">🖼 โลโก้ร้าน</h3>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setLogo(e.target.files[0])}
          className="border border-gray-300 p-2 rounded-lg"
        />
      </div>

      {/* ปุ่มบันทึกทั้งหมด และลบร้าน */}
      <div className="flex gap-3 items-center">
        <button
          onClick={handleSaveAll}
          disabled={saving}
          className={`bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition flex items-center justify-center ${
            saving ? "opacity-60 cursor-not-allowed" : ""
          }`}
        >
          {saving ? "กำลังบันทึก..." : "💾 บันทึกการแก้ไข"}
        </button>

        <button
          onClick={handleDeleteStore}
          className="bg-red-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-700 transition"
        >
          ❌ ลบร้าน
        </button>
      </div>
    </div>
  );
}
