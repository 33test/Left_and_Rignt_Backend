import express from "express"
const router = express.Router()
import db from "../configs/db.js"

// 建立 API 端點
router.get("/coupon", (req, res) => {
  const query = "SELECT*FROM discount"
  db.query(query, (err, results) => {
    if (err) {
      console.error("查詢失敗:", err) // 檢查錯誤內容
      res.status(500).send("伺服器錯誤")
    } else if (!results || results.length === 0) {
      console.log("查詢結果為空")
      res.status(404).send("沒有找到資料")
    } else {
      console.log("查詢成功:", results)
      res.json(results)
    }
  })
})

export default router
