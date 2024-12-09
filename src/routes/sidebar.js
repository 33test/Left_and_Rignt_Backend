const express = require('express');
const mysql = require('mysql2')
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// 資料庫連線配置//每人server不同需修改,或是創建相同account或是password
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '38173438',
  database: 'left_and_right',
  port:3306,
});

db.connect(err => {
  if (err) {
    console.error('資料庫連線失敗:', err);
    return;
  }
  console.log('資料庫連線成功');
});

// 建立 API 端點
app.get('/', (req, res) => {
    const categoryId = req.query.category_id; // 從查詢參數中取得 category_id

    if (!categoryId) {
        return res.status(400).send('缺少 category_id');
    }

    const query = `SELECT 
    p.product_id, 
    p.product_name, 
    p.original_price, 
    pi.image_path
FROM 
    product_categories pc
JOIN 
    products p ON pc.product_id = p.product_id
JOIN 
    product_images pi ON p.product_id = pi.product_id
WHERE 
    pc.category_id = ?`;

    db.query(query, [categoryId],(err, results) => {
        if (err) {
            console.error('查詢失敗:', err.sqlMessage); // 打印 SQL 錯誤訊息
            return res.status(500).send('伺服器錯誤');
        }

        if (!results || results.length === 0) {
            console.log('查詢結果為空');
            return res.status(404).send('沒有找到資料');
        }

        console.log('查詢成功:', results);
        res.json(results);
    });
});

// 啟動伺服器
app.listen(3000, () => {
  console.log('伺服器啟動於 http://localhost:3000');
});