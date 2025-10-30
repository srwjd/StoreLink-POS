import Product from "../models/Product.js";

// ✅ ดึงสินค้าทั้งหมดของร้าน
export const getProducts = async (req, res) => {
  try {
    const storeId = req.query.storeId || req.params.storeId;
    const products = await Product.find(storeId ? { storeId } : {});
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ ดึงสินค้ารายตัว
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ สร้างสินค้าใหม่
export const createProduct = async (req, res) => {
  try {
    const { storeId, name, category, price, stockQty } = req.body;
    const product = new Product({
      storeId,
      name,
      category,
      price,
      stockQty,
    });
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ✅ อัปเดตสินค้า
export const updateProduct = async (req, res) => {
  try {
    const { name, category, price, stockQty, status } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    product.name = name || product.name;
    product.category = category || product.category;
    product.price = price ?? product.price;
    product.stockQty = stockQty ?? product.stockQty;
    product.status = status || product.status;

    const updated = await product.save();
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ✅ ลบสินค้า
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    await product.deleteOne();
    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ ตัวอย่าง: เพิ่มรีวิว (optional)
export const createProductReview = async (req, res) => {
  try {
    res.json({ message: "Review system not implemented yet." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

