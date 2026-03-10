import express from "express";
import { getAllSellers,addSeller,getSellerById,updateSellerById, deleteSellerByID,sellerLogin } from "../controller/sallerController.js";

const sallerAdminRouter = express.Router();

sallerAdminRouter.get("/all-sellers", getAllSellers);
sallerAdminRouter.post("/add-seller", addSeller);
sallerAdminRouter.get("/seller/:id", getSellerById);
sallerAdminRouter.put("/update-seller/:id", updateSellerById );
sallerAdminRouter.delete("/delete-seller/:id", deleteSellerByID );
sallerAdminRouter.post("/login", sellerLogin);

export default sallerAdminRouter;