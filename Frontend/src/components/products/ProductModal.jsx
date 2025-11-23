/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { X, PlusCircle, Trash } from "phosphor-react";
import axios from "axios";
import { useStore } from "../../context/StoreContext";
import { showError } from "../../utils/notify";
import { use } from "react";

export default function ProductModal({
    storeId,
    type,
    editingProduct,
    onClose,
    onSuccess,
}) {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    const { store } = useStore();
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState(null);
    const [file, setFile] = useState(null);
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
        productImage: "",
    });
    const [categories, setCategories] = useState([]);
    const [query, setQuery] = useState("");
    const [filtered, setFiltered] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get(`${API_BASE_URL}/products/categories/${storeId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setCategories(res.data || []);
            } catch (err) {
                console.error("Error fetching categories:", err);
            }
        };
        fetchCategories();
    }, [storeId]);

    const handleInput = (value) => {
        setQuery(value);
        setForm({ ...form, category: value });
        setFiltered(
            categories.filter((c) =>
                c.toLowerCase().includes(value.toLowerCase())
            )
        );
        setShowDropdown(true);
    };

    const handleSelect = (value) => {
        setForm({ ...form, category: value });
        setQuery(value);
        setShowDropdown(false);
    };

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
                productImage: editingProduct.productImage || "",
            });
            setPreview(editingProduct.productImage);
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

    // 📸 พรีวิวรูปทันทีที่เลือก
    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // สร้างพรีวิวทันทีจากเครื่อง (ยังไม่อัปโหลด)
        const localPreview = URL.createObjectURL(file);
        setPreview(localPreview);

        // ตรวจสอบชนิดและขนาดไฟล์ก่อนอัปโหลด
        if (!["image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
            showError("กรุณาอัปโหลดไฟล์ JPG หรือ PNG เท่านั้น");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            showError("ขนาดไฟล์ต้องไม่เกิน 5MB");
            return;
        }

        setUploading(true);
        try {
            const token = localStorage.getItem("token");
            const formData = new FormData();
            formData.append("file", file);

            const res = await axios.post(`${API_BASE_URL}/upload`, formData, {
                headers: { Authorization: `Bearer ${token}` },
            });

            // เมื่ออัปโหลดเสร็จ → เซ็ต URL จริงแทน local preview
            setForm((prev) => ({ ...prev, productImage: res.data.url }));
            console.log("✅ Upload success:", res.data.url);
            setPreview(res.data.url);
            setFile(res.data.url);
        } catch (err) {
            console.error("❌ Upload error:", err);
            showError("เกิดข้อผิดพลาดในการอัปโหลดรูป");
            setPreview(null);
        } finally {
            setUploading(false);
        }
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
                productImage: form.productImage,
            };

            if (editingProduct) {
                await axios.put(`${API_BASE_URL}/products/${editingProduct._id}`, payload, { headers });

            } else {
                await axios.post(`${API_BASE_URL}/products/create/${storeId}`, payload, { headers });

            }

            onSuccess();
            onClose();
        } catch (err) {
            console.error("❌ Error saving product:", err);
            showError("เกิดข้อผิดพลาดในการบันทึก");
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-3 pt-5 pb-5 relative max-h-[90vh]">
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 text-slate-500 hover:text-slate-700"
                >
                    <X size={22} />
                </button>

                <h2 className="text-xl font-semibold text-[#3674B5] mb-5 text-center">
                    {editingProduct ? "แก้ไข" : "เพิ่ม"}
                    {type === "menu"
                        ? "เมนูอาหาร"
                        : type === "service"
                            ? "บริการ"
                            : "สินค้า"}
                </h2>

                {/* 📝 ฟอร์ม */}
                <div className="max-h-[70vh] p-3 overflow-y-auto">
                    <form onSubmit={handleSubmit} className="space-y-4">

                        {/* 📸 อัปโหลดรูปสินค้า */}
                        <div>
                            <div className="flex flex-col items-center justify-center hover:border-[#3674B5] transition">

                                {preview ? (
                                    <img
                                        src={preview}
                                        alt="Product preview"
                                        className="w-40 h-40 object-cover rounded-lg shadow-sm mb-3 border"
                                    />
                                ) : (
                                    <div className="w-40 h-40 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 text-sm mb-3">
                                        ยังไม่มีรูป
                                    </div>
                                )}

                                <label className="cursor-pointer bg-[#3674B5] text-white text-sm px-4 py-2 rounded-lg hover:bg-[#2f5fa0] active:scale-95 transition">
                                    {uploading ? "กำลังอัปโหลด..." : "เลือกรูปภาพ"}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="hidden"
                                        disabled={uploading}
                                    />
                                </label>

                                {preview && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setPreview(null);
                                            setForm((prev) => ({ ...prev, productImage: "" }));
                                        }}
                                        className="text-xs text-red-500 mt-2 hover:underline"
                                    >
                                        ลบรูปออก
                                    </button>
                                )}

                                <p className="text-xs text-slate-400 mt-1 text-center">
                                    รองรับ JPG, PNG ขนาดไม่เกิน 5MB
                                </p>
                            </div>
                        </div>

                        {/* 🔹 ประเภทสินค้า */}
                        {store?.storeType === "restaurant" || store?.storeType === "service" ? (
                            <div></div>
                        ) : (
                            <div className="flex items-center justify-between py-2 rounded-lg">
                                <label className="text-md font-medium text-slate-600">
                                    ประเภทสินค้า : {form.productType === "serialized" ? "มี Serial Number" : "ทั่วไป"}
                                </label>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={form.productType === "serialized"}
                                        onChange={(e) =>
                                            setForm({ ...form, productType: e.target.checked ? "serialized" : "standard" })
                                        }
                                    />
                                    <div className="w-11 h-6 bg-slate-300 rounded-full peer peer-checked:bg-[#3674B5] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:h-5 after:w-5 after:rounded-full after:transition-all peer-checked:after:translate-x-full"></div>
                                </label>
                            </div>
                        )}


                        {/* ✅ รหัสสินค้า (Barcode) */}
                        {store?.storeType === "restaurant" || store?.storeType === "service" ? (
                            <div></div>
                        ) : (
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
                        )}


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

                            <div className="relative">
                                <label className="block text-sm font-medium text-slate-600 mb-1">
                                    หมวดหมู่
                                </label>
                                <input
                                    type="text"
                                    placeholder="ค้นหาหรือพิมพ์ชื่อหมวดหมู่..."
                                    value={form.category}
                                    onChange={(e) => handleInput(e.target.value)}
                                    onFocus={() => setShowDropdown(true)}
                                    onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                                    className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#3674B5]"
                                />
                                {showDropdown && filtered.length > 0 && (
                                    <ul className="absolute z-50 bg-white border border-gray-200 rounded-lg mt-1 w-full max-h-48 overflow-y-auto shadow-md">
                                        {filtered.map((c, i) => (
                                            <li
                                                key={i}
                                                onClick={() => handleSelect(c)}
                                                className="px-3 py-2 hover:bg-blue-50 cursor-pointer text-slate-700"
                                            >
                                                {c}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>

                        {/* 🔹 หน่วยและจำนวน */}
                        <div className={`
                            ${store?.storeType === "service" ? "hidden" : ""}
                            ${store?.storeType === "restaurant" ? "" : "grid grid-cols-2 gap-4"} `}>
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

                            {store?.storeType === "restaurant" ? (
                                <div></div>
                            ) : (
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
                            )}

                        </div>


                        {/* 🔹 ราคา */}
                        <div>
                            <label className="block text-sm font-medium text-slate-600 mb-1">
                                {form.productType === "serialized" ? "ราคา (บาท)" : "ราคาเริ่มต้น (บาท)"}
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
                        {store?.storeType === "general" ? (
                            <div></div>
                        ) : (
                            <div className="flex items-center justify-between py-2 rounded-lg">
                                <label className="text-md font-medium text-slate-600">
                                    สินค้าหลายตัวเลือก
                                </label>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={!!form.hasOptions}
                                        onChange={(e) => toggleHasOptions(e.target.checked)}
                                    />
                                    <div className="w-11 h-6 bg-slate-300 rounded-full peer peer-checked:bg-[#3674B5] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:h-5 after:w-5 after:rounded-full after:transition-all peer-checked:after:translate-x-full"></div>
                                </label>
                            </div>
                        )}


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

                                {form.productType === "standard" ? (
                                    <div>
                                        <h3 className="font-semibold text-slate-700 mb-3">สินค้าหลายตัวเลือก</h3>
                                        {form.optionGroups.map((g, gi) => (
                                            <div
                                                key={gi}
                                                className="border border-slate-200 rounded-2xl p-5 mb-6 shadow-md bg-gradient-to-b from-white to-slate-50"
                                            >
                                                {/* 🔹 Header */}
                                                <div className="flex justify-between items-center mb-4">
                                                    <h3 className="font-semibold text-slate-700">
                                                        กลุ่มที่ {gi + 1}: {g.name || "ยังไม่ได้ตั้งชื่อ"}
                                                    </h3>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeOptionGroup(gi)}
                                                        className="text-red-500 text-sm hover:text-red-600 flex items-center gap-1"
                                                    >
                                                        <Trash size={16} /> ลบกลุ่มนี้
                                                    </button>
                                                </div>

                                                {/* 🔸 กล่องข้อมูลหลัก */}
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
                                                    <div>
                                                        <input
                                                            type="text"
                                                            value={g.name}
                                                            onChange={(e) =>
                                                                handleOptionGroupChange(gi, "name", e.target.value)
                                                            }
                                                            className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#3674B5]"
                                                            placeholder="ชื่อ เช่น ความหวาน"
                                                        />
                                                    </div>

                                                    <div>
                                                        <select
                                                            value={g.selectionType}
                                                            onChange={(e) =>
                                                                handleOptionGroupChange(gi, "selectionType", e.target.value)
                                                            }
                                                            className="w-[75%] border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#3674B5]"
                                                        >
                                                            <option value="">เลือกประเภท</option>
                                                            <option value="single">เลือกได้ 1</option>
                                                            <option value="multiple">เลือกได้หลาย</option>
                                                        </select>
                                                    </div>

                                                    <div className="flex items-center justify-between">
                                                        <label className="flex items-center gap-2 text-sm">
                                                            <input
                                                                type="checkbox"
                                                                checked={!!g.required}
                                                                onChange={(e) =>
                                                                    handleOptionGroupChange(gi, "required", e.target.checked)
                                                                }
                                                                className="accent-[#3674B5]"
                                                            />
                                                            บังคับเลือก
                                                        </label>

                                                        {g.selectionType === "multiple" && (
                                                            <input
                                                                type="number"
                                                                value={g.maxSelections}
                                                                onChange={(e) =>
                                                                    handleOptionGroupChange(gi, "maxSelections", e.target.value)
                                                                }
                                                                className="w-20 border border-slate-300 rounded-lg px-2 py-1 text-right"
                                                                placeholder="สูงสุด"
                                                            />
                                                        )}
                                                    </div>
                                                </div>

                                                <hr className="border-slate-200 my-3" />

                                                {/* 🔹 Choices list */}
                                                <div className="flex justify-between items-center mb-3">
                                                    <h4 className="font-medium text-slate-700">รายการตัวเลือก</h4>
                                                    <button
                                                        type="button"
                                                        onClick={() => addChoice(gi)}
                                                        className="text-[#3674B5] flex items-center gap-1 hover:text-[#2f5fa0]"
                                                    >
                                                        <PlusCircle size={18} /> เพิ่มตัวเลือก
                                                    </button>
                                                </div>

                                                {g.choices?.length ? (
                                                    <div className="space-y-2">
                                                        {g.choices.map((c, ci) => (
                                                            <div
                                                                key={ci}
                                                                className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center bg-white border border-slate-200 rounded-lg p-3 hover:shadow-sm transition-all"
                                                            >
                                                                <input
                                                                    type="text"
                                                                    placeholder="เช่น ไม่หวาน / หวานน้อย / ไข่มุก"
                                                                    value={c.label}
                                                                    onChange={(e) =>
                                                                        handleChoiceChange(gi, ci, "label", e.target.value)
                                                                    }
                                                                    className="border border-slate-300 rounded-lg px-3 py-2 focus:ring-1 focus:ring-[#3674B5]"
                                                                />
                                                                <input
                                                                    type="number"
                                                                    placeholder="+ราคาเพิ่ม (ถ้ามี)"
                                                                    value={c.priceDelta}
                                                                    onChange={(e) =>
                                                                        handleChoiceChange(gi, ci, "priceDelta", e.target.value)
                                                                    }
                                                                    className="border border-slate-300 rounded-lg px-3 py-2 text-right focus:ring-1 focus:ring-[#3674B5]"
                                                                />
                                                                <div className="flex items-center justify-between">
                                                                    <label className="flex items-center gap-2 text-sm">
                                                                        <input
                                                                            type="checkbox"
                                                                            checked={!!c.isDefault}
                                                                            onChange={(e) =>
                                                                                handleChoiceChange(gi, ci, "isDefault", e.target.checked)
                                                                            }
                                                                            className="accent-[#3674B5]"
                                                                        />
                                                                        ค่าเริ่มต้น
                                                                    </label>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => removeChoice(gi, ci)}
                                                                        className="text-red-500 hover:text-red-600"
                                                                    >
                                                                        <Trash size={18} />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <p className="text-center text-slate-400 text-sm my-3">
                                                        ยังไม่มีตัวเลือก
                                                    </p>
                                                )}
                                            </div>
                                        ))}
                                        <div className="mt-3 text-right">
                                            <button
                                                type="button"
                                                onClick={addOptionGroup}
                                                className="text-[#3674B5] hover:text-[#2f5fa0] flex items-center gap-1 text-sm"
                                            >
                                                <PlusCircle size={16} /> เพิ่มกลุ่มตัวเลือก
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mt-4 text-center text-[#e43030]">
                                        <p className="text-sm">
                                            สินค้าที่มี Serial Number จะไม่สามารถเพิ่มตัวเลือกเสริมได้
                                        </p>
                                    </div>
                                )}
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

                                {form.serialList
                                    .filter((s) => (typeof s === "object" ? s.status !== "sold" : true))
                                    .map((s, i) => (
                                        <div key={i} className="flex gap-2 mb-2">
                                            <input
                                                type="text"
                                                placeholder="Serial Number"
                                                value={typeof s === "object" ? s.serialNumber : s}
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
        </div>
    );
}
