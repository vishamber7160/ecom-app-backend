import mongoose from "mongoose"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const userSchema = new mongoose.Schema({

    username: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },

    password: {
        type: String,
        required: true,
        select: false
    },

    mobile: {
        type: String,
        required: true,
        unique: true,
        match: /^[0-9]{10}$/
    },

    status: {
        type: String,
        enum: ["active", "blocked"],
        default: "active"
    },

    isEmailVerified: {
        type: Boolean,
        default: false
    },

    lastLogin: {
        type: Date
    },

    isDeleted: {
        type: Boolean,
        default: false
    },
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cart"
    },

    address: {
        landmark: String,
        localAddress: String,
        city: String,
        state: String,
        pincode: String,
        country: String,
        addressLine: String,
        isDefault: {
            type: Boolean,
            default: true
        }
    },
    secondryAddress: {
        landmark: String,
        localAddress: String,
        city: String,
        state: String,
        pincode: String,
        country: String,
        addressLine: String,
        isDefault: {
            type: Boolean,
            default: false
        }
    },
    otp: {
        code: String,
        expiresAt: Date
    },
    isMobileVerified: {
        type: Boolean,
        default: false
    }

}, {
    timestamps: true
    
})

userSchema.pre("save", async function () {

    if (!this.isModified("password")) return

    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password)
}

userSchema.methods.generateJWT = function () {
    return jwt.sign(
        { id: this._id, role: this.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE }
    )
}

export default mongoose.model("User", userSchema)