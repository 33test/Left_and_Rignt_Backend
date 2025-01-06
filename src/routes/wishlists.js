import express from "express"
import prisma from "../configs/prisma.js"
const router = express.Router()
// 打資料
router.post('/', async (req, res) => {
    const { wishlists_members_id, wishlists_products_id } = req.body;

    if (!wishlists_members_id || !wishlists_products_id) {
        return res.status(400).json({
            status: "Error",
            message: "wishlists_members_id 和 wishlists_products_id 是必填的",
        });
    }
    // 到users表找確定有這個user
    try {
        
        const memberExists = await prisma.users.findUnique({
            where: { userId: wishlists_members_id },
        });
        if (!memberExists) {
            return res.status(404).json({
                status: "Error",
                message: "沒這個user",
            });
        }
        // 到products表找確定有這個product       
        const productExists = await prisma.products.findUnique({
            where: { product_id: wishlists_products_id },
        });
        if (!productExists) {
            return res.status(404).json({
                status: "Error",
                message: "沒這個product",
            });
        }

        // 打資料進去
        const newWishlist = await prisma.wishlists.create({
            data: {
                wishlists_members_id,
                wishlists_products_id,
            },
        });
        
        res.status(201).json({
            status: "Success",
            message: "資料已成功加入願望清單",
            data: newWishlist,
        });
    } catch (err) {
        res.status(500).json({
            status: "Error",
            message: "無法新增到願望清單",
            error: err.message,
        });
    }
});
// 拿資料
router.get('/:memberId', async (req, res) => {
    const memberId = req.params.memberId;

    try {
        // 查詢該會員的願望清單
        const wishlists = await prisma.wishlists.findMany({
            where: { wishlists_members_id: memberId },
            // 因為這邊有綁FK所以可以用include
            include: {
                products: {
                    select: {
                        product_id: true,
                        product_name: true,
                        original_price: true,
                        sale_price : true,
                        status:true,
                        product_images: {
                            select: {
                                product_images_id: true,
                                image_path: true,
                                alt_text: true,
                                image_type: true,
                            },
                        },
                        product_specs: { 
                            select: {
                                spec_value: true,
                            },
                        },
                    },
                },
            },
        });


        res.status(200).json({
            status: "Success",
            data: wishlists,
        });
    } catch (err) {
        res.status(500).json({
            status: "Error",
            message: "無法獲取願望清單",
            error: err.message,
        });
    }
});
// 刪除
router.delete('/delete/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await prisma.wishlists.delete({
            where: { id: parseInt(id, 10) },
        });
        res.status(200).json({ status: 'Success', message: '項目已刪除' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'Error', message: '刪除失敗' });
    }
});

export default router
