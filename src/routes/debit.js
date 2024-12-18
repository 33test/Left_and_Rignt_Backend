import express from "express"
const router = express.Router()
import db from "../configs/db.js"

router.post("/orderInsert", (req, res) => {
	const { customerInfo, orderNote, deliveryInfo } = req.body
	const userID = "10001" // 模擬用戶 ID

	try {
		// 生成隨機 ID
		const deID = `DE${Date.now()}${Math.floor(Math.random() * 1000)}` // 這邊要改 uuidv4
		const cuID = `OD${Date.now()}${Math.floor(Math.random() * 1000)}`
		const orID = `OR${Date.now()}${Math.floor(Math.random() * 1000)}`
		const puID = `PU${Date.now()}${Math.floor(Math.random() * 1000)}`

		// 插入送貨資料
		const deInsertQuery = `INSERT INTO deliver_pro_info(acName, acPhone, addr, city, postalCode, site, userID, delivrID) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
		db.query(
			deInsertQuery,
			[
				deliveryInfo.recipientName,
				deliveryInfo.recipientPhone,
				deliveryInfo.address,
				deliveryInfo.city,
				deliveryInfo.postalCode,
				deliveryInfo.region,
				userID,
				deID,
			],
			(err) => {
				if (err) return res.status(500).send("送貨資料新增失敗")

				// 插入顧客資料
				const cuInsertQuery = `INSERT INTO customer_info (cuID, cuName, cuPhone, gender, userID) VALUES (?, ?, ?, ?, ?)`
				db.query(
					cuInsertQuery,
					[
						cuID,
						customerInfo.name,
						customerInfo.phone,
						customerInfo.gender,
						userID,
					],
					(err) => {
						if (err) return res.status(500).send("顧客資料新增失敗")

						// 查詢購物車資料
						const checkQuery = `SELECT * FROM cart WHERE user_id = ?`
						db.query(checkQuery, [userID], (err, cartResults) => {
							if (err) return res.status(500).send("查詢購物車失敗")

							if (!cartResults.length) return res.status(404).send("購物車為空")

							// 插入購買產品
							const puInsertQuery = `INSERT INTO purchase_product(pu_id, user_id, product_id, quantity) VALUES (?, ?, ?, ?)`
							const purchasePromises = cartResults.map((cartItem) => {
								return new Promise((resolve, reject) => {
									db.query(
										puInsertQuery,
										[puID, userID, cartItem.product_id, cartItem.quantity],
										(err) => {
											if (err) reject("購買產品新增失敗")
											else resolve()
										}
									)
								})
							})

							Promise.all(purchasePromises)
								.then(() => {
									// 清空購物車
									const deleteQuery = `DELETE FROM cart WHERE user_id = ?`
									db.query(deleteQuery, [userID], (err) => {
										if (err) return res.status(500).send("清空購物車失敗")

										// 插入訂單資料
										const orInsertQuery = `INSERT INTO purchase_order(purchaseID, puID, DeliveryWay, DeliverySite, payWay, note, cuID, DeliverID) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?)`
										db.query(
											orInsertQuery,
											[
												orID,
												puID,
												"宅配",
												"台灣",
												"貨到付款",
												orderNote,
												cuID,
												deID,
											],
											(err) => {
												if (err) return res.status(500).send("訂單新增失敗")

												res.status(200).send("訂單提交成功")
											}
										)
									})
								})
								.catch((error) => {
									console.error("錯誤:", error)
									res.status(500).send(error)
								})
						})
					}
				)
			}
		)
	} catch (error) {
		console.error("錯誤:", error)
		res.status(500).json({ message: "伺服器錯誤" })
	}
})

export default router
