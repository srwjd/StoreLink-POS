/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { X, PlusCircle, Trash } from "phosphor-react";
import axios from "axios";

export default function ProductModal({
    storeId,
    type,
    editingProduct,
    onClose,
    onSuccess,
}) {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    const [form, setForm] = useState({
        barcode: "",
        name: "",
        category: "",
        price: "",
        unit: "ชิ้น",
        qty: "",
        description: "",
        productType: "standard", // standard | serialized
        serialList: [""],
        optionGroups: [],
        hasOptions: false,
    });



    useEffect(() => {
        if (editingProduct) {
            setForm({
                barcode: editingProduct.barcode || "", // ✅ โหลด barcode ถ้ามี
                name: editingProduct.name || "",
                category: editingProduct.category || "",
                price: editingProduct.price || "",
                unit: editingProduct.unit || "ชิ้น",
                qty: editingProduct.stockQty || "",
                description: editingProduct.description || "",
                productType: editingProduct.type || "standard",
                serialList: editingProduct.serialList || [""],
                optionGroups: editingProduct.optionGroups || [],
                hasOptions: Array.isArray(editingProduct.optionGroups) && editingProduct.optionGroups.length > 0,
            });
        }
    }, [editingProduct]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // toggle hasOptions
    const toggleHasOptions = (checked) => {
        if (!checked) {
            setForm({ ...form, hasOptions: false, optionGroups: [] });
        } else {
            setForm({
                ...form, hasOptions: true, optionGroups: form.optionGroups?.length ? form.optionGroups : [
                    { name: "", selectionType: "single", required: false, maxSelections: "", choices: [{ label: "", priceDelta: "", isDefault: false }] }
                ]
            });
        }
    };

    const handleSerialChange = (index, value) => {
        const newSerials = [...form.serialList];
        newSerials[index] = value;
        setForm({ ...form, serialList: newSerials });
    };

    // --- Option Groups Handlers ---
    const addOptionGroup = () => {
        const newGroups = [
            ...form.optionGroups,
            {
                name: "",
                selectionType: "single",
                required: false,
                maxSelections: "",
                choices: [{ label: "", priceDelta: "", isDefault: false }],
            },
        ];
        setForm({ ...form, optionGroups: newGroups });
    };

    const removeOptionGroup = (groupIndex) => {
        const newGroups = [...form.optionGroups];
        newGroups.splice(groupIndex, 1);
        setForm({ ...form, optionGroups: newGroups });
    };

    const handleOptionGroupChange = (groupIndex, field, value) => {
        const newGroups = [...form.optionGroups];
        newGroups[groupIndex][field] = value;
        setForm({ ...form, optionGroups: newGroups });
    };

    const addChoice = (groupIndex) => {
        const newGroups = [...form.optionGroups];
        newGroups[groupIndex].choices.push({ label: "", priceDelta: "", isDefault: false });
        setForm({ ...form, optionGroups: newGroups });
    };

    const removeChoice = (groupIndex, choiceIndex) => {
        const newGroups = [...form.optionGroups];
        newGroups[groupIndex].choices.splice(choiceIndex, 1);
        setForm({ ...form, optionGroups: newGroups });
    };

    const handleChoiceChange = (groupIndex, choiceIndex, field, value) => {
        const newGroups = [...form.optionGroups];
        newGroups[groupIndex].choices[choiceIndex][field] = value;
        setForm({ ...form, optionGroups: newGroups });
    };

    const addSerialField = () => {
        setForm({ ...form, serialList: [...form.serialList, ""] });
    };

    const removeSerialField = (index) => {
        const newSerials = [...form.serialList];
        newSerials.splice(index, 1);
        setForm({ ...form, serialList: newSerials });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            const headers = { Authorization: `Bearer ${token}` };

            const payload = {
                storeId,
                barcode: form.barcode || "", // ✅ ส่ง barcode ไป backend ด้วย
                name: form.name,
                category: form.category,
                price: Number(form.price),
                unit: form.unit,
                stockQty: form.productType === "serialized" ? undefined : Number(form.qty),
                description: form.description,
                type: form.productType,
                serialList:
                    form.productType === "serialized"
                        ? form.serialList.filter((s) => s)
                        : undefined,
                optionGroups: form.hasOptions && Array.isArray(form.optionGroups)
                    ? form.optionGroups
                        .filter((g) => g && g.name && Array.isArray(g.choices) && g.choices.length)
                        .map((g) => ({
                            name: g.name,
                            selectionType: g.selectionType || "single",
                            required: Boolean(g.required),
                            maxSelections:
                                g.selectionType === "multiple" && g.maxSelections !== ""
                                    ? Number(g.maxSelections)
                                    : undefined,
                            choices: g.choices
                                .filter((c) => c && c.label)
                                .map((c) => ({
                                    label: c.label,
                                    priceDelta: c.priceDelta === "" || c.priceDelta == null ? 0 : Number(c.priceDelta),
                                    isDefault: Boolean(c.isDefault),
                                })),
                        }))
                    : [],
            };

            if (editingProduct) {
                await axios.put(`${API_BASE_URL}/products/${editingProduct._id}`, payload, { headers });
                alert("✅ บันทึกการแก้ไขเรียบร้อย");
            } else {
                await axios.post(`${API_BASE_URL}/products/create/${storeId}`, payload, { headers });
                alert("✅ เพิ่มข้อมูลเรียบร้อย");
            }

            onSuccess();
            onClose();
        } catch (err) {
            console.error("❌ Error saving product:", err);
            alert("เกิดข้อผิดพลาดในการบันทึก");
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6 relative overflow-y-auto max-h-[90vh]">
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 text-slate-500 hover:text-slate-700"
                >
                    <X size={22} />
                </button>

                <h2 className="text-xl font-semibold text-[#3674B5] mb-5 text-center">
                    {editingProduct ? "แก้ไข" : "เพิ่ม"}{" "}
                    {type === "menu"
                        ? "เมนูอาหาร"
                        : type === "service"
                            ? "บริการ"
                            : "สินค้า"}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* ✅ รหัสสินค้า (Barcode) */}
                    <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1">
                            รหัสสินค้า (Barcode)
                        </label>
                        <input
                            type="text"
                            name="barcode"
                            placeholder="เช่น 8857123456789"
                            value={form.barcode}
                            onChange={handleChange}
                            className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#3674B5]"
                        />
                    </div>

                    {/* 🔹 ชื่อและหมวด */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-600 mb-1">
                                ชื่อสินค้า
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                required
                                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#3674B5]"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-600 mb-1">
                                หมวดหมู่
                            </label>
                            <input
                                type="text"
                                name="category"
                                value={form.category}
                                onChange={handleChange}
                                className="w-full border border-slate-300 rounded-lg px-3 py-2"
                            />
                        </div>
                    </div>

                    {/* 🔹 หน่วยและจำนวน */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-600 mb-1">
                                หน่วย (Unit)
                            </label>
                            <input
                                type="text"
                                name="unit"
                                value={form.unit}
                                onChange={handleChange}
                                className="w-full border border-slate-300 rounded-lg px-3 py-2"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-600 mb-1">
                                จำนวนคงเหลือ (Qty)
                            </label>
                            {form.productType === "serialized" ? (
                                <input
                                    type="number"
                                    name="qty"
                                    value={(Array.isArray(editingProduct?.serialList) ? editingProduct.serialList.filter((s) => s.status === "available").length : 0)}
                                    disabled
                                    className="w-full border border-slate-300 rounded-lg px-3 py-2 bg-slate-100 text-slate-500"
                                />
                            ) : (
                                <input
                                    type="number"
                                    name="qty"
                                    value={form.qty}
                                    onChange={handleChange}
                                    className="w-full border border-slate-300 rounded-lg px-3 py-2"
                                />
                            )}
                        </div>
                    </div>

                    {/* 🔹 ประเภทสินค้า */}
                    <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1">
                            ประเภทสินค้า
                        </label>
                        <select
                            name="productType"
                            value={form.productType}
                            onChange={handleChange}
                            className="w-full border border-slate-300 rounded-lg px-3 py-2"
                        >
                            <option value="standard">ทั่วไป</option>
                            <option value="serialized">มี Serial Number (SN)</option>
                        </select>
                    </div>

                    {/* 🔹 ราคา */}
                    <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1">
                            ราคาเริ่มต้น (บาท)
                        </label>
                        <input
                            type="number"
                            name="price"
                            value={form.price}
                            onChange={handleChange}
                            className="w-full border border-slate-300 rounded-lg px-3 py-2"
                            required
                        />
                    </div>

                    {/* 🔹 สวิตช์: สินค้าหลายตัวเลือก */}
                    <div className="bg-slate-50 rounded-lg p-3">
                        <label className="flex items-center gap-3 cursor-pointer select-none">
                            <input
                                type="checkbox"
                                checked={!!form.hasOptions}
                                onChange={(e) => toggleHasOptions(e.target.checked)}
                            />
                            <span className="text-slate-800 font-medium">สินค้าหลายตัวเลือก (เปิด/ปิด)</span>
                        </label>
                    </div>

                    {/* 🔹 กลุ่มออฟชันสินค้า (รวมตัวเลือก/ออฟชัน) */}
                    {form.hasOptions && (
                        <div className="bg-slate-50 rounded-lg p-3">
                            <div className="flex justify-between items-center mb-2">
                                <p className="text-slate-700 font-medium">ตัวเลือก/ออฟชันสินค้า (เช่น ความหวาน, ท็อปปิ้ง)</p>
                                <button
                                    type="button"
                                    onClick={addOptionGroup}
                                    className="text-[#3674B5] flex items-center gap-1 hover:underline"
                                >
                                    <PlusCircle size={16} /> เพิ่มกลุ่มออฟชัน
                                </button>
                            </div>

                            {form.optionGroups.map((g, gi) => (
                                <div key={gi} className="border border-slate-200 rounded-lg p-3 mb-3">
                                    <div className="grid grid-cols-2 gap-3 mb-3">
                                        <div>
                                            <label className="block text-xs text-slate-600 mb-1">ชื่อกลุ่ม</label>
                                            <input
                                                type="text"
                                                value={g.name}
                                                onChange={(e) => handleOptionGroupChange(gi, "name", e.target.value)}
                                                className="w-full border border-slate-300 rounded-lg px-3 py-2"
                                                placeholder="เช่น ความหวาน / ท็อปปิ้ง"
                                            />
                                        </div>
                                        <div className="grid grid-cols-3 gap-2 items-end">
                                            <div>
                                                <label className="block text-xs text-slate-600 mb-1">รูปแบบเลือก</label>
                                                <select
                                                    value={g.selectionType}
                                                    onChange={(e) => handleOptionGroupChange(gi, "selectionType", e.target.value)}
                                                    className="w-full border border-slate-300 rounded-lg px-3 py-2"
                                                >
                                                    <option value="single">เลือกได้ 1</option>
                                                    <option value="multiple">เลือกได้หลาย</option>
                                                </select>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    id={`required-${gi}`}
                                                    type="checkbox"
                                                    checked={!!g.required}
                                                    onChange={(e) => handleOptionGroupChange(gi, "required", e.target.checked)}
                                                />
                                                <label htmlFor={`required-${gi}`} className="text-sm">บังคับเลือก</label>
                                            </div>
                                            {g.selectionType === "multiple" && (
                                                <div>
                                                    <label className="block text-xs text-slate-600 mb-1">เลือกได้สูงสุด</label>
                                                    <input
                                                        type="number"
                                                        value={g.maxSelections}
                                                        onChange={(e) => handleOptionGroupChange(gi, "maxSelections", e.target.value)}
                                                        className="w-full border border-slate-300 rounded-lg px-3 py-2"
                                                        placeholder="เช่น 3"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Choices */}
                                    <div className="flex justify-between items-center mb-2">
                                        <p className="text-slate-700">รายการตัวเลือก</p>
                                        <button
                                            type="button"
                                            onClick={() => addChoice(gi)}
                                            className="text-[#3674B5] flex items-center gap-1 hover:underline"
                                        >
                                            <PlusCircle size={16} /> เพิ่มตัวเลือก
                                        </button>
                                    </div>
                                    {g.choices?.map((c, ci) => (
                                        <div key={ci} className="grid grid-cols-3 gap-2 mb-2 items-center">
                                            <input
                                                type="text"
                                                placeholder="เช่น ไม่หวาน / หวานน้อย / ไข่มุก"
                                                value={c.label}
                                                onChange={(e) => handleChoiceChange(gi, ci, "label", e.target.value)}
                                                className="border border-slate-300 rounded-lg px-3 py-2"
                                            />
                                            <input
                                                type="number"
                                                placeholder="+ราคาเพิ่ม (ถ้ามี)"
                                                value={c.priceDelta}
                                                onChange={(e) => handleChoiceChange(gi, ci, "priceDelta", e.target.value)}
                                                className="border border-slate-300 rounded-lg px-3 py-2"
                                            />
                                            <div className="flex items-center gap-3">
                                                <label className="flex items-center gap-2 text-sm">
                                                    <input
                                                        type="checkbox"
                                                        checked={!!c.isDefault}
                                                        onChange={(e) => handleChoiceChange(gi, ci, "isDefault", e.target.checked)}
                                                    />
                                                    ค่าเริ่มต้น
                                                </label>
                                                <button
                                                    type="button"
                                                    onClick={() => removeChoice(gi, ci)}
                                                    className="text-red-500"
                                                >
                                                    <Trash size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}

                                    <div className="flex justify-end mt-2">
                                        <button
                                            type="button"
                                            onClick={() => removeOptionGroup(gi)}
                                            className="text-red-600 hover:underline"
                                        >
                                            ลบกลุ่มนี้
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* 🔹 Serial Number (เฉพาะถ้าเลือกแบบ SN) */}
                    {form.productType === "serialized" && (
                        <div className="bg-slate-50 rounded-lg p-3">
                            <div className="flex justify-between items-center mb-2">
                                <p className="text-slate-700 font-medium">Serial Numbers</p>
                                <button
                                    type="button"
                                    onClick={addSerialField}
                                    className="text-[#3674B5] flex items-center gap-1 hover:underline"
                                >
                                    <PlusCircle size={16} /> เพิ่ม Serial
                                </button>
                            </div>

                            {form.serialList.map((s, i) => (
                                <div key={i} className="flex gap-2 mb-2">
                                    <input
                                        type="text"
                                        placeholder="Serial Number"
                                        value={s}
                                        onChange={(e) => handleSerialChange(i, e.target.value)}
                                        className="border border-slate-300 rounded-lg px-3 py-2 w-full"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeSerialField(i)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <Trash size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* 🔹 รายละเอียดเพิ่มเติม */}
                    <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1">
                            รายละเอียด
                        </label>
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            className="w-full border border-slate-300 rounded-lg px-3 py-2 h-20"
                        ></textarea>
                    </div>

                    <div className="flex justify-end gap-3 mt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg"
                        >
                            ยกเลิก
                        </button>
                        <button
                            type="submit"
                            className="px-5 py-2 bg-[#3674B5] hover:bg-[#2f5fa0] text-white rounded-lg font-medium shadow-md"
                        >
                            {editingProduct ? "บันทึกการแก้ไข" : "เพิ่มสินค้า"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
