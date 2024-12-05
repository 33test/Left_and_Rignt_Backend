const dotenv = require('dotenv')
dotenv.config()
const express = require('express')
const app = express()
const cors = require('cors')
const path = require('path')

const productsRouter = require('./src/routes/productsList')
const googleAuthRouter = require('./src/routes/googleAuth')

app.use(cors({
  origin: 'http://localhost:5173', // 前端網址，之後佈署了要改
  methods: ['POST', 'GET', 'OPTIONS'],
  credentials: true
}));

// 加入這些安全標頭，嘗試解決 CORS 問題
app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
  next();
});

// 設定靜態檔案服務，讓前端可以來取後端 images 資料夾ㄉ檔案
app.use('/images', express.static(path.join(__dirname, 'images')))

app.use(express.json())
app.use('/products', productsRouter)
app.use('/auth', googleAuthRouter)

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`)
})