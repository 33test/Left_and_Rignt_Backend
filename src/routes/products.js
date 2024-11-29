const express = require('express')
const router = express.Router()

const prisma = require('../configs/db')

// get all products
router.get('/', async (req, res) => {
  try {
    const rows = await prisma.products.findMany()
    res.json(rows)
  } catch (err) {
    res.status(500).json({
      status: "Nooooooo",
      message: err.message
    })
  }
})

module.exports = router