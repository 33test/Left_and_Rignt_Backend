const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// 資料庫連線配置
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "38173438",
  database: "left_and_right",
  port: 3306,
});

db.connect((err) => {
  if (err) {
    console.error("資料庫連線失敗:", err);
    return;
  }
  console.log("資料庫連線成功");
});

// 查詢父項目 API
// 查詢父項目 API（帶 hasChildren 判斷）
app.get("/parents", (req, res) => {
  const query = `
    SELECT 
      c.*, 
      EXISTS (
        SELECT 1 
        FROM categories 
        WHERE parent_id = c.categories_id
      ) AS hasChildren
    FROM categories c
    WHERE c.parent_id IS NULL;
  `;
  
  db.query(query, (err, results) => {
    if (err) {
      console.error("查詢失敗:", err);
      return res.status(500).send("伺服器錯誤");
    }
    res.json(results); // 返回父項目資料，帶 hasChildren 屬性
  });
});


// 查詢子項目 API
app.get("/children", (req, res) => {
  const parentId = req.query.parent_id;
  // 確保 parent_id 有提供
  if (!parentId) {
    return res.status(400).send("缺少 parent_id");
  }
  const query = "SELECT * FROM categories WHERE parent_id = ?";
  
  db.query(query, [parentId], (err, results) => {
    if (err) {
      console.error("查詢失敗:", err);
      return res.status(500).send("伺服器錯誤");
    }
    res.json(results); // 返回子項目資料
  });
});




const PORT = 3300
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`)
})
// 啟動伺服器
// app.listen(3000, () => {
//   console.log("伺服器啟動於 http://localhost:3000");
// });
