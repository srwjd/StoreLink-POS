 import express from "express";
 import { getProducts, getProductById, deleteProduct, updateProduct, createProduct, createProductReview } from "../controllers/productController.js";

 const router = express.Router();

 router.get("/", getProducts);
 router.get("/:id", getProductById);
 router.delete("/:id", deleteProduct);
 router.put("/:id", updateProduct);
 router.post("/", createProduct);
 router.post("/:id/reviews", createProductReview);

export default router