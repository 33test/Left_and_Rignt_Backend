const express = require('express')
const router = express.Router()
const prisma = require('../configs/db')

const API_URL = "http://localhost:3300/"

// 路由改為可選的分類參數
router.get('/:category?', async (req, res) => {
  try {
    const category = req.params.category

    // 如果沒有提供分類參數，取得所有商品
    if (!category) {
      const products = await prisma.products.findMany({
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

      const formattedProducts = products.map(product => ({
        id: product.product_id,
        title: product.product_name,
        price: Number(product.sale_price),
        orginalPrice: Number(product.original_price),
        frontImg: `${API_URL}${product.product_images[0]?.image_path}` || '',
        backImg: `${API_URL}${product.product_images[1]?.image_path}` || ''
      }))

      return res.json({
        categoryName: "所有商品",
        products: formattedProducts
      })
    }

    // 如果有提供分類參數，先查詢分類資訊
    const categoryData = await prisma.categories.findFirst({
      where: {
        category_name: {
          contains: category
        }
      }
    })

    // 查詢該分類的商品
    const products = await prisma.products.findMany({
      where: {
        product_categories: {
          some: {
            categories: {
              category_name: {
                contains: category
              }
            }
          }
        }
      },
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

    const formattedProducts = products.map(product => ({
      id: product.product_id,
      title: product.product_name,
      price: Number(product.sale_price),
      orginalPrice: Number(product.original_price),
      frontImg: `${API_URL}${product.product_images[0]?.image_path}` || '',
      backImg: `${API_URL}${product.product_images[1]?.image_path}` || ''
    }))

    res.json({
      categoryName: categoryData?.category_name || "所有商品",
      products: formattedProducts
    })

  } catch (err) {
    res.status(500).json({
      status: "Error",
      message: err.message
    })
  }
})

module.exports = router