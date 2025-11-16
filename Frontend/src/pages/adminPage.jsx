/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import axios from "axios";
import { showConfirm, showSuccess, showError } from "../utils/notify";
import { Trash2, Store, UserCog, Loader2 } from "lucide-react";
import Header from "../components/shared/Header";
import { Pencil } from "phosphor-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function AdminPage() {
  const [tab, setTab] = useState("stores");
  const [stores, setStores] = useState([]);
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingOwner, setEditingOwner] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [saving, setSaving] = useState(false);

  const token = localStorage.getItem("token");

  const fetchStores = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/admin/stores`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStores(res.data);
    } catch {
      showError("ไม่สามารถโหลดข้อมูลร้านค้าได้");
    }
  };

  const fetchOwners = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/admin/owners`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOwners(res.data);
    } catch {
      showError("ไม่สามารถโหลดข้อมูลเจ้าของร้านได้");
    }
  };

  useEffect(() => {
    (async () => {
      if (tab === "stores") await fetchStores();
      else await fetchOwners();
      setLoading(false);
    })();
  }, [tab]);

  const handleDeleteStore = async (id) => {
    const ok = await showConfirm("คุณแน่ใจหรือไม่ว่าต้องการลบร้านค้านี้?");
    if (!ok) return;

    try {
      await axios.delete(`${API_BASE_URL}/admin/stores/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      showSuccess("ลบร้านค้าเรียบร้อยแล้ว");
      setStores(stores.filter((store) => store._id !== id));
    } catch {
      showError("ไม่สามารถลบร้านค้าได้");
    }
  };

  // ✅ เปิด modal แก้ไข Owner
  const handleEditOwner = (owner) => {
    setEditingOwner(owner);
    setNewPassword("");
  };

  // ✅ ยืนยันการเปลี่ยนรหัสผ่าน
  const handleSavePassword = async () => {
    if (!newPassword.trim()) {
      showError("กรุณากรอกรหัสผ่านใหม่");
      return;
    }

    setSaving(true);
    try {
      await axios.put(
        `${API_BASE_URL}/admin/owners/${editingOwner._id}`,
        { password: newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      showSuccess("เปลี่ยนรหัสผ่านสำเร็จ");
      setEditingOwner(null);
      setNewPassword("");
    } catch (err) {
      console.error(err);
      showError("ไม่สามารถเปลี่ยนรหัสผ่านได้");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteOwner = async (id) => {
    const ok = await showConfirm("คุณแน่ใจหรือไม่ว่าต้องการลบเจ้าของร้านนี้?");
    if (!ok) return;

    try {
      await axios.delete(`${API_BASE_URL}/admin/owners/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      showSuccess("ลบเจ้าของร้านเรียบร้อยแล้ว");
      setOwners(owners.filter((owner) => owner._id !== id));
    } catch {
      showError("ไม่สามารถลบเจ้าของร้านได้");
    }
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center h-screen text-gray-600">
        <Loader2 className="animate-spin w-8 h-8 mb-2 text-blue-500" />
        <p>⏳ กำลังโหลดข้อมูล...</p>
      </div>
    );

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#E9F3FF] to-[#C8DCFF]">
      <Header mode="auth" />
      <div className="flex-1 flex flex-col justify-center p-6">
        <div className="bg-white w-full max-w-6xl mx-auto rounded-2xl shadow-lg border border-gray-200 p-6">
          {/* 🔹 Tabs */}
          <div className="flex gap-3 mb-6 border-b border-gray-200">
            <button
              onClick={() => setTab("stores")}
              className={`px-5 py-2 font-semibold rounded-t-lg transition-all duration-200 ${tab === "stores"
                  ? "bg-[#3674B5] text-white"
                  : "text-gray-600 hover:bg-gray-100"
                }`}
            >
              จัดการร้านค้า
            </button>
            <button
              onClick={() => setTab("owners")}
              className={`px-5 py-2 font-semibold rounded-t-lg transition-all duration-200 ${tab === "owners"
                  ? "bg-[#3674B5] text-white"
                  : "text-gray-600 hover:bg-gray-100"
                }`}
            >
              จัดการ Owner
            </button>
          </div>

          {/* 🔹 ตารางร้านค้า */}
          {tab === "stores" && (
            <>
              <div className="flex items-center gap-3 mb-5">
                <Store className="w-7 h-7 text-[#3674B5]" />
                <h2 className="text-xl font-bold text-gray-800">
                  รายการร้านค้าทั้งหมด
                </h2>
              </div>

              {stores.length === 0 ? (
                <p className="text-center text-gray-500">ไม่มีร้านค้าในระบบ</p>
              ) : (
                <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
                  <thead className="bg-[#3674B5] text-white">
                    <tr>
                      <th className="py-2 px-4">ชื่อร้าน</th>
                      <th className="py-2 px-4">รหัสร้าน</th>
                      <th className="py-2 px-4">ประเภท</th>
                      <th className="py-2 px-4">เจ้าของร้าน</th>
                      <th className="py-2 px-4 text-center">การจัดการ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {stores.map((s, i) => (
                      <tr
                        key={s._id}
                        className={`${i % 2 === 0 ? "bg-white" : "bg-gray-50"
                          } hover:bg-blue-50 transition`}
                      >
                        <td className="py-2 px-4 font-semibold text-gray-700">
                          {s.storeName}
                        </td>
                        <td className="py-2 px-4">{s.storeCode}</td>
                        <td className="py-2 px-4 capitalize">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${s.storeType === "restaurant"
                                ? "bg-orange-100 text-orange-600"
                                : s.storeType === "service"
                                  ? "bg-green-100 text-green-600"
                                  : "bg-blue-100 text-blue-600"
                              }`}
                          >
                            {s.storeType}
                          </span>
                        </td>
                        <td className="py-2 px-4">{s.ownerName}</td>
                        <td className="py-2 px-4 text-center">
                          <button
                            onClick={() => handleDeleteStore(s._id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-md text-sm flex items-center gap-2 mx-auto"
                          >
                            <Trash2 size={16} />
                            ลบ
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </>
          )}

          {/* 🔹 ตาราง Owner */}
          {tab === "owners" && (
            <>
              <div className="flex items-center gap-3 mb-5">
                <UserCog className="w-7 h-7 text-[#3674B5]" />
                <h2 className="text-xl font-bold text-gray-800">
                  รายชื่อ Owner ทั้งหมด
                </h2>
              </div>

              {owners.length === 0 ? (
                <p className="text-center text-gray-500">ไม่มีเจ้าของร้านในระบบ</p>
              ) : (
                <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
                  <thead className="bg-[#3674B5] text-white">
                    <tr>
                      <th className="py-2 px-4">ชื่อ - นามสกุล</th>
                      <th className="py-2 px-4">อีเมล</th>
                      <th className="py-2 px-4 text-center">การจัดการ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {owners.map((o, i) => (
                      <tr
                        key={o._id}
                        className={`${i % 2 === 0 ? "bg-white" : "bg-gray-50"
                          } hover:bg-blue-50 transition`}
                      >
                        <td className="py-2 px-4 font-semibold text-gray-700">
                          {o.firstName} {o.lastName}
                        </td>
                        <td className="py-2 px-4">{o.email}</td>
                        <td className="py-2 px-4 text-center flex justify-center gap-2">
                          <button
                            onClick={() => handleEditOwner(o)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-md text-sm flex items-center gap-2"
                          >
                            <Pencil size={16} />
                            แก้ไขรหัส
                          </button>
                          <button
                            onClick={() => handleDeleteOwner(o._id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-md text-sm flex items-center gap-2"
                          >
                            <Trash2 size={16} />
                            ลบ
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </>
          )}
        </div>
      </div>

      {/* ✅ Modal แก้ไขรหัสผ่าน Owner */}
      {editingOwner && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md border border-gray-200">
            <h3 className="text-xl font-bold text-[#3674B5] mb-4">
              เปลี่ยนรหัสผ่านของ {editingOwner.firstName} {editingOwner.lastName}
            </h3>

            <input
              type="password"
              placeholder="กรอกรหัสผ่านใหม่"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4 focus:ring-2 focus:ring-[#3674B5] outline-none"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setEditingOwner(null)}
                className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleSavePassword}
                disabled={saving}
                className={`px-4 py-2 rounded-lg text-white ${saving
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#3674B5] hover:bg-[#2f5fa0]"
                  }`}
              >
                {saving ? "กำลังบันทึก..." : "บันทึก"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
