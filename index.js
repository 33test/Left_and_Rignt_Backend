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

// WebSocket 連接處理
wss.on("connection", (ws) => {
  console.log("新的 WebSocket 連接")
  clients.add(ws)

  ws.on("message", async (message) => {
    try {
      const parsedMessage = JSON.parse(message)
      console.log("收到消息:", parsedMessage)

      switch (parsedMessage.type) {
        case "cartUpdate":
          // 廣播給同一個購物車的其他用戶
          const { groupId } = parsedMessage.data
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
          // 同樣根據 groupId 廣播
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
