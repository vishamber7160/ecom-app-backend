import mongoose from "mongoose";
import bcrypt from "bcrypt";

const sellerSchema = new mongoose.Schema(
{
    storeName: {
        type: String,
        required: true,
        trim: true
    },

    storeSlug: {
        type: String,
        unique: true,
        trim: true
    },


    imageProfile: String,

    phone: {
        type: String,
        required: true,
        unique: true
    },

    email: {
        type: String,
        unique: true
    },

    password: {
        type: String,
        required: true,
        minlength: 6
    },

    address: {
        country: String,
        state: String,
        city: String,
        pincode: String,
        fullAddress: String
    },

    gstNumber: String,

    panNumber: String,

    bankDetails: {
        accountHolderName: String,
        accountNumber: String,
        ifscCode: String,
        bankName: String
    },

    rating: {
        type: Number,
        default: 0
    },

    totalProducts: {
        type: Number,
        default: 0
    },

    totalSales: {
        type: Number,
        default: 0
    },

    status: {
        type: String,
        enum: ["pending", "approved", "rejected", "blocked"],
        default: "pending"
    },

    isDeleted: {
        type: Boolean,
        default: false
    }

},
{ timestamps: true }
);


// Password Hash
sellerSchema.pre("save", async function () {

    if (!this.isModified("password")) return next();

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

sellerSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

const Seller = mongoose.model("Seller", sellerSchema);

export default Seller;