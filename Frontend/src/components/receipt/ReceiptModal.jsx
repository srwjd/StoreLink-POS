/* eslint-disable react/prop-types */

import ReceiptLayout from "./ReceiptLayout";

export default function ReceiptModal({ receipt, onClose }) {
    if (!receipt) return null;

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center h-screen overflow-y-auto z-50">
            <div className="relative ">


                {/* ใบเสร็จจริง */}
                <ReceiptLayout receipt={receipt} />

                <div className="flex justify-center gap-3 mt-4">
                    <button
                        onClick={() => window.print()}
                        className="bg-[#3674B5] text-white px-4 py-2 rounded-lg hover:bg-[#2f5fa0]"
                    >
                        พิมพ์ใบเสร็จ
                    </button>
                    <button
                        onClick={onClose}
                        className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
                    >
                        ปิด
                    </button>
                </div>
            </div>
        </div>
    );
}
