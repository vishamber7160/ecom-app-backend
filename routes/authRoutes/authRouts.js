import express from "express"
import { 
    loginController, 
    signupController,
    userUpdateController,
    userDeleteController 
} from "../../controlers/authControler/authControler.js"

const authRoute = express.Router()

authRoute.post('/login',loginController);
authRoute.post('/signup',signupController);
authRoute.put('/UserUpdate',userUpdateController);
authRoute.delete('/userDelete',userDeleteController);


export default authRoute;