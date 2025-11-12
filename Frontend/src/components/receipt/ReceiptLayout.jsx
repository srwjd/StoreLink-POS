
import { useStore } from "../../context/StoreContext";
import {
    Storefront
} from "../../../public/icons/icons";
import { useEffect } from "react";

/* eslint-disable react/prop-types */
export default function ReceiptLayout({ receipt }) {
    const { store } = useStore();

   
    useEffect(() => {
        
    }, []);

    return (
        <div className="w-[320px] bg-white rounded-xs shadow-xl p-5 font-sans text-gray-700">
            {/* Header */}
            <div className="text-center border-b border-dotted pb-2 mb-2">
                <div className="font-semibold text-lg text-[#3674B5] flex items-center justify-center gap-2">
                    {receipt.storeLogo || <Storefront />} {store.storeName}
                </div>
                <p className="text-xs">{receipt.address || "-"}</p>
                <p className="text-xs mb-1">{receipt.phone ? `โทร: ${receipt.phone}` : "Tel: -"}</p>
            </div>

            {/* Order Info */}
            <div className="flex justify-between text-xs mb-2">
                <div>
                    <p>Order #{receipt._id.slice(-6)}</p>
                    <p>Date: {new Date(receipt.createdAt).toLocaleDateString("th-TH")}</p>
                </div>
                <div className="text-right">
                    <p>Cashier: {receipt.userId?.firstName || "—"}</p>
                    <p>{new Date(receipt.createdAt).toLocaleTimeString("th-TH")}</p>
                </div>
            </div>

            {/* Items */}
            <div className="border-y border-dotted py-2 mb-2">
                {receipt.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                        <span>{item.name} × {item.qty}</span>
                        <span>{item.total.toFixed(2)} ฿</span>
                    </div>
                ))}
            </div>

            {/* Summary */}
            <div className="text-sm space-y-1">
                <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{receipt.subTotal?.toFixed(2)} ฿</span>
                </div>
                <div className="flex justify-between">
                    <span>Tax {store.taxRate}%</span>
                    <span>{receipt.tax?.toFixed(2)} ฿</span>
                </div>
                <div className="flex justify-between font-semibold text-[#3674B5]">
                    <span>Total</span>
                    <span>{receipt.total?.toFixed(2)} ฿</span>
                </div>
                <div className="flex justify-between">
                    <span>Paid</span>
                    <span>{receipt.paidAmount?.toFixed(2)} ฿</span>
                </div>
                <div className="flex justify-between">
                    <span>Change</span>
                    <span>{receipt.changeAmount?.toFixed(2)} ฿</span>
                </div>
            </div>

            {/* Footer */}
            <div className="text-center mt-3 border-t border-dotted pt-2">
                <p className="text-sm text-[#3674B5] font-semibold">Have a nice day!</p>
                <p className="text-[10px] text-gray-500">
                    ขอบคุณที่ใช้บริการ {store.storeName}
                </p>
            </div>
        </div>
    );
}
