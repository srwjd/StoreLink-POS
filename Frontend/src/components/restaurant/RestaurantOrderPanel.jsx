/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState } from "react";
import {
  MagnifyingGlass,
  ForkKnife,
  Trash,
  CreditCard,
  MinusCircle,
  PlusCircle,
  Sliders,
} from "phosphor-react";

export default function RestaurantOrderPanel({ mode, tableId, onBack }) {
  const categories = ["อาหารจานหลัก", "เครื่องดื่ม", "ของหวาน", "อื่นๆ"];
  const [activeCategory, setActiveCategory] = useState("อาหารจานหลัก");

  const [menu] = useState([
    {
      id: 1,
      name: "ผัดไทย",
      price: 60,
      image: "/images/default-menu.png",
      category: "อาหารจานหลัก",
      options: [
        {
          name: "ระดับความเผ็ด",
          type: "radio",
          choices: ["ไม่เผ็ด", "เผ็ดน้อย", "ปกติ", "เผ็ดมาก"],
        },
        {
          name: "ชนิดเนื้อ",
          type: "radio",
          choices: ["หมู", "ไก่", "กุ้ง (+10฿)"],
        },
      ],
    },
    {
      id: 2,
      name: "ชาเย็น",
      price: 35,
      image: "/images/default-menu.png",
      category: "เครื่องดื่ม",
      options: [
        {
          name: "ระดับความหวาน",
          type: "radio",
          choices: ["ไม่หวาน", "หวานน้อย", "ปกติ", "หวานมาก"],
        },
      ],
    },
    {
      id: 3,
      name: "ไอศกรีมวานิลลา",
      price: 30,
      image: "/images/default-menu.png",
      category: "ของหวาน"
    },
    {
      id: 4,
      name: "ไอศกรีมช็อค",
      price: 35,
      image: "/images/default-menu.png",
      category: "ของหวาน"
    },
  ]);

  const [search, setSearch] = useState("");
  const [cart, setCart] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [optionsForm, setOptionsForm] = useState({});

  const filteredMenu = menu.filter(
    (m) =>
      m.category === activeCategory &&
      m.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelectMenu = (item) => {
    if (item.options) {
      setSelectedItem(item);
      const defaultOpts = {};
      item.options.forEach((opt) => {
        defaultOpts[opt.name] = opt.type === "radio" ? "" : [];
      });
      setOptionsForm(defaultOpts);
    } else {
      addToCart(item);
    }
  };

  const handleOptionChange = (optName, value) => {
    setOptionsForm({ ...optionsForm, [optName]: value });
  };

  const handleConfirmAdd = () => {
    let extra = 0;
    const formatted = Object.entries(optionsForm).reduce((acc, [key, val]) => {
      acc[key] = val;
      if (typeof val === "string" && val.includes("(+")) {
        const match = val.match(/\(\+(\d+)/);
        if (match) extra += parseInt(match[1]);
      }
      return acc;
    }, {});
    addToCart({ ...selectedItem, options: formatted, extra });
    setSelectedItem(null);
  };

  const addToCart = (item) => {
    const exists = cart.find(
      (c) =>
        c.id === item.id &&
        JSON.stringify(c.options || {}) === JSON.stringify(item.options || {})
    );
    if (exists) {
      setCart(
        cart.map((c) =>
          c === exists ? { ...c, qty: c.qty + 1 } : c
        )
      );
    } else {
      setCart([...cart, { ...item, qty: 1 }]);
    }
  };

  const isSameItem = (a, b) => {
    if (a.id !== b.id) return false;
    if (!a.options && !b.options) return true;
    return JSON.stringify(a.options || {}) === JSON.stringify(b.options || {});
  };

  const decreaseQty = (id, options) => {
    setCart(cart.map(c =>
      isSameItem(c, { id, options })
        ? { ...c, qty: c.qty - 1 }
        : c
    ).filter(c => c.qty > 0));
  };

  const removeFromCart = (id, options) => {
    setCart(cart.filter(c => !isSameItem(c, { id, options })));
  };


  const total = cart.reduce((sum, i) => sum + (i.price + (i.extra || 0)) * i.qty, 0);

  return (
    <div className="flex flex-col lg:flex-row gap-6 min-h-[80vh]">
      {/* 🔹 เมนูอาหาร */}
      <div className="flex-1 bg-white rounded-xl shadow-md border border-slate-200 p-5 flex flex-col ">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-[#3674B5] flex items-center gap-2">
            <ForkKnife size={22} /> เมนูอาหาร
          </h2>
          <button
            onClick={onBack}
            className="text-slate-500 hover:text-slate-700 transition"
          >
            กลับ
          </button>
        </div>

        {/* หมวดหมู่ */}
        <div className="flex gap-2 overflow-x-auto mb-4 pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${activeCategory === cat
                ? "bg-[#3674B5] text-white shadow-md"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* ค้นหา */}
        <div className="relative mb-4">
          <MagnifyingGlass
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder={`ค้นหาใน "${activeCategory}" ...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-3 py-2 border border-slate-300 rounded-lg w-full focus:ring-2 focus:ring-[#3674B5]"
          />
        </div>

        {/* รายการเมนู */}
        <div className="flex overflow-x-auto gap-4 pb-3 px-1 custom-scroll flex-wrap max-h-[48vh]">
          {filteredMenu.length === 0 ? (
            <p className="text-center text-slate-400 w-full mt-6">
              ไม่พบเมนูในหมวดนี้
            </p>
          ) : (
            filteredMenu.map((item) => (
              <button
                key={item.id}
                onClick={() => handleSelectMenu(item)}
                className="flex items-center gap-2 min-w-[180px] border-[1.5px] border-[#C4D9FA] rounded-2xl p-2 text-[#3674B5] 
                   hover:border-[#3674B5] hover:text-[#3674B5] shadow-sm hover:shadow-md
                   transition-all duration-300"
              >
                {/* รูปเมนู */}
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-xl border border-[#C7D8F5] shadow-sm"
                />

                {/* ชื่อและราคา */}
                <div>
                  <div className="text-center w-full">
                    <p className="font-semibold text-slate-700 leading-tight">
                      {item.name}
                    </p>
                    <p className="text-sm text-[#3674B5] font-medium mt-1">
                      {item.price} บาท
                    </p>
                  </div>

                  {/* แท็ก “มีตัวเลือก” */}
                  {item.options && (
                    <div className="flex items-center justify-center mt-2">
                      <span className="bg-[#EAF2FF] text-xs text-[#3674B5] px-2 py-0.5 rounded-full border border-[#C4D9FA]">
                        มีตัวเลือก
                      </span>
                    </div>
                  )}
                </div>
              </button>
            ))
          )}
        </div>


      </div>

      {/* 🔹 ใบสั่งอาหาร */}
      <div className="w-full lg:w-80 bg-white rounded-xl shadow-md border border-slate-200 p-5 flex flex-col">
        <h2 className="text-xl font-semibold text-[#3674B5] mb-4 flex items-center gap-2">
          ใบสั่งอาหาร
        </h2>

        <div className="flex justify-between text-sm text-slate-500 mb-2">
          <span>{mode === "dine-in" ? `โต๊ะ ${tableId}` : "สั่งกลับบ้าน"}</span>
          <span>{cart.length} รายการ</span>
        </div>

        <div className="border-t border-b border-slate-200 py-3 space-y-3 overflow-y-auto max-h-[44vh] min-h-[44vh]">
          {cart.length === 0 ? (
            <p className="text-center text-slate-400 mt-6">ยังไม่มีรายการอาหาร</p>
          ) : (
            cart.map((item, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center bg-slate-50 px-3 py-2 rounded-lg shadow-sm"
              >
                <div className="flex-1 text-left">
                  <p className="font-medium text-slate-700">{item.name}</p>
                  {item.options && (
                    <p className="text-xs text-slate-500 mt-1">
                      {Object.entries(item.options)
                        .filter(([_, v]) => v)
                        .map(([k, v]) => `• ${k}: ${v}`)
                        .join(", ")}
                    </p>
                  )}
                  <p className="text-xs text-slate-500 mt-1">
                    {(item.price + (item.extra || 0))} ฿ x {item.qty}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => decreaseQty(item.id, item.options)}
                    className="text-slate-500 hover:text-[#3674B5]"
                  >
                    <MinusCircle size={18} />
                  </button>
                  <span className="w-6 text-center text-sm">{item.qty}</span>
                  <button
                    onClick={() => addToCart(item)}
                    className="text-slate-500 hover:text-[#3674B5]"
                  >
                    <PlusCircle size={18} />
                  </button>
                  <button
                    onClick={() => removeFromCart(item.id, item.options)}
                    className="text-red-500 hover:text-red-700 ml-2"
                  >
                    <Trash size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-4 border-t pt-3">
          <p className="text-slate-700 flex justify-between font-semibold">
            <span>รวมทั้งหมด</span>
            <span>{total} บาท</span>
          </p>

          <button
            disabled={cart.length === 0}
            className={`mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-semibold shadow-md transition-all ${cart.length === 0
              ? "bg-slate-300 text-slate-500 cursor-not-allowed"
              : "bg-[#3674B5] hover:bg-[#2f5fa0] text-white"
              }`}
          >
            <CreditCard size={20} /> ชำระเงิน
          </button>
        </div>
      </div>

      {/* 🟦 Modal เลือกตัวเลือกอาหาร */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-gradient-to-b from-white to-[#F3F7FF] rounded-2xl shadow-2xl w-full max-w-md p-6 border border-[#D4E1F7] relative">
            <h2 className="text-2xl font-semibold text-[#3674B5] mb-5 text-center">
              {selectedItem.name}
            </h2>

            {selectedItem.options.map((opt, i) => (
              <div key={i} className="mb-5">
                <p className="font-medium text-slate-700 mb-3 text-base">
                  {opt.name}
                </p>

                <div className="grid grid-cols-2 gap-3">
                  {opt.choices.map((choice) => (
                    <label
                      key={choice}
                      className={`flex items-center justify-center gap-2 text-sm px-4 py-2 rounded-xl border transition-all cursor-pointer shadow-sm
                  ${optionsForm[opt.name] === choice
                          ? "bg-[#3674B5] text-white border-[#3674B5] shadow-md"
                          : "bg-white hover:bg-[#EAF2FF] border-slate-300 text-slate-700"
                        }`}
                    >
                      <input
                        type="radio"
                        name={opt.name}
                        value={choice}
                        checked={optionsForm[opt.name] === choice}
                        onChange={(e) =>
                          handleOptionChange(opt.name, e.target.value)
                        }
                        className="hidden"
                      />
                      {choice}
                    </label>
                  ))}
                </div>
              </div>
            ))}

            {/* ปุ่ม */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setSelectedItem(null)}
                className="px-5 py-2.5 rounded-xl font-medium bg-slate-200 hover:bg-slate-300 text-slate-700 transition"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleConfirmAdd}
                className="px-5 py-2.5 rounded-xl font-semibold bg-[#3674B5] hover:bg-[#2f5fa0] text-white shadow-md transition"
              >
                เพิ่มลงใบสั่ง
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
