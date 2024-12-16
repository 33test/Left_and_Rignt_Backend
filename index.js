const dotenv = require('dotenv')
dotenv.config()
const express = require('express')
const app = express()
const cors = require('cors')
const path = require('path')
const productsRouter = require('./src/routes/productsList')
const registerLoginRouter = require('./src/routes/registerLoginAuth')
const googleAuthRouter = require('./src/routes/googleAuth')
const cartRouter = require('./src/routes/cart')
const couponRouter = require('./src/routes/coupon')
const debitRouter = require('./src/routes/debit')

app.use(cors({
  origin: 'http://localhost:5173', // 前端網址，之後佈署了要改
  methods: ['POST', 'GET', 'OPTIONS' ,'DELETE', 'PUT'],
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
app.use('/categories', productsRouter)
app.use('/users',registerLoginRouter)
app.use('/auth', googleAuthRouter)
app.use('/cart', cartRouter)
app.use('/coupon', couponRouter)
app.use('/debit', debitRouter)

const PORT = 3300
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`)
})
