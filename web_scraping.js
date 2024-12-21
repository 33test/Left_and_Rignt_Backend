// 為了不要一個一個複製貼上，花時間做這個爬蟲。
// 會不會寫這個的時候，我早就一個一個複製貼上完了QQ

const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const fs = require('fs').promises
const path = require('path')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const BASE_URL = "https://www.bonnyread.com.tw/products/kurtamiablering"
const PRODUCT_SKU = "R026"
const PRODUCT_DES = "● BONNY&READ飾品與Kurt Wu共同開發\n● 提供30日退換貨服務，請詳閱「售後服務」\n● 商品材質：S925低敏純銀\n● 戒指內圍直徑SIZE約：1.7 cm / 國際戒圍：#12\n● 可微調範圍約±0.05cm，超過可能會造成戒指變形或斷裂\n● 純銀重量約：1.9 g\n● 單件販售\n● 純銀飾品若無佩戴時，請先保持乾燥狀態，再放置飾品盒或是夾鏈袋乾燥陰涼處保存，避免氧化發黑。"

// 圖片下載功能
const downloadImage = async (imgUrl, imageName) => {
  try {
    const response = await axios({
      method: 'get',
      url: imgUrl,
      responseType: 'arraybuffer',
    })

    const imagePath = path.join(__dirname, 'images', imageName)
    await fs.writeFile(imagePath, response.data)

    return imagePath
  } catch (err) {
    console.error(`Download error: ${err.message}`)
    throw err
  }
}

// 整合的路由處理器
app.get('/bonny', async (req, res) => {
  try {
    const response = await axios.get(BASE_URL)
    const $ = cheerio.load(response.data)

    const productName = $('.Product-title').text().trim()
    const originalPrice = $('.price.js-price.price-crossed').text().slice(3) || $('.price-regular.price.js-price').text().slice(3)
    const salePrice = $('.price-sale.price.js-price').text().slice(3)

    const result = await prisma.$transaction(async (tx) => {
      // 儲存商品資訊
      const savedProduct = await tx.products.create({
        data: {
          product_name: productName,
          original_price: originalPrice ? parseFloat(originalPrice) : 260,
          sale_price: salePrice ? parseFloat(salePrice) : 160,
          product_sku: PRODUCT_SKU,
          total_sales: 28,
          description: PRODUCT_DES,
          status: 1
        }
      })
      
      // 存到 product_categories
      const productCategory = await tx.product_categories.create({
        data: {
          product_id: savedProduct.product_id,
          category_id: 1,
        }
      })

      // 存到 product_spec
      const productSpec = await tx.product_specs.create({
        data : {
          product_id: savedProduct.product_id,
          spec_value: "standard",
          stock: 50,
        }
      })

      // 先建立 5 張主圖的路徑
      const mainImages = []
      for (let i = 1; i <= 5; i++) {
        const mainImage = await tx.product_images.create({
          data: {
            product_id: savedProduct.product_id,
            image_path: `./images/${PRODUCT_SKU}-main-${i}.webp`,
            order_sort: i,
            alt_text: productName,
            image_type: "main"
          }
        })
        mainImages.push(mainImage)
      }

      // 確保圖片資料夾存在
      const imageFolder = path.join(__dirname, 'images')
      await fs.mkdir(imageFolder, { recursive: true })

      // 處理描述圖的下載和儲存
      const images = $('.sl-lazy')
      const maxImages = Math.min(5, images.length)
      const downloadedImages = []

      for (let i = 0; i < maxImages; i++) {
        const img = images.eq(i)
        const srcset = img.attr('data-srcset')

        if (!srcset) {
          console.log(`No srcset found for image ${i + 1}`)
          continue
        }

        const urls = srcset.split(',')
        const lastUrl = urls[urls.length - 1].trim().split(' ')[0]
        const imageUrl = lastUrl.replace('?', '')

        try {
          const desImageName = `${PRODUCT_SKU}-des-${i + 1}.jpg`
          const savedPath = await downloadImage(imageUrl, desImageName)

          // 儲存描述圖資訊到資料庫
          const savedDesImage = await tx.product_images.create({
            data: {
              product_id: savedProduct.product_id,
              image_path: `./images/${desImageName}`,
              order_sort: i + 1,
              alt_text: productName,
              image_type: "description"
            }
          })

          downloadedImages.push({
            desImageName,
            savedPath,
            desImageInfo: savedDesImage,
          })
        } catch (error) {
          console.error(`Failed to process image ${i + 1}: ${error.message}`)
          throw error
        }
      }

      return {
        product: savedProduct,
        category: productCategory,
        spec: productSpec,
        mainImages,
        desImages: downloadedImages
      }
    })

    res.json({
      status: 'success',
      ...result
    })
    
  } catch (err) {
    console.error('發生錯誤:', err)
    res.status(500).json({
      status: 'error',
      message: '資料處理失敗，亂寫!!!!!',
      error: err.message
    })
  }
})

// 關閉 prisma client
process.on('beforeExit', async () => {
  await prisma.$disconnect()
})

const PORT = 3300
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})