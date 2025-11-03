/* eslint-disable react/prop-types */
import { useState } from "react";
// import { Chair, PlusCircle, XCircle } from "phosphor-react";

export default function RestaurantTableView({ onSelectTable, onBack }) {
  const [tables, setTables] = useState([
    { id: "T01", name: "โต๊ะ 1", status: "available" },
    { id: "T02", name: "โต๊ะ 2", status: "occupied" },
    { id: "T03", name: "โต๊ะ 3", status: "available" },
    { id: "T04", name: "โต๊ะ 4", status: "occupied" },
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-700 border-green-400";
      case "occupied":
        return "bg-red-100 text-red-700 border-red-400";
      default:
        return "bg-slate-100 text-slate-700 border-slate-300";
    }
  };

  return (
    <div className="flex flex-col min-h-[80vh]">
      {/* 🔹 Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-[#3674B5] flex items-center gap-2">
          {/* <Chair size={28} /> เลือกโต๊ะ */}
        </h2>
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-slate-500 hover:text-slate-700"
        >
          {/* <XCircle size={20} /> กลับ */}
        </button>
      </div>

      {/* 🔹 ตารางโต๊ะ */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
        {tables.map((table) => (
          <button
            key={table.id}
            onClick={() => onSelectTable(table.id)}
            className={`flex flex-col items-center justify-center rounded-2xl border-2 p-6 shadow-sm hover:shadow-md transition-all duration-200 ${getStatusColor(
              table.status
            )}`}
          >
            {/* <Chair size={40} weight="fill" /> */}
            <span className="mt-2 font-semibold text-lg">{table.name}</span>
            <span className="text-xs opacity-70">
              {table.status === "available"
                ? "ว่าง"
                : table.status === "occupied"
                ? "กำลังใช้งาน"
                : "จองแล้ว"}
            </span>
          </button>
        ))}

        {/* 🔹 ปุ่มเพิ่มโต๊ะ (ไว้ต่อยอดในอนาคต) */}
        <button
          onClick={() =>
            setTables([
              ...tables,
              { id: `T0${tables.length + 1}`, name: `โต๊ะ ${tables.length + 1}`, status: "available" },
            ])
          }
          className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 p-6 rounded-2xl text-slate-400 hover:text-[#3674B5] hover:border-[#3674B5] hover:bg-[#E9F3FF] transition-all duration-200"
        >
          {/* <PlusCircle size={36} /> */}
          <span className="mt-2 font-medium">เพิ่มโต๊ะ</span>
        </button>
      </div>
    </div>
  );
}
