import Sales from "../models/salesModel.js";
import Product from "../models/productModel.js";
import mongoose from "mongoose";

export const getDashboardReport = async (req, res, next) => {
  try {
    const { storeId } = req.params;

    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

    // Total Sales Today
    const totalSalesToday = await Sales.aggregate([
      { $match: { storeId: new mongoose.Types.ObjectId(storeId), saleDate: { $gte: startOfDay, $lte: endOfDay } } },
      { $group: { _id: null, total: { $sum: "$netTotal" } } }
    ]);

    // Total Sales This Month
    const totalSalesThisMonth = await Sales.aggregate([
      { $match: { storeId: new mongoose.Types.ObjectId(storeId), saleDate: { $gte: startOfMonth, $lte: endOfMonth } } },
      { $group: { _id: null, total: { $sum: "$netTotal" } } }
    ]);

    // Total Transactions Today
    const totalTransactions = await Sales.countDocuments({
      storeId,
      saleDate: { $gte: startOfDay, $lte: endOfDay }
    });

    // Top Products (ยอดขายรวม)
    const topProducts = await Sales.aggregate([
      { $match: { storeId: new mongoose.Types.ObjectId(storeId) } },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.productId",
          name: { $first: "$items.name" },
          totalQuantity: { $sum: "$items.quantity" },
          totalRevenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } }
        }
      },
      { $sort: { totalRevenue: -1 } },
      { $limit: 10 }
    ]);

    // Stock Alert (stock ต่ำกว่า 10)
    const stockAlert = await Product.find({
      storeId,
      stock: { $lte: 10 }
    }).select("name stock");

    res.json({
      totalSalesToday: totalSalesToday[0]?.total || 0,
      totalSalesThisMonth: totalSalesThisMonth[0]?.total || 0,
      totalTransactions,
      topProducts,
      stockAlert
    });

  } catch (error) {
    next(error);
  }
};
