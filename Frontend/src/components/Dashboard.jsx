import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";


export default function Dashboard() {
  const { storeId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchDashboard = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/sales/${storeId}`);
      setData(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (storeId) fetchDashboard(); // ป้องกัน undefined
}, [storeId]);

  if (loading) return <div className="p-6 text-lg">กำลังโหลด...</div>;

  return (
    <div className="p-6 space-y-6">

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card title="ยอดขายวันนี้" value={data.totalSalesToday.toLocaleString()} />
        <Card title="ยอดขายเดือนนี้" value={data.totalSalesThisMonth.toLocaleString()} />
        <Card title="จำนวนบิล" value={data.totalTransactions} />
      </div>

      {/* Top Products */}
      <div className="bg-white shadow rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-3">สินค้าขายดี</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">สินค้า</th>
              <th className="text-right py-2">จำนวน</th>
              <th className="text-right py-2">ยอดขาย (บาท)</th>
            </tr>
          </thead>
          <tbody>
            {data.topProducts.map((item) => (
              <tr key={item._id} className="border-b">
                <td className="py-2">{item.name}</td>
                <td className="text-right py-2">{item.totalQuantity}</td>
                <td className="text-right py-2">{item.totalRevenue.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Stock Alert */}
      <div className="bg-white shadow rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-3 text-red-600">สินค้าใกล้หมด</h2>
        {data.stockAlert.length === 0 ? (
          <p className="text-sm text-gray-500">ไม่มีสินค้าใกล้หมด ✅</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">สินค้า</th>
                <th className="text-right py-2">คงเหลือ</th>
              </tr>
            </thead>
            <tbody>
              {data.stockAlert.map((p) => (
                <tr key={p._id} className="border-b">
                  <td className="py-2">{p.name}</td>
                  <td className="text-right py-2 text-red-600">{p.stock}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

    </div>
  );
}

function Card({ title, value }) {
  return (
    <div className="bg-white shadow rounded-lg p-4">
      <p className="text-sm text-gray-500">{title}</p>
      <h2 className="text-2xl font-bold mt-1">{value}</h2>
    </div>
  );
}
