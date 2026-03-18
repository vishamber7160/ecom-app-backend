import express from "express";
import { getAllSellers,addSeller,getSellerById,updateSellerById, deleteSellerByID,sellerLogin } from "../controller/sallerController.js";

const sallerAdminRouter = express.Router();

sallerAdminRouter.get("/all-sellers", getAllSellers);
sallerAdminRouter.post("/seller-register", addSeller);
sallerAdminRouter.get("/seller/:id", getSellerById);
sallerAdminRouter.patch("/update-seller/:id", updateSellerById );
sallerAdminRouter.delete("/delete-seller/:id", deleteSellerByID );
sallerAdminRouter.post("/login", sellerLogin);

export default sallerAdminRouter;


// /saller-admin/login