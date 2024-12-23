// prisma/seeds/index.js
import prisma from "../../src/configs/prisma.js"

async function main() {
  // 檢查是否已有資料
  const existingProducts = await prisma.products.count()
  const existingCategories = await prisma.categories.count()

  if (existingProducts > 0 || existingCategories > 0) {
    console.log(`資料庫已有資料：${existingProducts} 商品, ${existingCategories} 分類`)
    return
  }

  // 如果沒有資料，才進行 seed
  console.log("開始建立測試資料...")

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
  const categories = await prisma.categories.createMany({
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

  console.log("Seed 完成！")
}

main().catch((e) => {
  console.error(e) // 先印出錯誤訊息
  process.exit(1) // 然後以錯誤狀態結束程式
})
