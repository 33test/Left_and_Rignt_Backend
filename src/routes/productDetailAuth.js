const express = require('express');
const router = express.Router();
const prisma = require('../configs/db');


//拿到商品
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
module.exports = router