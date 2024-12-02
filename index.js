const dotenv = require('dotenv')
dotenv.config()
const express = require('express')
const app = express()
const cors = require('cors')
const productsRouter = require('./src/routes/products')
const registerLoginRouter = require('./src/routes/registerLoginAuth')

app.use(cors())


app.use(express.json())
app.use('/products', productsRouter)
app.use('/users',registerLoginRouter)

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`)
})