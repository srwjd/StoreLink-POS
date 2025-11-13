import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function AdminPage() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ ดึงข้อมูลร้านค้าทั้งหมด
  const fetchStores = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_BASE_URL}/admin/stores`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStores(res.data);
    } catch (err) {
      console.error("Error fetching stores:", err);
      toast.error("ไม่สามารถโหลดข้อมูลร้านค้าได้");
    } finally {
      setLoading(false);
    }
  };

  // 🔴 ฟังก์ชันลบร้านค้า
  const handleDelete = async (id) => {
    const confirmDelete = confirm("คุณแน่ใจหรือไม่ว่าต้องการลบร้านค้านี้?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE_URL}/admin/stores/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("ลบร้านค้าเรียบร้อยแล้ว");
      setStores(stores.filter((store) => store._id !== id));
    } catch (err) {
      console.error("Error deleting store:", err);
      toast.error("ไม่สามารถลบร้านค้าได้");
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  if (loading) return <p className="text-center mt-8">⏳ กำลังโหลดข้อมูล...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">จัดการร้านค้าทั้งหมด</h1>

      {stores.length === 0 ? (
        <p className="text-gray-500 text-center mt-8">ไม่มีร้านค้าในระบบ</p>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="py-2 px-4 border-b text-left">ชื่อร้าน</th>
                <th className="py-2 px-4 border-b text-left">รหัสร้าน</th>
                <th className="py-2 px-4 border-b text-left">ประเภท</th>
                <th className="py-2 px-4 border-b text-left">เจ้าของร้าน</th>
                <th className="py-2 px-4 border-b text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {stores.map((store) => (
                <tr key={store._id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">{store.storeName}</td>
                  <td className="py-2 px-4 border-b">{store.storeCode}</td>
                  <td className="py-2 px-4 border-b">{store.storeType}</td>
                  <td className="py-2 px-4 border-b">
                    {store.ownerId ? store.ownerId.name : "-"}
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    <button
                      onClick={() => handleDelete(store._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm"
                    >
                      ลบ
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
