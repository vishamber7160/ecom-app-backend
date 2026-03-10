import Seller from "../model/saller_model";
import {createSellerSchema} from "../schemaValidation/validator";

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

        res.status(200).json({
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
                errors: validation.error.errors
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

        // create seller
        const seller = new Seller({
            ...data,
            storeSlug
        });

        await seller.save();

        res.status(201).json({
            success: true,
            message: "Seller registered successfully",
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

        // Zod validation
        const validation = createSellerSchema.partial().safeParse(updateData);
        if (!validation.success) {
            return res.status(400).json({
                success: false,
                errors: validation.error.errors
            });
        }

        const updatedSeller = await Seller.findByIdAndUpdate(
            sellerId,
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

export { getAllSellers, addSeller, getSellerById, updateSellerById, deleteSellerByID };