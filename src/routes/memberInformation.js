const express = require("express")
const router = express.Router()
const mysql = require("mysql2")
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "38173438",
  database: "left_and_right",
  port: 3306,
})

db.connect((err) => {
  if (err) {
    console.error("資料庫連線失敗:", err)
    return
  }
  console.log("資料庫連線成功")
})

router.get("/", async (req, res) => {
  const { uid } = req.query
  const query = `
SELECT * FROM left_and_right.users WHERE userId = ?;
  `
  db.query(query, [uid], (err, results) => {
    if (err) {
      console.error("查詢失敗:", err)
      return res.status(500).send("伺服器錯誤")
    }
    res.json(results)
  })
})

module.exports = router
