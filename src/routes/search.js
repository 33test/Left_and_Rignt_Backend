import express from "express"
import prisma from "../configs/prisma.js"

const router = express.Router()
router.get("/", async (req, res) => {
	const keyWord = req.query.q

	try {
		const results = await prisma.products.findMany({
			where: {
				product_name: {
					contains: keyWord,
				},
			},
			include: {
				product_images: {
					orderBy: {
						order_sort: "asc", // 會根據order_sort 會從後端根據升序排列
					},
				},
			},
		})

		if (results.length === 0) {
			console.log("查詢結果為空")
			return res.status(200).json({ message: "查無資料", data: [] })
		}

		const formattedResults = results.map((product) => ({
			product_id: product.product_id,
			product_name: product.product_name,
			sale_price: product.sale_price,
			original_price: product.original_price,
			image_path:
				product.product_images.length > 0
					? `${process.env.BASE_URL}/${product.product_images[0].image_path}`
					: null,
		}))
		console.log("Formatted results:", formattedResults) // 输出格式化后的结果
		res.json(formattedResults)
	} catch (error) {
		console.error("查詢失敗:", error)
		res.status(500).send("伺服器錯誤")
	}
})

export default router
