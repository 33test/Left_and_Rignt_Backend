const express = require('express')
const router = express.Router()
const prisma = require('../configs/db')

const API_URL = "http://localhost:3300/"

// 因為格式化商品資料用了兩次所以提出來
const formatProducts = (products) => {
  return products.map(product => ({
    id: product.product_id,
    title: product.product_name,
    price: Number(product.sale_price),
    orginalPrice: Number(product.original_price),
    frontImg: getImageUrl(product.product_images[0]?.image_path),
    backImg: getImageUrl(product.product_images[1]?.image_path)
  }))
}

// 圖片路徑
const getImageUrl = (imagePath) => {
  if (!imagePath) return ''
  return `${API_URL}${imagePath}`
}

// 路由改為可選的分類參數
router.get('/:categoryId?', async (req, res) => {
  const { sortBy } = req.query

  let orderBy = {}

  switch (sortBy) {
    case "latest":
      orderBy = { listed_at: 'desc' } // Timestamp 從大到小(越新的越大)
      break
    case "oldest":
      orderBy = { listed_at: 'asc'}
      break
    case "expensive":
      orderBy = { sale_price: 'desc' }
      break
    case "cheap":
      orderBy = { sale_price: 'asc' }
      break
    case "popular":
      orderBy = { total_sales: 'desc' }
      break
    default:
      orderBy = { product_id: 'asc'}
  }


  try {
    // 確定 ID 是數字（轉一下）
    const categoryId = req.params.categoryId ? parseInt(req.params.categoryId) : null

    // 如果沒有提供分類參數，取得所有商品
    if (!categoryId) {
      const products = await prisma.products.findMany({
        orderBy,
        include: {
          product_images: {
            where: {
              AND: [
                { image_type: 'main' },
                { order_sort: { in: [1, 2] } }
              ]
            },
            orderBy: {
              order_sort: 'asc'
            }
          }
        }
      })

      return res.json({
        categoryName: "所有商品",
        products: formatProducts(products)
      })
    }

    // 如果有提供分類參數，先查詢分類資訊
    const categoryData = await prisma.categories.findUnique({
      where: {
        categories_id: categoryId
      }
    })

    // 如果沒有那個分類 ID，船錯誤
    if (!categoryData) {
      return res.status(404).json({
        status: "Error",
        message: "分類不存在"
      })
    }

    // 查詢該分類的商品
    const products = await prisma.products.findMany ({
      where: {
        product_categories: {
          some: {
            category_id: categoryId
          }
        }
      },
      orderBy,
      include: {
        product_images: {
          where: {
            AND: [
              { image_type: 'main' },
              { order_sort: { in: [1, 2] } }
            ]
          },
          orderBy: {
            order_sort: 'asc'
          }
        }
      }
    })

    res.json({
      categoryName: categoryData?.category_name || "所有商品",
      products: formatProducts(products)
    })

  } catch (err) {
    res.status(500).json({
      status: "Error",
      message: err.message
    })
  }
})

module.exports = router