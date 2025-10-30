import { useState } from "react";
import { PencilSimple, Trash, PlusCircle, CheckSquare, XSquare } from "phosphor-react";

export default function ManagePosition() {
    const [positions, setPositions] = useState([
        {
            id: 1,
            name: "แคชเชียร์",
            permissions: {
                sale: true,
                report: false,
                employee: false,
                settings: false,
            },
        },
        {
            id: 2,
            name: "ผู้จัดการร้าน",
            permissions: {
                sale: true,
                report: true,
                employee: true,
                settings: false,
            },
        },
    ]);

    return (
        <div className="flex flex-col">

            <main className="flex-1">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-semibold text-[#3674B5]">จัดการตำแหน่งและสิทธิ์</h1>
                    <button className="flex items-center gap-2 bg-[#3674B5] hover:bg-[#2f5fa0] text-white px-4 py-2 rounded-lg shadow-md transition">
                        <PlusCircle size={20} /> เพิ่มตำแหน่ง
                    </button>
                </div>

                {/* ตารางตำแหน่ง */}
                <div className="bg-white rounded-xl shadow-md border border-slate-200 p-5 overflow-x-auto">
                    <table className="w-full text-sm border-separate border-spacing-y-2">
                        <thead>
                            <tr className="bg-[#3674B5] text-white text-center">
                                <th className="py-3 px-4 rounded-tl-lg">ชื่อตำแหน่ง</th>
                                <th className="py-3 px-4">ขาย</th>
                                <th className="py-3 px-4">รายงาน</th>
                                <th className="py-3 px-4">พนักงาน</th>
                                <th className="py-3 px-4">ตั้งค่า</th>
                                <th className="py-3 px-4 rounded-tr-lg">การจัดการ</th>
                            </tr>
                        </thead>

                        <tbody>
                            {positions.map((pos, i) => (
                                <tr
                                    key={pos.id}
                                    className={`text-center ${i % 2 === 0 ? "bg-slate-50" : "bg-white"
                                        } hover:bg-[#EAF1FF] transition-all duration-150`}
                                >
                                    <td className="py-3 px-4 font-medium text-slate-700">{pos.name}</td>
                                    {Object.keys(pos.permissions).map((key) => (
                                        <td key={key} className="py-3 px-4">
                                            {pos.permissions[key] ? (
                                                <CheckSquare size={20} color="#3BAE5E" weight="fill" />
                                            ) : (
                                                <XSquare size={20} color="#D14343" weight="fill" />
                                            )}
                                        </td>
                                    ))}
                                    <td className="py-3 px-4">
                                        <button className="text-blue-600 hover:underline mr-3 flex items-center gap-1">
                                            <PencilSimple size={16} /> แก้ไข
                                        </button>
                                        <button className="text-red-500 hover:underline flex items-center gap-1">
                                            <Trash size={16} /> ลบ
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {positions.length === 0 && (
                        <div className="text-center py-10 text-slate-500">
                            <p className="text-lg font-medium mb-2">ยังไม่มีตำแหน่งในระบบ</p>
                            <button className="bg-[#3674B5] hover:bg-[#2f5fa0] text-white px-4 py-2 rounded-lg shadow-md">
                                + เพิ่มตำแหน่งใหม่
                            </button>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
