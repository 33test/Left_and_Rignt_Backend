import dotenv from "dotenv"
dotenv.config()
import express from "express"
import cors from "cors"
import path from "path"
import { fileURLToPath } from "url"
import { dirname } from "path"
import productsRouter from "./src/routes/productsList.js"
import registerLoginRouter from "./src/routes/registerLoginAuth.js"
import productDetailRouter from "./src/routes/productDetailAuth.js"
import googleAuthRouter from "./src/routes/googleAuth.js"
import cartRouter from "./src/routes/cart.js"
import couponRouter from "./src/routes/coupon.js"
import debitRouter from "./src/routes/debit.js"
import sharedCart from "./src/routes/sharedCart.js"

const app = express()

const allowedOrigins = process.env.CORS_ALLOW_HOST.split(",")

app.use(
	cors({
		origin: allowedOrigins,
		methods: ["POST", "GET", "OPTIONS", "DELETE", "PUT"],
		credentials: true,
	})
)

// 加入這些安全標頭，嘗試解決 CORS 問題
app.use((_req, res, next) => {
	res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups")
	res.setHeader("Cross-Origin-Embedder-Policy", "require-corp")
	next()
})

// 設定 __dirname
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
// 設定靜態檔案服務，讓前端可以來取後端 images 資料夾的檔案
app.use("/images", express.static(path.join(__dirname, "assets/images")))

app.use(express.json())
app.use("/categories", productsRouter)
app.use("/users", registerLoginRouter)
app.use("/auth", googleAuthRouter)
app.use("/products", productDetailRouter)
app.use("/cart", cartRouter)
app.use("/coupon", couponRouter)
app.use("/debit", debitRouter)
app.use("/", sharedCart)

const PORT = 3300
app.listen(PORT, () => {
	console.log(`server running on port ${PORT}`)
})
