import mongoose from "mongoose";
import dotenv from "dotenv"

dotenv.config()

const mongodb_uri= process.env.MONGODB_URI
const dbName = "ecom"

async function dbConnection(){
    try {
        let response=await mongoose.connect(`${mongodb_uri}/${dbName}`)
        if(response){
            console.log("Data Base Connect succesfully")
        }
    } catch (error) {
        console.log(error)
    }
}

export default dbConnection;