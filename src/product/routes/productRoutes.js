import express from "express";
import { addNewProduct } from "../contoller/productController.js";
const router = express.Router();


router.post("/add-product", addNewProduct);

export default router;
