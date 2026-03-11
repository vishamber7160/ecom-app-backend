import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import helmet from "helmet"
import morgan from "morgan"
import rateLimit from "express-rate-limit"
import dbConnection from "./src/dbconfig/dbConfig.js"
import authRoute from "./src/auth/authRoutes/authRouts.js"
import productRoute from "./src/product/routes/productRoutes.js"
import sallerAdminRouter from "./src/saller_admin/routes/routes.js"

dotenv.config() // configure dotenv file

const server = express()
const port = process.env.PORT || 3100


server.use(helmet())
server.use(morgan("combined"))
server.use(express.json())

server.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE","PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"]
}))
server.use(express.urlencoded({ extended: true }))

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
})

server.use(limiter)

server.get("/health", (req, res) => {
    res.status(200).json({
        health: "ok",
        message: "I am ok"
    })
})


server.use((err, req, res, next) => {
    console.log(err)
    res.status(500).send({
        message: "Internal server error"
    })
})
server.use('/auth',authRoute);
server.use('/products', productRoute);
server.use('/saller-admin', sallerAdminRouter);

const startserver = async () => {
    try {
        await dbConnection()
        server.listen(port, () => {
            console.log(`Server is Running On Port ${port}`)
        })

    } catch (error) {
      console.log(`Connection Error:${error}`)
    }
}

startserver();


