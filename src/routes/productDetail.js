import express from "express"
import prisma from "../configs/prisma.js"
const router = express.Router()

//拿到商品詳情
router.get("/profile/:productId", async (req, res) => {
  try {
    //輸入商品id
    const productId = req.params.productId ? parseInt(req.params.productId) : null
    if (!productId) {
      return res.status(400).json({ message: "需要提供商品id" })
    }
    //通過id查找訊息
    const productInformation = await prisma.products.findUnique({
      where: { product_id: productId },
    })
    if (!productInformation) {
      return res.status(404).json({ message: "未找到商品" })
    }

    res.status(200).json(productInformation)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})
//拿到商品款式
router.get("/specs/:productId", async (req, res) => {
  try {
    //輸入商品id
    const productId = req.params.productId ? parseInt(req.params.productId) : null
    if (!productId) {
      return res.status(400).json({ message: "需要提供商品id" })
    }
    //通過id查找訊息
    const productInformation = await prisma.product_specs.findMany({
      where: { product_id: productId },
    })
    if (!productInformation) {
      return res.status(404).json({ message: "未找到商品" })
    }

    res.status(200).json(productInformation)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})
//拿到商品主照片
router.get("/mainImgs/:productId", async (req, res) => {
  try {
    //輸入商品id
    const productId = req.params.productId ? parseInt(req.params.productId) : null
    if (!productId) {
      return res.status(400).json({ message: "需要提供商品id" })
    }
    //通過id查找訊息
    const productInformation = await prisma.product_images.findMany({
      where: {
        AND: [{ product_id: productId }, { image_type: "main" }],
      },
      orderBy: {
        order_sort: "asc", // 由小到大排列
      },
    })
    if (!productInformation) {
      return res.status(404).json({ message: "未找到商品" })
    }

    res.status(200).json(productInformation)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})
//拿到商品敘述照片
router.get("/desImgs/:productId", async (req, res) => {
  try {
    //輸入商品id
    const productId = req.params.productId ? parseInt(req.params.productId) : null
    if (!productId) {
      return res.status(400).json({ message: "需要提供商品id" })
    }
    //通過id查找訊息
    const productInformation = await prisma.product_images.findMany({
      where: {
        AND: [{ product_id: productId }, { image_type: "description" }],
      },
      orderBy: {
        order_sort: "asc", // 由小到大排列
      },
    })
    if (!productInformation) {
      return res.status(404).json({ message: "未找到商品" })
    }

    res.status(200).json(productInformation)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
