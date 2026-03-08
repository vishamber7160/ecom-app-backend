import express from "express"
import { 
    loginController, 
    signupController,
    userUpdateController,
    userDeleteController 
} from "../authControler/authControler.js"

const authRoute = express.Router()

authRoute.post('/login',loginController);
authRoute.post('/signup',signupController);
authRoute.put('/User-update/:id',userUpdateController);
authRoute.delete('/User-delete/:id',userDeleteController);


export default authRoute;