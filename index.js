const dotenv = require('dotenv')
dotenv.config()
const express = require('express')
const app = express()
const cors = require('cors')
const productsRouter = require('./src/routes/products')

app.use(cors())


app.use(express.json())
app.use('/products', productsRouter)

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`)
})