import express from "express"
import { 
    loginController, 
    signupController,
    userUpdateController,
    userDeleteController,
    getAllusers,
    forgotPassword,
    otpVerify,
    resetPassword
} from "../authControler/authControler.js"

const authRoute = express.Router()

authRoute.post('/login',loginController);
authRoute.post('/signup',signupController);
authRoute.put('/User-update/:id',userUpdateController);
authRoute.delete('/User-delete/:id',userDeleteController);
authRoute.get('/users',getAllusers)
authRoute.post("/forgot-password", forgotPassword);
authRoute.post("/otp-verification", otpVerify)
authRoute.post("/reset-password", resetPassword);


export default authRoute;