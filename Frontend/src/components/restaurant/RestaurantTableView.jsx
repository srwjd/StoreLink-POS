/* eslint-disable react/prop-types */


export default function RestaurantTableView({ tables, onSelectTable, onBack }) {
  const getStatusColor = (status) => {
    switch (status) {
      case "available": return "bg-green-100 text-green-700 border-green-400";
      case "pending": return "bg-yellow-100 text-yellow-700 border-yellow-400";
      case "served": return "bg-blue-100 text-blue-700 border-blue-400";
      case "occupied": return "bg-red-100 text-red-700 border-red-400";
      default: return "bg-slate-100 text-slate-700 border-slate-300";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "available": return "ว่าง";
      case "pending": return "รอเสิร์ฟ / ยังไม่ชำระ";
      case "served": return "เสิร์ฟครบ / รอชำระ";
      case "occupied": return "กำลังใช้งาน";
      default: return "ไม่ทราบสถานะ";
    }
  };

  return (
    <div className="flex flex-col min-h-[80vh]">
      <div className="flex justify-between items-center mb-6">
        <h2 onClick={onBack} className="text-2xl font-semibold text-[#3674B5]">เลือกโต๊ะ</h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
        {tables.map((table) => (
          <button
            key={table.id}
            onClick={() => onSelectTable(table.id)}
            className={`flex flex-col items-center justify-center rounded-2xl border-2 p-6 shadow-sm hover:shadow-md transition-all duration-200 ${getStatusColor(table.status)}`}
          >
            <span className="font-semibold text-lg">{table.name}</span>
            <span className="text-xs opacity-70">{getStatusLabel(table.status)}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
