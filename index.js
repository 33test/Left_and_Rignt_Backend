const dotenv = require('dotenv')
dotenv.config()
const express = require('express')
const app = express()
const cors = require('cors')
const productsRouter = require('./src/routes/products')
const searchRouter = require('./src/routes/search');
app.use(cors())

app.use(express.json())
app.use('/products', productsRouter)
app.use('/search', searchRouter); 

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`)
})