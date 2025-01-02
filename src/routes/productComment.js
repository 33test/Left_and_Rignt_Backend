import express from "express"
import prisma from "../configs/prisma.js"
const router = express.Router()

router.get("/info/:purchaseID", async (req, res) => {
	const { purchaseID } = req.params

	try {
		// 用purchaseID 查詢 purchase_product然後抓產品跟user的ID
		const purchaseProducts = await prisma.purchase_product.findMany({
			where: { pu_id: purchaseID },
			select: {
				product_id: true,
				user_id: true,
			},
		})

		if (!purchaseProducts || purchaseProducts.length === 0) {
			return res.status(404).json({
				status: "Error",
				message: "該訂單不存在或沒有相關商品",
			})
		}

		//有找到的話存起來
		const userId = purchaseProducts[0].user_id
		const productIds = purchaseProducts.map((item) => parseInt(item.product_id, 10))

		//再用userID去找username
		const user = await prisma.users.findUnique({
			where: { userId: userId },
			select: { username: true },
		})

		if (!user) {
			return res.status(404).json({
				status: "Error",
				message: "無法找到該用戶",
			})
		}

		// 去 products 表找商品資訊然後丟給前端渲染
		const products = await prisma.products.findMany({
			where: { product_id: { in: productIds } }, //訂單編號裡面有的商品ID去抓他的商品資訊
			select: {
				product_id: true,
				product_name: true,
				product_images: {
					select: {
						image_path: true,
					},
				},
			},
		})

		const responseData = products.map((product) => ({
			product_id: product.product_id,
			product_name: product.product_name,
			image_paths: product.product_images.map((img) => img.image_path),
		}))

		res.status(200).json({
			status: "Success",
			message: "成功獲取訂單中的商品資訊",
			user_id: userId,
			username: user.username,
			data: responseData,
		})
	} catch (err) {
		console.error("Database Error:", err)
		res.status(500).json({
			status: "Error",
			message: "無法獲取資訊，請檢查伺服器日誌。",
			error: err.message,
		})
	}
})
//這邊是component的reviews頁面用的
router.get("/reviews/:productId", async (req, res) => {
	const { productId } = req.params

	try {
		// 從 reviews_table 去找指定商品ID的評論內容
		const reviews = await prisma.reviews_table.findMany({
			where: { product_id: parseInt(productId, 10) },
			select: {
				comment: true,
				username: true,
				comment_time: true,
				sku: true,
			},
		})

		if (!reviews || reviews.length === 0) {
			return res.status(404).json({
				status: "Error",
				message: "該商品目前沒有評論",
			})
		}

		res.status(200).json({
			status: "Success",
			message: "成功獲取評論資料",
			data: reviews,
		})
	} catch (err) {
		console.error("Database Error:", err)
		res.status(500).json({
			status: "Error",
			message: "無法獲取評論資料，請檢查伺服器日誌。",
			error: err.message,
		})
	}
})
//發布評論的post方法
router.post("/addcomment", async (req, res) => {
	const { purchase_id, product_id, comment, user_id, username, sku } = req.body

	// 檢查必填欄位是否存在
	if (!purchase_id || !product_id || !comment || !user_id || !username) {
		return res.status(400).json({
			status: "Error",
			message: "必填欄位缺失",
		})
	}

	try {
		// 創建評論到資料庫中，確保評論與商品關聯
		const newReview = await prisma.reviews_table.create({
			data: {
				purchase_id: purchase_id,
				product_id: parseInt(product_id, 10), // 確保是數字型別
				user_id: user_id,
				comment: comment,
				comment_time: Math.floor(Date.now() / 1000),
				username: username,
				sku: sku,
			},
		})

		res.status(201).json({
			status: "Success",
			message: "評論已成功新增",
			data: newReview,
		})
	} catch (err) {
		console.error("Database Error:", err)
		res.status(500).json({
			status: "Error",
			message: "無法新增評論，請檢查伺服器日誌。",
			error: err.message,
		})
	}
})

export default router
