/* eslint-disable react/prop-types */
import { useState } from "react";

export function SelectStaffModal({ isOpen, onClose, staffList, onConfirm }) {
  const [selected, setSelected] = useState(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-[380px] p-6">
        <h2 className="text-lg font-semibold text-[#3674B5] mb-4 text-center">
          👩‍🔧 เลือกพนักงานผู้ให้บริการ
        </h2>

        <div className="max-h-[200px] overflow-y-auto space-y-2">
          {staffList.length === 0 ? (
            <p className="text-center text-slate-400">ยังไม่มีพนักงาน</p>
          ) : (
            staffList.map((staff) => (
              <button
                key={staff._id}
                onClick={() => setSelected(staff)}
                className={`w-full p-3 rounded-xl border text-left transition ${
                  selected?._id === staff._id
                    ? "bg-[#3674B5]/10 border-[#3674B5] text-[#3674B5]"
                    : "border-slate-200 hover:border-[#3674B5]"
                }`}
              >
                {staff.firstName} {staff.lastName || ""}
              </button>
            ))
          )}
        </div>

        <div className="flex justify-between mt-5">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-100"
          >
            ยกเลิก
          </button>
          <button
            onClick={() => onConfirm(selected)}
            className="px-4 py-2 rounded-lg bg-[#3674B5] text-white hover:bg-[#2f5fa0]"
          >
            ยืนยัน
          </button>
        </div>
      </div>
    </div>
  );
}
