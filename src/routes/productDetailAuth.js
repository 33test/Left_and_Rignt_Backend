const express = require('express');
const router = express.Router();
const prisma = require('../configs/db');

const API_URL = "http://localhost:3300/"

// 圖片路徑
const getImageUrl = (imagePath) => {
  if (!imagePath) return ''
  return `${API_URL}${imagePath}`
}

// const formatProduct = (product) => {
//   return product.map(productDetail => ({
//     id: productDetail.profile.product_id,
//     title: productDetail.profile.product_name,
//     price: Number(productDetail.profile.sale_price),
//     originalPrice: Number(productDetail.profile.original_price),
//     totalSales:Number(productDetail.profile.total_sales),
//     mainImg: getImageUrl(productDetail.mainImg.product_images),
//     desImg: getImageUrl(productDetail.desImg.image_path),
//     status:productDetail.profile.status,
//     description:productDetail.profile.description
//   }))
// }
// router.get("/:product_id?",async(req,res) => {
//   try{
//     const product_id  = req.params.product_id ? parseInt(req.params.product_id) : null

//     if (!product_id) {
//       return res.status(400).json({ message: '請提供商品序號' })
//     }
//     //商品資訊
//     const product = await prisma.products.findMany({
//       where:{ 
//         product_id:product_id },
//       include:{
//         product_images:{
//           where: {
//             AND: [
//               { image_type: 'main' },
//             ]
//           },
//           orderBy: {
//             order_sort: 'asc'
//           }
//         },
//         product_images:{
//           where: {
//             AND: [
//               { image_type: 'des' },
//             ]
//           },
//           orderBy: {
//             order_sort: 'asc'
//           }
//         },
//         product_specs:{
//           where:{
//             AND:[

//             ]
//           }
//         }
//       }
//     })
//     const profile = productProfiles.map(profile =>({
//       productId:profile.product_id,
//       title:profile.product_name,
//       originalPrice:profile.original_price,
//       salePrice:profile.sale_price,
//       totalSales:profile.total_sales,
//       status:profile.status,
//       description:profile.description,
//     }))
//     const colors = specs.map(spec => ({
//       color_text: spec.color_text,
//       color_square: spec.color_square
//   }));
//     res.status(200).json({
//     })

//   }catch(err){
//     console.error(err)
//     res.status(500).json({error:err.message})
//   }
  
// })


router.get("/:product_id?",async(req,res) => {
  try{
    const product_id  = req.params.product_id ? parseInt(req.params.product_id) : null

    if (!product_id) {
      return res.status(400).json({ message: '請提供商品序號' })
    }
    //商品資訊
    const productProfiles = await prisma.products.findUnique({
      where:{ product_id:product_id }
    })
    if (!productProfiles) {
      return res.status(404).json({ message: '未找到商品資訊' })
    }
    //商品款式
    const productSpecs = await prisma.product_specs.findMany({
      where:{ product_id:product_id }
    })
    if (!productSpecs) {
      return res.status(404).json({ message: '未找到款式' })
    }
    //商品主照片
    const productMainImgs = await prisma.product_images.findMany({
      where:{ 
        AND:[
          {product_id:product_id },
          { image_type: 'main' }
        ]
      },
      orderBy: {
        order_sort: 'asc' // 由小到大排列
      }
    })
    if (!productMainImgs) {
      return res.status(404).json({ message: '未找到商品主照片' })
    }
    //商品敘述照片
    const productDesImgs = await prisma.product_images.findMany({
      where:{ 
        AND:[
          {product_id:product_id },
          { image_type: 'description' }
        ]
      },
      orderBy: {
        order_sort: 'asc' // 由小到大排列
      }
    })
    if (!productDesImgs) {
      return res.status(404).json({ message: '未找到商品敘述照片' })
    }
    
    res.status(200).json({
      profile:productProfiles,
      specs:productSpecs,
      mainImgs:productMainImgs,
      desImgs:productDesImgs
    })

  }catch(err){
    console.error(err)
    res.status(500).json({error:err.message})
  }
  
})

//拿到商品詳情
router.post("/profile",async(req,res) =>{
  try{
    //輸入商品id
    const { product_id } = req.body
    if (!product_id) {
      return res.status(400).json({ message: '请提供商品序號' })
    }
    //通過id查找訊息
    const productInformation = await prisma.products.findUnique({
      where:{ product_id:product_id }
    })
    if (!productInformation) {
      return res.status(404).json({ message: '未找到商品' })
    }

    res.status(200).json(productInformation);

  }catch(err){
    res.status(500).json({error:err.message})
  }

})
//拿到商品款式
router.post("/specs",async(req,res) =>{
  try{
    //輸入商品id
    const { product_id } = req.body
    if (!product_id) {
      return res.status(400).json({ message: '请提供商品序號' })
    }
    //通過id查找訊息
    const productInformation = await prisma.product_specs.findMany({
      where:{ product_id:product_id }
    })
    if (!productInformation) {
      return res.status(404).json({ message: '未找到商品' })
    }

    res.status(200).json(productInformation);

  }catch(err){
    res.status(500).json({error:err.message})
  }

})
//拿到商品主照片
router.post("/mainImg",async(req,res) =>{
  try{
    //輸入商品id
    const { product_id } = req.body
    if (!product_id) {
      return res.status(400).json({ message: '请提供商品序號' })
    }
    //通過id查找訊息
    const productInformation = await prisma.product_images.findMany({
      where:{ 
        AND:[
          {product_id:product_id },
          { image_type: 'main' }
        ]
      },
      orderBy: {
        order_sort: 'asc' // 由小到大排列
      }
    })
    if (!productInformation) {
      return res.status(404).json({ message: '未找到商品' })
    }

    res.status(200).json(productInformation);

  }catch(err){
    res.status(500).json({error:err.message})
  }

})
//拿到商品敘述照片
router.post("/descriptionImg",async(req,res) =>{
  try{
    //輸入商品id
    const { product_id } = req.body
    if (!product_id) {
      return res.status(400).json({ message: '请提供商品序號' })
    }
    //通過id查找訊息
    const productInformation = await prisma.product_images.findMany({
      where:{ 
        AND:[
          {product_id:product_id },
          { image_type: 'description' }
        ]
      },
      orderBy: {
        order_sort: 'asc' // 由小到大排列
      }
    })
    if (!productInformation) {
      return res.status(404).json({ message: '未找到商品' })
    }

    res.status(200).json(productInformation);

  }catch(err){
    res.status(500).json({error:err.message})
  }

})
module.exports = router