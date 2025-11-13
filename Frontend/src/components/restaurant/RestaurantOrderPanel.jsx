/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../../context/StoreContext";

import axios from "axios";
import {
  MagnifyingGlass,
  ForkKnife,
  Trash,
  CreditCard,
  MinusCircle,
  PlusCircle,
} from "phosphor-react";
import { ImageIcon } from "../../../public/icons/icons";

export default function RestaurantOrderPanel({ mode, tableId, onBack }) {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const navigate = useNavigate();
  const { store } = useStore();
  const [viweAllOrder, setViweAllOrder] = useState(false);
  const [activeCategory, setActiveCategory] = useState("ทั้งหมด");
  const [categories, setCategories] = useState([]);
  const [menu, setMenu] = useState([]);
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [optionsForm, setOptionsForm] = useState({});
  const token = localStorage.getItem("token");
  const storeId = localStorage.getItem("currentStore");

  const fetchMenu = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/products/all/${storeId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMenu(res.data.products);
      const uniqueCats = [...new Set(res.data.products.map((p) => p.category).filter(Boolean))];
      setCategories(["ทั้งหมด", ...uniqueCats]);
    } catch (err) {
      console.error("Error fetching menu:", err);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, [storeId]);

  const filteredMenu = menu.filter((m) => {
    const matchCategory = activeCategory === "ทั้งหมด" || m.category === activeCategory;
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  const handleSelectMenu = (item) => {
    const hasOptionGroups = Array.isArray(item.optionGroups) && item.optionGroups.length > 0;
    if (hasOptionGroups) {
      setSelectedItem(item);
      const defaults = {};
      item.optionGroups.forEach((group) => {
        if (group.selectionType === "single") {
          const def = group.choices.find((c) => c.isDefault);
          defaults[group.name] = def ? def.label : "";
        } else {
          const defList = group.choices.filter((c) => c.isDefault).map((c) => c.label);
          defaults[group.name] = defList;
        }
      });
      setOptionsForm(defaults);
    } else {
      addToCart(item);
    }
  };

  const handleOptionChange = (group, next) => {
    // group: { name, selectionType }
    if (group.selectionType === "single") {
      setOptionsForm({ ...optionsForm, [group.name]: next });
    } else {
      const current = Array.isArray(optionsForm[group.name]) ? optionsForm[group.name] : [];
      let updated;
      if (current.includes(next)) {
        updated = current.filter((v) => v !== next);
      } else {
        if (Number.isFinite(group.maxSelections) && group.maxSelections > 0 && current.length >= group.maxSelections) {
          return; // block over-select
        }
        updated = [...current, next];
      }
      setOptionsForm({ ...optionsForm, [group.name]: updated });
    }
  };

  const handleConfirmAdd = () => {
    let extra = 0;
    const optionsOut = {};
    selectedItem.optionGroups.forEach((group) => {
      const selected = optionsForm[group.name];
      if (group.selectionType === "single") {
        optionsOut[group.name] = selected || "";
        const choice = group.choices.find((c) => c.label === selected);
        if (choice) extra += Number(choice.priceDelta || 0);
      } else {
        const selectedList = Array.isArray(selected) ? selected : [];
        optionsOut[group.name] = selectedList;
        selectedList.forEach((label) => {
          const choice = group.choices.find((c) => c.label === label);
          if (choice) extra += Number(choice.priceDelta || 0);
        });
      }
    });
    addToCart({ ...selectedItem, options: optionsOut, extra });
    setSelectedItem(null);
  };

  const addToCart = (item) => {
    const exists = cart.find(
      (c) =>
        c._id === item._id &&
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
    const aId = a?._id ?? a?.id;
    const bId = b?._id ?? b?.id;
    if (aId !== bId) return false;
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
    <div className="flex flex-col lg:flex-row gap-6 min-h-screen bg-gradient-to-b from-[#EAF2FF] to-[#C6D8FF]">
      {/* 🔹 เมนูอาหาร */}
      <div className="h-[calc(100vh-100px)] flex-1 bg-white rounded-xl shadow-md border border-slate-200 p-5 flex flex-col ">
        <div className="flex justify-between items-center mb-4">
          {viweAllOrder ? (
            <h2 className="text-xl font-semibold text-[#3674B5] flex items-center gap-2">
              รายการสั่ง
            </h2>
          ) : (
            <h2 onClick={onBack} className="text-xl font-semibold text-[#3674B5] flex items-center gap-2">
              <ForkKnife size={22} /> เมนูอาหาร
            </h2>
          )}
          {/* {viweAllOrder ? (
            <button
              onClick={() => { setViweAllOrder(false) }}
              className="text-[#3674B5] border border-[#3674B5] px-4 py-2 rounded-lg hover:bg-[#2f5fa0] hover:text-white">
              ขายต่อ
            </button>
          ) : (
            <button
              onClick={() => { setViweAllOrder(true) }}
              className="text-[#3674B5] border border-[#3674B5] px-4 py-2 rounded-lg hover:bg-[#2f5fa0] hover:text-white">
              ดูรายการสั่ง
            </button>
          )} */}
        </div>

        {!viweAllOrder ? (
          <div>
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
                    key={item._id}
                    onClick={() => handleSelectMenu(item)}
                    className="flex items-center gap-2 min-w-[180px] border-[1.5px] border-[#C4D9FA] rounded-2xl p-2 text-[#3674B5] 
                   hover:border-[#3674B5] hover:text-[#3674B5] shadow-sm hover:shadow-md
                   transition-all duration-300"
                  >
                    {/* รูปเมนู */}
                    {item.productImage ? (
                      <img
                        src={item.productImage}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-xl border border-[#C7D8F5] shadow-sm"
                      />
                    ) : (
                      <div
                        className="w-20 h-20 object-cover rounded-xl border border-[#C7D8F5] shadow-sm"
                      >
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon size={30} />
                        </div>
                      </div>
                    )}

                    {/* ชื่อและราคา */}
                    <div>
                      <div className="text-center w-full">
                        <p className="font-semibold text-slate-700 leading-tight">
                          {item.name}
                        </p>
                        <p className="text-sm text-[#3674B5] font-medium mt-1">
                          {item.price.toLocaleString("th-TH")} บาท
                        </p>
                      </div>

                      {/* แท็ก “มีตัวเลือก” */}
                      {Array.isArray(item.optionGroups) && item.optionGroups.length > 0 && (
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
        ) : (
          <div>
            {/* ดูรายการสั่ง */}
          </div>
        )}

      </div>

      {/* 🔹 ใบสั่งอาหาร */}
      <div className="h-[calc(100vh-100px)] w-full lg:w-80 bg-white rounded-xl shadow-md border border-slate-200 p-5 flex flex-col">
        <h2 className="text-xl font-semibold text-[#3674B5] mb-4 flex items-center gap-2">
          ใบสั่งอาหาร
        </h2>

        <div className="flex justify-between text-sm text-slate-500 mb-2">
          <span>{cart.length} รายการ</span>
        </div>

        <div className="border-t border-b border-slate-200 py-3 space-y-3 overflow-y-auto h-full">
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
                        .map(([k, v]) => Array.isArray(v) ? `• ${k}: ${v.join("/")}` : `• ${k}: ${v}`)
                        .join(", ")}
                    </p>
                  )}
                  <p className="text-xs text-slate-500 mt-1">
                    {(item.price + (item.extra || 0))} ฿ x {item.qty}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => decreaseQty(item._id, item.options)}
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
                    onClick={() => removeFromCart(item._id, item.options)}
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
            onClick={() => {
              if (cart.length === 0) return alert("ยังไม่มีรายการสินค้า");
              navigate(`/sales/payment/${storeId}`, { state: { cart, totalAmount: total, storeId, isRestaurantOrder: true } })
            }}
            className={`w-full mt-4 flex items-center justify-center gap-2 py-2.5 rounded-lg font-semibold shadow-md transition-all ${cart.length === 0
              ? "bg-slate-300 text-slate-500 cursor-not-allowed"
              : "bg-[#3674B5] hover:bg-[#2f5fa0] text-white"
              }`}
          >
            <CreditCard size={20} /> ชำระเงิน
          </button>
        </div>
      </div>

      {/* 🟦 Modal เลือกตัวเลือกอาหาร จาก optionGroups */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-gradient-to-b from-white to-[#F3F7FF] rounded-2xl shadow-2xl w-full max-w-md p-6 border border-[#D4E1F7] relative">
            <h2 className="text-2xl font-semibold text-[#3674B5] mb-5 text-center">
              {selectedItem.name}
            </h2>

            {selectedItem.optionGroups?.map((group, i) => (
              <div key={i} className="mb-5">
                <p className="font-medium text-slate-700 mb-2 text-base">
                  {group.name}
                </p>

                {group.selectionType === "single" ? (
                  <div className="grid grid-cols-2 gap-3">
                    {group.choices.map((c, idx) => {
                      const label = c.priceDelta ? `${c.label} (+${c.priceDelta})` : c.label;
                      const checked = optionsForm[group.name] === c.label;
                      return (
                        <label
                          key={idx}
                          className={`flex items-center justify-center gap-2 text-sm px-4 py-2 rounded-xl border transition-all cursor-pointer shadow-sm ${checked ? "bg-[#3674B5] text-white border-[#3674B5] shadow-md" : "bg-white hover:bg-[#EAF2FF] border-slate-300 text-slate-700"}`}
                        >
                          <input
                            type="radio"
                            name={group.name}
                            value={c.label}
                            checked={checked}
                            onChange={() => handleOptionChange(group, c.label)}
                            className="hidden"
                          />
                          {label}
                        </label>
                      );
                    })}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    {group.choices.map((c, idx) => {
                      const label = c.priceDelta ? `${c.label} (+${c.priceDelta})` : c.label;
                      const list = Array.isArray(optionsForm[group.name]) ? optionsForm[group.name] : [];
                      const checked = list.includes(c.label);
                      return (
                        <label
                          key={idx}
                          className={`flex items-center justify-center gap-2 text-sm px-4 py-2 rounded-xl border transition-all cursor-pointer shadow-sm ${checked ? "bg-[#3674B5] text-white border-[#3674B5] shadow-md" : "bg-white hover:bg-[#EAF2FF] border-slate-300 text-slate-700"}`}
                        >
                          <input
                            type="checkbox"
                            name={`${group.name}-${c.label}`}
                            checked={checked}
                            onChange={() => handleOptionChange(group, c.label)}
                            className="hidden"
                          />
                          {label}
                        </label>
                      );
                    })}
                  </div>
                )}
                {group.selectionType === "multiple" && Number.isFinite(group.maxSelections) && group.maxSelections > 0 && (
                  <p className="text-xs text-slate-500 mt-2">เลือกได้สูงสุด {group.maxSelections} รายการ</p>
                )}
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
