const express = require('express');
const router = express.Router();
const prisma = require('../configs/db');


router.get("/:product_id?",async(req,res) => {
  try{
    const product_id  = req.params.product_id ? parseInt(req.params.product_id) : null

    if (!product_id) {
      return res.status(400).json({ message: '請提供商品序號' })
    }
    //商品資訊
    const productProfile = await prisma.products.findUnique({
      where:{ product_id:product_id }
    })
    if (!productProfile) {
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
    const productMainImg = await prisma.product_images.findMany({
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
    if (!productMainImg) {
      return res.status(404).json({ message: '未找到商品主照片' })
    }
    //商品敘述照片
    const productDesImg = await prisma.product_images.findMany({
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
    if (!productDesImg) {
      return res.status(404).json({ message: '未找到商品敘述照片' })
    }
    res.status(200).json({
      profile:productProfile,
      specs:productSpecs,
      mainImg:productMainImg,
      desImg:productDesImg
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