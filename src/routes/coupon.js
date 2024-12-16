const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const router = express.Router()


// 資料庫連線配置//每人server不同需修改,或是創建相同account或是password
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});


db.connect(err => {
  if (err) {
    console.error('資料庫連線失敗:', err);
    return;
  }
  console.log('資料庫連線成功');
});

// 建立 API 端點
router.get('/coupon', (req, res) => {
    const query = 'SELECT*FROM discount';
    db.query(query, (err, results) => {
      if (err) {
        console.error('查詢失敗:', err); // 檢查錯誤內容
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

  module.exports = router