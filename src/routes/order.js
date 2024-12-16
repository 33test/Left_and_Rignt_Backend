const express = require('express')
const router = express.Router()
const prisma = require('../configs/prisma')

const API_URL = "http://localhost:3300";


// 查詢訂單詳情 API
router.get("/details/:purchaseID", async (req, res) => {
    const { purchaseID } = req.params;


    try {
        // 1. 查詢訂單資訊
        const orderInfo = await prisma.purchase_order.findUnique({
            where: { purchaseID },
            select: { purchaseID: true },
        });

        if (!orderInfo) {
            return res.status(404).json({ status: "Error", message: "訂單不存在" });
        }

        // 2. 查詢顧客資訊
        const customerInfo = await prisma.customer_info.findFirst({
            where: { cuID: orderInfo.cuID },
            select: { cuName: true, cuPhone: true, gender: true },
        });

        // 3. 查詢送貨資訊
        const deliveryInfo = await prisma.deliver_pro_info.findFirst({
            where: { delivrID: orderInfo.DeliverID },
            select: { acName: true, acPhone: true, addr: true, city: true },
        });

        // 4. 查詢付款資訊
        const paymentInfo = await prisma.pay_info_table.findFirst({
            where: { PayID: orderInfo.payID },
            select: { cardID: true, cardName: true, efficentDate: true },
        });

        // 5. 查詢商品資訊
        const products = await prisma.purchase_product.findMany({
            where: { pu_id: purchaseID },
            select: { product_id: true, quantity: true },
        });

        // 6. 查詢每個商品的詳細信息（包含名稱、價格）
        const productInfo = await Promise.all(
            products.map(async (product) => {
                const productDetails = await prisma.products.findUnique({
                    where: { product_id: product.product_id },
                    select: {
                        product_name: true,
                        original_price: true,
                        sale_price: true,
                    },
                });

                // 查詢商品圖片
                const image = await prisma.product_images.findFirst({
                    where: { product_id: product.product_id },
                    select: { image_path: true },
                });
                
                const fullImagePath = image?.image_path
                ? `${API_URL}${image.image_path.replace(/^\.\//, "/")}`
                : null;

                

                return {
                    product_id: product.product_id,
                    quantity: product.quantity,
                    product_name: productDetails?.product_name || null,
                    original_price: productDetails?.original_price || null,
                    sale_price: productDetails?.sale_price || null,
                    image_path: fullImagePath || null,
                };
            })
        );

        res.status(200).json({
            orderInfo,
            customerInfo,
            deliveryInfo,
            paymentInfo,
            productInfo,
        });
    } catch (error) {
        console.error("Database Error:", error);
        res.status(500).json({
            status: "Error",
            message: "無法獲取訂單詳情，請檢查伺服器日誌。",
            error: error.message,
        });
    }
});

module.exports = router;
