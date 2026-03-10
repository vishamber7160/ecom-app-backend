import express from "express";
import { getAllSellers,addSeller,getSellerById,updateSellerById, deleteSellerByID } from "../controller/sallerController";

const sallerAdminRouter = express.Router();

sallerAdminRouter.get("/all-sellers", getAllSellers);
sallerAdminRouter.post("/add-seller", addSeller);
sallerAdminRouter.get("/seller/:id", getSellerById);
sallerAdminRouter.put("/update-seller/:id", updateSellerById );
sallerAdminRouter.delete("/delete-seller/:id", deleteSellerByID );

export default sallerAdminRouter;