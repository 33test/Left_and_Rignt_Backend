const express = require('express');
const { PrismaClient } = require('@prisma/client'); // 引入
const router = express.Router();
require('dotenv').config();

const prisma = new PrismaClient(); // 初始化

router.get('/', async (req, res) => {
  const keyWord = req.query.q;

  try {
    const results = await prisma.products.findMany({
      where: {
        product_name: {
          contains: keyWord,
          // Prisma 的 `insensitive` 在 `contains` 中不需要使用 `mode`默認是不區分大小寫
        },
      },
      include: {
        product_images: {
          orderBy: {
            order_sort: 'asc',
          },
        },
      },
    });

    if (results.length === 0) {
      console.log('查詢結果為空');
      return res.status(200).json({ message: '查無資料', data: [] });
    }

    const formattedResults = results.map(product => ({
      product_id: product.product_id,
      product_name: product.product_name,
      sale_price: product.sale_price,
      original_price: product.original_price,
      image_path: product.product_images.length > 0 ? `http://localhost:3300/${product.product_images[0].image_path}` : null,
    }));

    res.json(formattedResults);
  } catch (error) {
    console.error('查詢失敗:', error);
    res.status(500).send('伺服器錯誤');
  }
});

module.exports = router;
