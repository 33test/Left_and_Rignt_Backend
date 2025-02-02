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
import sendMail from "./src/routes/sendMail.js"

import orderRouter from "./src/routes/order.js"
import commentRouter from "./src/routes/productComment.js"
import wishlistRouter from "./src/routes/wishlists.js"
import memberInformationRouter from "./src/routes/memberInformation.js"
import updateUserInformation from "./src/routes/updateUserInformation.js"
import deliverInfoRouter from "./src/routes/deliverInfo.js"
import updateDeliverInfo from "./src/routes/updateDeliverInfomation.js"
const app = express()
// 修改 server 設定，不直接用 app.listen(自己創建 HTTP server)
const server = http.createServer(app)
const wss = new WebSocketServer({ server })
const clients = new Set()

app.use(cors())

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
app.use("/sendmail", sendMail)
app.use("/wishlist", wishlistRouter)
app.use("/order", orderRouter)
app.use("/comment", commentRouter)
app.use("/", memberInformationRouter)
app.use("/", updateUserInformation)
app.use("/", deliverInfoRouter)
app.use("/", updateDeliverInfo)

// WebSocket 連接處理
wss.on("connection", (ws) => {
  console.log("新的 WebSocket 連接")
  clients.add(ws)

  ws.on("message", async (message) => {
    try {
      const parsedMessage = JSON.parse(message)
      switch (parsedMessage.type) {
        case "cartUpdate":
          clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
              client.send(
                JSON.stringify({
                  type: "cartUpdate",
                  data: parsedMessage.data,
                })
              )
            }
          })
          break

        case "cartDelete":
          clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
              client.send(
                JSON.stringify({
                  type: "cartDelete",
                  data: parsedMessage.data,
                })
              )
            }
          })
          break

        case "addProduct":
          clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
              client.send(
                JSON.stringify({
                  type: "addProduct",
                  data: parsedMessage.data,
                })
              )
            }
          })
          break
      }
    } catch (error) {
      console.error("處理消息時出錯:", error)
    }
  })

  ws.on("close", () => {
    console.log("連接關閉")
    clients.delete(ws)
  })
})

const PORT = 3300
// 改用 server.listen
server.listen(PORT, () => {
  console.log(`server running on port ${PORT}`)
})
