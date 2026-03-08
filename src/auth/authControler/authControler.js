import User from "../models/userModel.js"
import { signupSchema, loginSchema, updateUserSchema } from "../schemaValidator/authValidater.js"
import { otpGenerator } from "../../utils/otpGenrator.js"
import mongoose from "mongoose"

const loginController = async (req, res, next) => {
    try {
        // Validate Request
        const validatedData = loginSchema.safeParse(req.body);

        if (!validatedData.success) {
            return res.status(400).json({
                status: "error",
                message: validatedData.error.errors[0].message
            });
        }

        const { email, password } = validatedData.data;

        // Check User exist or not
        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            return res.status(400).json({
                status: "error",
                message: "Invalid email or password"
            });
        }

        // ✅ Compare Password
        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(400).json({
                status: "error",
                message: "Invalid email or password"
            });
        }

        // ✅ Generate JWT Token
        const token = user.generateJWT()

        // ✅ Response
        res.status(200).json({
            status: "success",
            message: "Login successful",
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                mobile: user.mobile,
                role: user.role
            }
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            status: "error",
            message: "Internal Server Error"
        });
    }
};


const signupController = async (req, res, next) => {
    try {

        const validatedData = signupSchema.safeParse(req.body)
        if (!validatedData.success) {
            return res.status(400).json({
                status: "error",
                message: validatedData.error.issues[0].message
            })
        }

        const { username, email, password, mobile, role } = validatedData.data

        const existingUser = await User.findOne({
            $or: [{ email }, { mobile }]
        })

        if (existingUser) {
            return res.status(400).json({
                status: "error",
                message: "User with this email or mobile already exists"
            })
        }

        const otp = otpGenerator()
        const user = await User.create({
            username,
            email,
            password,
            mobile,
            role,
            otp: {
                code: otp,
                expiresAt: new Date(Date.now() + 10 * 60 * 1000)
            }
        })

        const userResponse = {
            id: user._id,
            username: user.username,
            email: user.email,
            mobile: user.mobile,
            role: user.role
        }

        res.status(201).json({
            status: "success",
            message: "User created successfully",
            data: userResponse
        })

    } catch (error) {

        console.log(error)
        if (error.name === "ZodError") {
            return res.status(400).json({
                status: "error",
                message: error.issues[0].message
            })
        }

        return res.status(500).json({
            status: "error",
            message: "Internal Server Error"
        })
    }
}

async function userUpdateController(req, res, next) {
    try {
        const { id } = req.params
        console.log(id)
        console.log(req.body)
        const validatedData = updateUserSchema.safeParse(req.body)
        console.log(validatedData)
        if (!validatedData.success) {
            return res.status(400).json({
                status: "error",
                message: validatedData.error.issues[0].message
            })
        }
        if (validatedData.data.mobile) {

            const existingUser = await User.findOne({
                mobile: validatedData.data.mobile,
                _id: { $ne: id }
            })

            if (existingUser) {
                return res.status(400).json({
                    status: "error",
                    message: "Mobile number already exists"
                })
            }
        }
        const user = await User.findByIdAndUpdate(id, validatedData.data, { returnDocument: "after" })
        if (!user) {
            return res.status(404).json({
                status: "error",
                message: "User not found"
            })
        }
        res.status(200).json({
            status: "success",
            message: "User updated successfully",
            data: user
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            status: "error",
            message: "Internal Server Error"
        })
    }
}

async function userDeleteController(req, res) {
    try {

        const { id } = req.params;

        // Validate MongoDB ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                status: "error",
                message: "Invalid user id"
            });
        }

        const user = await User.findByIdAndUpdate(
            id,
            { isDeleted: true },
            { returnDocument: "after" }
        );

        if (!user) {
            return res.status(404).json({
                status: "error",
                message: "User not found"
            });
        }

        res.status(200).json({
            status: "success",
            message: "User deleted successfully"
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            status: "error",
            message: "Internal Server Error"
        });
    }
}


export { loginController, signupController, userUpdateController, userDeleteController }