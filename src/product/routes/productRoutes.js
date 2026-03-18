import express from "express";
import { addNewProduct } from "../contoller/productController.js";
import upload from "../../middleware/upload.js";
const router = express.Router();


router.post("/add-product", upload.array("images"), addNewProduct);

export default router;
