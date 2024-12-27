import prisma from "../../src/configs/prisma.js"

async function main() {
  try {
    // 分開檢查每個表的資料
    const existingCategories = await prisma.categories.count()
    const existingRates = await prisma.rates.count()

    // 建立分類資料
    if (existingCategories === 0) {
      console.log("開始建立分類資料...")
      try {
        // 先建立 Kurt 分類
        console.log("創建 Kurt 分類...")
        const kurtCategory = await prisma.categories.create({
          data: {
            category_name: "Kurt Wu 插畫家聯名",
            category_type: "regular",
          },
        })

        // 建立其他分類
        console.log("創建其他分類...")
        await prisma.categories.createMany({
          data: [
            { category_name: "耳環", category_type: "regular" },
            { category_name: "戒指", category_type: "regular" },
            { category_name: "項鍊", category_type: "regular" },
            {
              category_name: "插畫家戒指",
              category_type: "regular",
              parent_id: kurtCategory.categories_id,
            },
          ],
        })

        // 取得所有分類的 ID
        const allCategories = await prisma.categories.findMany()

        // 對每個分類建立商品
        for (const category of allCategories) {
          const product = await prisma.products.create({
            data: {
              product_name: "[預購] [Kurt聯名] [鋼飾] Kurt喜Kurt恨戒指組 / 2色 / 3 size / Kurt Gratifying Hateful Ring Set",
              sale_price: 790,
              original_price: 1000,
              product_sku: `TEST${category.categories_id.toString().padStart(3, "0")}`,
              description: "這是一筆測試資料",
              product_specs: {
                createMany: {
                  data: [
                    {
                      spec_value: "standard",
                      stock: 10,
                      color_text: "Red / 紅色",
                      color_square: "#ab0505",
                    },
                    {
                      spec_value: "standard",
                      stock: 10,
                      color_text: "Baby Blue / 寶寶藍",
                      color_square: "#aacdf5",
                    },
                  ],
                },
              },
              product_categories: {
                create: [
                  {
                    category_id: category.categories_id,
                  },
                ],
              },
              product_images: {
                createMany: {
                  data: [
                    {
                      image_path: "images/kurtgratifyinghatefulearring-prd-1.jpg",
                      image_type: "main",
                      order_sort: 1,
                    },
                    {
                      image_path: "images/kurtgratifyinghatefulearring-prd-2.jpg",
                      image_type: "main",
                      order_sort: 2,
                    },
                    {
                      image_path: "images/kurtgratifyinghatefulearring-prd-3.jpg",
                      image_type: "main",
                      order_sort: 3,
                    },
                    {
                      image_path: "images/kurtgratifyinghatefulearring-prd-4.jpg",
                      image_type: "main",
                      order_sort: 4,
                    },
                    {
                      image_path: "images/kurtgratifyinghatefulearring-prd-5.jpg",
                      image_type: "main",
                      order_sort: 5,
                    },
                    {
                      image_path: "images/kurtgratifyinghatefulearring-des-1.jpg",
                      image_type: "description",
                      order_sort: 1,
                    },
                    {
                      image_path: "images/kurtgratifyinghatefulearring-des-2.jpg",
                      image_type: "description",
                      order_sort: 2,
                    },
                    {
                      image_path: "images/kurtgratifyinghatefulearring-des-3.jpg",
                      image_type: "description",
                      order_sort: 3,
                    },
                    {
                      image_path: "images/kurtgratifyinghatefulearring-des-4.jpg",
                      image_type: "description",
                      order_sort: 4,
                    },
                    {
                      image_path: "images/kurtgratifyinghatefulearring-des-5.jpg",
                      image_type: "description",
                      order_sort: 5,
                    },
                  ],
                },
              },
            },
          })
          console.log(`建立商品 ${product.product_sku} 在分類 ${category.category_name}`)
        }
      } catch (error) {
        console.error("創建分類和商品時發生錯誤:", error)
        throw error
      }
    } else {
      console.log("分類資料已存在，跳過建立")
    }

    // 建立匯率資料
    if (existingRates === 0) {
      console.log("開始建立匯率資料...")
      try {
        await prisma.rates.createMany({
          data: [
            { currency: "TWD", rate: 1 },
            { currency: "HKD", rate: 0.2384 },
            { currency: "MOP", rate: 0.2455 },
            { currency: "CNY", rate: 0.2236 },
            { currency: "USD", rate: 0.03069 },
            { currency: "SGD", rate: 0.04156 },
            { currency: "EUR", rate: 0.02941 },
            { currency: "AUD", rate: 0.04909 },
            { currency: "GBP", rate: 0.0244 },
            { currency: "PHP", rate: 1.8083 },
            { currency: "MYR", rate: 0.138 },
            { currency: "THB", rate: 1.0499 },
            { currency: "AED", rate: 0.1127 },
            { currency: "JPY", rate: 4.7986 },
            { currency: "BND", rate: 0.04158 },
            { currency: "KRW", rate: 44.3304 },
            { currency: "IDR", rate: 497.3216 },
            { currency: "VND", rate: 781.6214 },
            { currency: "CAD", rate: 0.04405 },
          ],
        })
        console.log("匯率資料建立完成")
      } catch (error) {
        console.error("創建匯率時發生錯誤:", error)
        throw error
      }
    } else {
      console.log("匯率資料已存在，跳過建立")
    }

    console.log("Seed 完成！")
  } catch (error) {
    console.error("Seed 過程發生錯誤:", error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
