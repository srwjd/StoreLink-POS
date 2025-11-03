import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Search, ChevronLeft, ChevronRight, Plus, X } from "lucide-react";

export default function StockPage() {
  const { storeId } = useParams();
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [form, setForm] = useState({
    name: "",
    category: "",
    type: "standard",
    price: "",
    stockQty: "",
    serialList: [""],
  });

  const [keyword, setKeyword] = useState("");
  const [sort, setSort] = useState("createdAt");
  const [order, setOrder] = useState("desc");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const API_BASE = "http://localhost:3000/products";

// 🔹 ดึง token จาก localStorage
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};


  // 🔹 โหลดข้อมูลสินค้า
  useEffect(() => {
    fetchProducts();
  }, [storeId, keyword, sort, order, page]);


// 🔹 โหลดข้อมูลสินค้า
const fetchProducts = async () => {
  try {
    const res = await axios.get(`${API_BASE}/all/${storeId}`, {
      params: { keyword, sort, order, page, limit: 10 },
      headers: getAuthHeader(), // ใส่ token
    });
    setProducts(res.data.products || []);
    setTotalPages(res.data.totalPages || 1);
  } catch (err) {
    console.error("Error fetching products:", err);
  }
};

  // 🔹 เปลี่ยนค่าฟอร์ม
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔹 เพิ่มช่อง serial ใหม่
  const addSerialField = () => {
    setForm({ ...form, serialList: [...form.serialList, ""] });
  };

  // 🔹 ลบช่อง serial
  const removeSerialField = (index) => {
    const newList = [...form.serialList];
    newList.splice(index, 1);
    setForm({ ...form, serialList: newList });
  };

  // 🔹 เปลี่ยนค่า serial ทีละช่อง
  const handleSerialChange = (index, value) => {
    const newList = [...form.serialList];
    newList[index] = value;
    setForm({ ...form, serialList: newList });
  };

// 🔹 เพิ่มสินค้าใหม่
const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const payload = {
      ...form,
      storeId,
      price: Number(form.price),
      stockQty: Number(form.stockQty),
    };

    if (form.type === "standard") delete payload.serialList;

    await axios.post(`${API_BASE}/create/${storeId}`, payload, {
      headers: getAuthHeader(), // ใส่ token
    });

    setIsModalOpen(false);
    setForm({
      name: "",
      category: "",
      type: "standard",
      price: "",
      stockQty: "",
      serialList: [""],
    });
    fetchProducts();
  } catch (err) {
    console.error("❌ Error adding product:", err);
  }
};

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          จัดการสต็อกสินค้า — ร้าน {storeId}
        </h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-gray-800 hover:bg-gray-900 text-white font-medium px-4 py-2 rounded-md"
        >
          เพิ่มสินค้า
        </button>
      </div>

      {/* Search / Sort */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="flex items-center bg-white border border-gray-300 rounded-md px-3 py-2 shadow-sm w-full md:w-1/3">
          <Search size={18} className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="ค้นหาชื่อสินค้า..."
            value={keyword}
            onChange={(e) => {
              setKeyword(e.target.value);
              setPage(1);
            }}
            className="w-full outline-none text-sm text-gray-700"
          />
        </div>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 bg-white text-sm"
        >
          <option value="createdAt">วันที่ล่าสุด</option>
          <option value="name">ชื่อสินค้า</option>
          <option value="price">ราคา</option>
          <option value="stockQty">คงเหลือ</option>
        </select>

        <select
          value={order}
          onChange={(e) => setOrder(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 bg-white text-sm"
        >
          <option value="asc">น้อย → มาก</option>
          <option value="desc">มาก → น้อย</option>
        </select>
      </div>

      {/* ตารางสินค้า */}
      <div className="overflow-x-auto bg-white shadow-sm rounded-lg border border-gray-200">
        <table className="min-w-full text-sm text-left text-gray-700">
          <thead className="bg-gray-100 text-gray-900">
            <tr>
              <th className="px-4 py-3 font-semibold">ชื่อสินค้า</th>
              <th className="px-4 py-3 font-semibold">หมวดหมู่</th>
              <th className="px-4 py-3 font-semibold">ประเภท</th>
              <th className="px-4 py-3 font-semibold">ราคา</th>
              <th className="px-4 py-3 font-semibold">คงเหลือ</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map((p) => (
                <tr key={p._id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">{p.name}</td>
                  <td className="px-4 py-2">{p.category || "-"}</td>
                  <td className="px-4 py-2">
                    {p.type === "serialized" ? "มี Serial" : "ทั่วไป"}
                  </td>
                  <td className="px-4 py-2">{p.price} บาท</td>
                  <td className="px-4 py-2">{p.stockQty ?? "-"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-500">
                  ไม่พบสินค้า
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-96 p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">
              เพิ่มสินค้าใหม่
            </h2>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-sm text-gray-700">ชื่อสินค้า</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700">หมวดหมู่</label>
                <input
                  type="text"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700">ประเภทสินค้า</label>
                <select
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="standard">สินค้าทั่วไป</option>
                  <option value="serialized">สินค้ามี Serial Number</option>
                </select>
              </div>

              {form.type === "serialized" && (
                <div>
                  <label className="block text-sm text-gray-700 mb-1">
                    Serial Numbers
                  </label>
                  {form.serialList.map((serial, i) => (
                    <div key={i} className="flex items-center gap-2 mb-2">
                      <input
                        type="text"
                        value={serial}
                        onChange={(e) =>
                          handleSerialChange(i, e.target.value)
                        }
                        className="flex-1 border border-gray-300 rounded-md px-3 py-2"
                      />
                      <button
                        type="button"
                        onClick={() => removeSerialField(i)}
                        className="p-1 text-red-500 hover:text-red-700"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addSerialField}
                    className="flex items-center text-blue-600 hover:text-blue-800 text-sm mt-1"
                  >
                    <Plus size={14} className="mr-1" /> เพิ่ม Serial
                  </button>
                </div>
              )}

              <div>
                <label className="block text-sm text-gray-700">ราคา</label>
                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700">คงเหลือ</label>
                <input
                  type="number"
                  name="stockQty"
                  value={form.stockQty}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white"
                >
                  บันทึก
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
