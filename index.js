import dotenv from "dotenv"
dotenv.config()
import express from "express"
import cors from "cors"
import path from "path"
import { fileURLToPath } from "url"
import { dirname } from "path"
import http from "http"
import { WebSocketServer, WebSocket } from "ws"
import productsRouter from "./src/routes/productsList.js"
import registerLoginRouter from "./src/routes/registerLogin.js"
import productDetailRouter from "./src/routes/productDetail.js"
import googleAuthRouter from "./src/routes/googleAuth.js"
import cartRouter from "./src/routes/cart.js"
import couponRouter from "./src/routes/coupon.js"
import debitRouter from "./src/routes/debit.js"
import sharedCart from "./src/routes/sharedCart.js"
import exchangeRate from "./src/routes/exchangeRate.js"
import searchRouter from "./src/routes/search.js"
import categoryRouter from "./src/routes/category.js"

import orderRouter from "./src/routes/order.js"
import commentRouter from "./src/routes/productComment.js"
import wishlistRouter from "./src/routes/wishlists.js"
const app = express()

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["POST", "GET", "OPTIONS", "DELETE", "PUT"],
    credentials: true,
  })
)

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
app.use("/exchangeRate", exchangeRate)
app.use("/search", searchRouter)
app.use("/sidebarCategory", categoryRouter)

const PORT = 3300
// 改用 server.listen
server.listen(PORT, () => {
  console.log(`server running on port ${PORT}`)
})
