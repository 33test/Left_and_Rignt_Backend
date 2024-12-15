const express = require("express");
const router = express.Router();
const prisma = require("../configs/prisma");


router.get("/info/:purchaseID", async (req, res) => {
    const { purchaseID } = req.params;

    try {
        // 用purchaseID 查詢 purchase_product然後抓產品跟user的ID
        const purchaseProducts = await prisma.purchase_product.findMany({
            where: { pu_id: purchaseID },
            select: {
                product_id: true,
                user_id: true,
            },
        });

        if (!purchaseProducts || purchaseProducts.length === 0) {
            return res.status(404).json({
                status: "Error",
                message: "該訂單不存在或沒有相關商品",
            });
        }

        //有找到的話存起來
        const userId = purchaseProducts[0].user_id;
        const productIds = purchaseProducts.map((item) => parseInt(item.product_id, 10));

        //再用userID去找username
        const user = await prisma.users.findUnique({
            where: { userId: userId },
            select: { username: true },
        });

        if (!user) {
            return res.status(404).json({
                status: "Error",
                message: "無法找到該用戶",
            });
        }

        // 去 products 表找商品資訊然後丟給前端渲染
        const products = await prisma.products.findMany({
            where: { product_id: { in: productIds } },
            select: {
				product_id: true, 
                product_name: true,
                product_images: {
                    select: {
                        image_path: true,
                    },
                },
            },
        });

        const responseData = products.map((product) => ({
			product_id: product.product_id, 
            product_name: product.product_name,
            image_paths: product.product_images.map((img) => img.image_path),
        }));

        res.status(200).json({
            status: "Success",
            message: "成功獲取訂單中的商品資訊",
			user_id: userId, 
            username: user.username, 
            data: responseData,
        });
    } catch (err) {
        console.error("Database Error:", err);
        res.status(500).json({
            status: "Error",
            message: "無法獲取資訊，請檢查伺服器日誌。",
            error: err.message,
        });
    }
});
//這邊是component的reviews頁面用的
router.get("/reviews/:productId", async (req, res) => {
    const { productId } = req.params;

    try {
        // 從 reviews_table 去找指定商品ID的評論內容
        const reviews = await prisma.reviews_table.findMany({
            where: { product_id: parseInt(productId, 10) },
            select: {
                comment: true,
                username: true,
                comment_time: true,
            },
        });

        if (!reviews || reviews.length === 0) {
            return res.status(404).json({
                status: "Error",
                message: "該商品目前沒有評論",
            });
        }

        res.status(200).json({
            status: "Success",
            message: "成功獲取評論資料",
            data: reviews,
        });
    } catch (err) {
        console.error("Database Error:", err);
        res.status(500).json({
            status: "Error",
            message: "無法獲取評論資料，請檢查伺服器日誌。",
            error: err.message,
        });
    }
});
  //發布評論的post方法
  router.post("/addcomment", async (req, res) => {
    const { purchase_id, comment, sku, user_id, username } = req.body; 
  
	  // 檢查所有必填欄位
	  if (!purchase_id || !comment || !user_id || !username) {
        return res.status(400).json({
            status: "Error",
            message: "purchase_id、comment、user_id 和 username 是必填的",
        });
	}
  
	try {
	  // 從 purchase_product 表中查詢 userID和商品ID
	  const purchaseProduct = await prisma.purchase_product.findFirst({
		where: { pu_id: purchase_id},
		select: { product_id: true, user_id: true }, 
	});
  
	  if (!purchaseProduct || !purchaseProduct.user_id) {
		return res.status(404).json({
		  status: "Error",
		  message: "無效的訂單或商品資訊",
		});
	  }
	  const product_id = parseInt(purchaseProduct.product_id, 10); 
	  const user_id = purchaseProduct.user_id;

	  if (isNaN(product_id)) {
		return res.status(400).json({
			status: "Error",
			message: "無法轉換 product_id 為有效整數",
		});
	}
  
	  // 把評論打進資料庫
	  const newReview = await prisma.reviews_table.create({
		data: {
		  purchase_id: purchase_id, 
		  product_id, 
		  user_id: user_id,
		  comment: comment,
		  comment_time: Math.floor(Date.now() / 1000), 
		  sku: sku,
		  username: username, 
		},
	  });
  
	  res.status(201).json({
		status: "Success",
		message: "評論已成功新增",
		data: newReview,
		
	  });
	} catch (err) {
	  console.error("Database Error:", err);
	  res.status(500).json({
		status: "Error",
		message: "無法新增評論，請檢查伺服器日誌。",
		error: err.message,
	  });
	}
  });
  
  
module.exports = router;
