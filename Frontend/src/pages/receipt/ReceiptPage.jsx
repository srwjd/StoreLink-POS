/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function ReceiptPage() {
  const { id } = useParams();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [receipt, setReceipt] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReceipt = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_BASE_URL}/orders/${id}/receipt`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setReceipt(res.data);
      } catch (err) {
        console.error("Error fetching receipt:", err);
      }
    };
    fetchReceipt();
  }, [id]);

  if (!receipt) return <p className="text-center mt-10">กำลังโหลดใบเสร็จ...</p>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-8">
      <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-6">
        <h2 className="text-center text-xl font-bold text-[#3674B5] mb-2">{receipt.storeName}</h2>
        <p className="text-center text-sm text-gray-600">{receipt.address}</p>
        <p className="text-center text-sm text-gray-600 mb-4">โทร: {receipt.phone}</p>

        <div className="border-t border-b py-3 text-sm">
          <p>วันที่: {new Date(receipt.createdAt).toLocaleString("th-TH")}</p>
          <p>พนักงาน: {receipt.cashier}</p>
          <p>วิธีชำระ: {receipt.paymentMethod}</p>
        </div>

        <div className="mt-4">
          {receipt.items.map((item, i) => (
            <div key={i} className="flex justify-between text-sm mb-1">
              <span>{item.name} × {item.qty}</span>
              <span>{item.total.toFixed(2)} ฿</span>
            </div>
          ))}
        </div>

        <div className="border-t mt-3 pt-3 text-sm">
          <div className="flex justify-between">
            <span>รวม</span><span>{receipt.subTotal.toFixed(2)} ฿</span>
          </div>
          <div className="flex justify-between">
            <span>ภาษี (7%)</span><span>{receipt.tax.toFixed(2)} ฿</span>
          </div>
          <div className="flex justify-between font-semibold text-[#3674B5]">
            <span>ยอดสุทธิ</span><span>{receipt.total.toFixed(2)} ฿</span>
          </div>
          <div className="flex justify-between mt-2">
            <span>รับเงิน</span><span>{receipt.paidAmount.toFixed(2)} ฿</span>
          </div>
          <div className="flex justify-between">
            <span>เงินทอน</span><span>{receipt.changeAmount.toFixed(2)} ฿</span>
          </div>
        </div>

        <p className="text-center text-gray-500 text-xs mt-4">ขอบคุณที่ใช้บริการ ❤️</p>

        <div className="flex justify-center mt-4">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-[#3674B5] text-white rounded-lg hover:bg-[#2f5fa0]"
          >
            กลับ
          </button>
        </div>
      </div>
    </div>
  );
}
