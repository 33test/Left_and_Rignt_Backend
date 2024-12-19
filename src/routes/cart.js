import express from "express"
const router = express.Router()
import db from "../configs/db.js"

// 建立 API 端點
router.get("/cartQuery", (req, res) => {
	const userId = "10001"
	const query =
		'SELECT p.*,pi.image_path,c.quantity FROM products p JOIN cart c ON p.product_id = c.product_id LEFT JOIN product_images pi ON p.product_id = pi.product_id AND pi.order_sort = 1 AND image_type="main" WHERE  c.user_id = ?;'
	db.query(query, [userId], (err, results) => {
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

// 新增或更新資料
router.post("/cartInsert", (req, res) => {
	const { user_id, product_id, quantity } = req.body

	if (!user_id || !product_id || !quantity) {
		res.status(400).send("缺少必要參數")
		return
	}

	// 檢查是否已有資料
	const checkQuery = `SELECT * FROM cart WHERE user_id = ? AND product_id = ?`
	db.query(checkQuery, [user_id, product_id], (err, results) => {
		if (err) {
			console.error("檢查失敗:", err)
			res.status(500).send("伺服器錯誤")
			return
		}

		if (results.length > 0) {
			// 已有資料，更新數量
			const updateQuery = `UPDATE cart SET quantity = quantity + ? WHERE user_id = ? AND product_id = ?`
			db.query(
				updateQuery,
				[quantity, user_id, product_id],
				(err, updateResults) => {
					if (err) {
						console.error("更新失敗:", err)
						res.status(500).send("伺服器錯誤")
					} else {
						console.log("更新成功:", updateResults)
						res.status(200).send("數量更新成功")
					}
				}
			)
		} else {
			// 無資料，新增新紀錄
			const insertQuery = `INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)`
			db.query(
				insertQuery,
				[user_id, product_id, quantity],
				(err, insertResults) => {
					if (err) {
						console.error("新增失敗:", err)
						res.status(500).send("伺服器錯誤")
					} else {
						console.log("新增成功:", insertResults)
						res.status(201).send("新增成功")
					}
				}
			)
		}
	})
})
// 刪除資料
router.delete("/cartDelete/:id", (req, res) => {
	const { id } = req.params // 確保從路由參數中提取 id
	const query = "DELETE FROM cart WHERE product_id = ?" // 使用佔位符

	db.query(query, [id], (err, results) => {
		if (err) {
			console.error("刪除失敗:", err) // 紀錄錯誤
			res.status(500).send("伺服器錯誤") // 返回錯誤狀態
		} else if (results.affectedRows === 0) {
			res.status(404).send("資料不存在") // 如果刪除影響行數為 0，表示沒有符合條件的資料
		} else {
			res.send("刪除成功") // 返回成功訊息
		}
	})
})

// 更新商品數量的 API 路由
router.put("/update-quantity", (req, res) => {
	const { product_id, quantity } = req.body

	if (!product_id || !quantity) {
		return res.status(400).json({ success: false, message: "缺少必要參數" })
	}

	const query = "UPDATE cart SET quantity = ? WHERE product_id = ?"
	db.query(query, [quantity, product_id], (err, result) => {
		if (err) {
			console.error("更新數量時出錯:", err)
			return res.status(500).json({ success: false, message: "更新失敗" })
		}

		if (result.affectedRows === 0) {
			return res.status(404).json({ success: false, message: "找不到該產品" })
		}

		res.json({ success: true, message: "數量更新成功" })
	})
})

export default router
