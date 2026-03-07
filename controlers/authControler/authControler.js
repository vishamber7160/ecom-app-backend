import User from "../../models/userModel.js"
import { signupSchema,loginSchema } from "../../schemaValidator/authValidater.js"

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
                message: validatedData.error.errors[0].message
            })
        }

        const { username, email, password, mobile, role } = validatedData.data
        console.log({ username, email, password, mobile, role })

        const existingUser = await User.findOne({
            $or: [{ email }, { mobile }]
        })

        if (existingUser) {
            return res.status(400).json({
                status: "error",
                message: "User with this email or mobile already exists"
            })
        }

        const user = await User.create({
            username,
            email,
            password,
            mobile,
            role
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


        if (error.name === "ZodError") {
            return res.status(400).json({
                status: "error",
                message: error.errors[0].message
            })
        }

        console.error(error)

        return res.status(500).json({
            status: "error",
            message: "Internal Server Error"
        })
    }
}

async function userUpdateController(req, res, next) {
    try {
        res.status(200).json({
            status: "success",
            message: "Api Running"
        })
    } catch (error) {
        console.log(error)
    }
}

async function userDeleteController(req, res, next) {
    try {
        res.status(200).json({
            status: "success",
            message: "Api Running"
        })
    } catch (error) {
        console.log(error)
    }
}


export { loginController, signupController, userUpdateController, userDeleteController }