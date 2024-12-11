const express = require('express');
const router = express.Router();
const prisma = require('../configs/db');


//拿到商品詳情
router.post("/",async(req,res) =>{
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
router.post("/mainImages",async(req,res) =>{
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
router.post("/descriptionImages",async(req,res) =>{
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