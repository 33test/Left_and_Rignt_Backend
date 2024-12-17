const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config(); // 載入 .env 檔案

const app = express();
app.use(cors());
app.use(bodyParser.json());

// 資料庫連線配置//每人server不同需修改,或是創建相同account或是password
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

app.get('/search', (req, res) => {
  const keyWord = req.query.q;
  // console.log(keyWord)
  const values = [`%${keyWord}%`];
  const query = `
    SELECT 
      p.product_name, 
      p.sale_price, 
      p.original_price, 
      CONCAT('http://localhost:3001', i.image_path) AS image_path
    FROM products p
    LEFT JOIN product_images i ON p.product_id = i.product_id
    WHERE p.product_name LIKE ?
    ORDER BY i.order_sort ASC`;

  db.query(query, values, (err, results) => {
    if (err) {
      console.error('查詢失敗:', err);
      res.status(500).send('伺服器錯誤');
    } else if (!results || results.length === 0) {
      console.log('查詢結果為空');
      res.status(404).send('沒有找到資料');
    } else {
      console.log('查詢成功:', results);
      res.json(results);
    }
  });
});


// 啟動伺服器
app.listen(3001, () => {
  console.log('伺服器啟動於 http://localhost:3001');
});
