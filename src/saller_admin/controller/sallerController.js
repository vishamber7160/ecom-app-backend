import Seller from "../model/saller_model.js";
import {createSellerSchema,loginValidationSchema,updateStatusValidationSchema} from "../schemaValidation/validator.js";
import jwt from "jsonwebtoken";

// Get All Sellers
const getAllSellers = async (req, res) => {
    try {

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const skip = (page - 1) * limit;

        const sellers = await Seller.find({ isDeleted: false })
            .select("-password -bankDetails.accountNumber") 
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        const total = await Seller.countDocuments({ isDeleted: false });

        res.set("Cache-Control", "no-store").status(200).json({
            success: true,
            total,
            page,
            limit,
            sellers
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });

    } finally {
        console.log("getAllSellers function executed");
    }
};

// add seller



const addSeller = async (req, res) => {
    try {

        // Zod validation
        const validation = createSellerSchema.safeParse(req.body);

        if (!validation.success) {
            return res.status(400).json({
                success: false,
                errors: validation.error.issues[0].message
            });
        }

        const data = validation.data;

        // check duplicate seller
        const existingSeller = await Seller.findOne({
            $or: [{ email: data.email }, { phone: data.phone }]
        });

        if (existingSeller) {
            return res.status(400).json({
                success: false,
                message: "Seller with this email or phone already exists"
            });
        }

        // generate slug
        const storeSlug = data.storeName
            .toLowerCase()
            .replace(/ /g, "-")
            .replace(/[^\w-]+/g, "");

        // check sulg exist
        const existingSlug = await Seller.findOne({ storeSlug });

        if (existingSlug) {
            return res.status(400).json({
                success: false,
                message: "Store name already exists, please choose a different name"
            }); 
            
        }

        // create seller
        const seller = new Seller({
            ...data,
            storeSlug
        });

        let savedSeller = await seller.save();
        savedSeller = savedSeller.toObject();
        delete savedSeller.password;
        delete savedSeller.bankDetails?.accountNumber;

        res.status(201).json({
            success: true,
            message: "Seller registered successfully",
            seller: savedSeller
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });

    }
};

// Get Seller by ID

async function getSellerById(req, res) {
    try {
        const sellerId = req.params.id;
        const seller = await Seller.findOne({ _id: sellerId, isDeleted: false }).select("-password -bankDetails.accountNumber");
        if (!seller) {
            return res.status(404).json({
                success: false,
                message: "Seller not found"
            });
        }
        res.status(200).json({
            success: true,
            seller
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// Update Seller by ID
async function updateSellerById(req, res) {
    try {
        const sellerId = req.params.id;
        const updateData = req.body;
        console.log(sellerId, updateData)

        // Zod validation
        const validation = updateStatusValidationSchema.safeParse(updateData);
        console.log(validation)
        if (!validation.success) {
            return res.status(400).json({
                success: false,
                errors: validation.error.issues[0].message
            });
        }

        const updatedSeller = await Seller.findOneAndUpdate(
            { _id: sellerId, isDeleted: false },
            { ...validation.data, updatedAt: Date.now() },
            { new: true, runValidators: true }
        ).select("-password -bankDetails.accountNumber");

        if (!updatedSeller) {
            return res.status(404).json({
                success: false,
                message: "Seller not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Seller updated successfully",
            seller: updatedSeller
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
}

// delete seller by id
async function deleteSellerByID(req,res) {
    try {
        const sellerId = req.params.id;
        const deletedSeller = await Seller.findByIdAndUpdate(
            sellerId,
            { isDeleted: true, deletedAt: Date.now() },
            { new: true }
        ).select("-password -bankDetails.accountNumber");

        if (!deletedSeller) {
            return res.status(404).json({
                success: false,
                message: "Seller not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Seller deleted successfully",
            seller: deletedSeller
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
}

// Seller login controller
async function sellerLogin(req, res) {
    try {
        const validation = loginValidationSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({
                success: false,
                errors: validation.error.issues[0].message
            });
        }
        // Validate input
        const { email, password } = validation.data;
        const seller = await Seller
            .findOne({ email, isDeleted: false })
            .select("+password");
        if (!seller) {  
            return res.status(404).json({
                success: false,
                message: "Seller not found"
            });
        }
        const isMatch = await seller.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }
        const token = jwt.sign({ id: seller._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            seller: {
                id: seller._id,
                name: seller.name,
                email: seller.email,
                storeName: seller.storeName,
                storeSlug: seller.storeSlug,
                phone: seller.phone,
                imageProfile: seller.imageProfile,
                address: seller.address,
                gstNumber: seller.gstNumber,
                panNumber: seller.panNumber,
                bankDetails: {
                    accountHolderName: seller.bankDetails.accountHolderName,
                    ifscCode: seller.bankDetails.ifscCode,
                    bankName: seller.bankDetails.bankName
                }
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }   
}


export { getAllSellers, addSeller, getSellerById, updateSellerById, deleteSellerByID, sellerLogin };