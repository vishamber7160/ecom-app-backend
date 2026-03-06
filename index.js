import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import helmet from "helmet"
import morgan from "morgan"

dotenv.config() // configure dotenv file

const server = express()
const port = process.env.PORT || 3100


server.use(helmet())
server.use(morgan("combined"))
server.use(express.json())

server.use(cors({
    origin:"*",
    methods:["GET","POST","PUT","DELETE"],
    allowedHeaders:["Content-Type", "Authorization"]
}))
server.use(express.urlencoded({extended:true}))

server.use((err,req,res,next)=>{
    console.log(err)
    res.status(500).send({
        massage:"Internal server error"
    })
})

server.get("/health",(req,res)=>{
    res.status(200).json({
        health:"ok",
        message:"I am ok"
    })
})

server.listen(port,()=>{
    console.log(`Server is Running On Port ${port}`)
})