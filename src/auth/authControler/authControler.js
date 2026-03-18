import User from "../models/userModel.js"
import { signupSchema, loginSchema, updateUserSchema } from "../schemaValidator/authValidater.js"
import { otpGenerator } from "../../utils/otpGenrator.js"
import mongoose from "mongoose"
import { emailSender } from "../../utils/emailSender.js"

const loginController = async (req, res) => {
  try {
    const validatedData = loginSchema.safeParse(req.body);

    if (!validatedData.success) {
      return res.status(400).json({
        status: "error",
        message: validatedData.error.errors[0].message,
      });
    }

    const { email, password } = validatedData.data;

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(400).json({
        status: "error",
        message: "Invalid email or password",
      });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(400).json({
        status: "error",
        message: "Invalid email or password",
      });
    }

    // 🚫 Prevent OTP spam
    if (user.otpExpire && user.otpExpire > Date.now()) {
      return res.status(429).json({
        status: "fail",
        message: "OTP already sent. Try again after 5 minutes",
      });
    }

    // ✅ Generate OTP
    const otp = otpGenerator();


    user.otp = otp;
    user.otpExpire = Date.now() + 5 * 60 * 1000;

    await user.save();

    // ✅ Send Email
    const response = await emailSender(
      user.email,
      "Your OTP Code",
      `Your OTP is ${otp}. It will expire in 5 minutes.`
    );

    if (!response?.accepted?.length) {
      return res.status(500).json({
        status: "fail",
        message: "Failed to send OTP",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "OTP sent successfully",
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};


const otpVerify = async (req, res) => {
    try {
        const { otp, email } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                status: "fail",
                message: "User not found",
            });
        }

        // ✅ Validate OTP + Expiry
        if (
            user.otp !== otp ||
            user.otpExpire < Date.now()
        ) {
            return res.status(400).json({
                status: "fail",
                message: "Invalid or expired OTP",
            });
        }

        // ✅ Clear OTP after use
        user.otp = undefined;
        user.otpExpire = undefined;

        await user.save();

        // ✅ Generate token AFTER verification
        const token = user.generateJWT();

        return res.status(200).json({
            status: "success",
            message: "Login successful",
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                mobile: user.mobile,
                role: user.role,
            },
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: "error",
            message: "Internal Server Error",
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

async function getAllusers(req, res) {
    try {
        // getAllusers
        const users = await User.find({ isDeleted: false }).select("-password -otp");

        res.status(200).json({
            status: "success",
            message: "Users retrieved successfully",
            data: users
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: "error",
            message: "Internal Server Error"
        });
    }
}


async function forgotPassword(req, res) {
    try {
        const email = req.body.email
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({
                status: "Error",
                massage: "User Not exist"
            })
        }

        const otp = otpGenerator()
        await User.findOneAndUpdate({
            email,
            $or: { otp }
        })

    } catch (error) {

    }
}


export { loginController, signupController, userUpdateController, userDeleteController, getAllusers, otpVerify, forgotPassword }