const jwt = require('jsonwebtoken')
const express = require('express')
const bcrypt = require('bcrypt')//加密密碼
const { PrismaClient } = require('@prisma/client')
const { z } = require('zod')
const { v4: uuidv4 } = require('uuid')

const prisma = new PrismaClient()//建立Prisma client
const router = express.Router()
const dotenv =  require('dotenv')
dotenv.config()

const SECRET_KEY = process.env.SECRET_KEY

//get資料
router.get("/", async (req, res) => {
    try {
        const rows = await prisma.users.findMany()
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// zod 定義註冊 schema
const registerSchema = z.object({
    username : z.string().min(3,'使用者名稱至少需要三個字').max(20,'使用者名稱不能超過20個字元'), 
    
    // .regex(/[A-Z]/, '密碼必須包含至少一個大寫英文字母'),
    email: z.string().email('請輸入正確的email'),
    gender: z.enum(['f', 'm']),
    password_hash :z.string()
    // .min(8,'密碼至少需要8個字元')
    // phone_number: z.string().regex(/^09\d{2}-?\d{3}-?\d{3}$/),
})

//驗證註冊 middleware
const validateRegister = (req,res,next) =>{
    try{
        registerSchema.parse(req.body)
        next()
    }catch(error){
        // zod 錯誤訊息格式化
        const formattedErrors = error.errors.map((err) =>({
            field:err.path.join('.'),
            message:err.message
        }))
        res.status(400).json({
            error:'驗證錯誤',
            details:formattedErrors
        })
    }
}


//註冊
router.post('/register',validateRegister,async(req,res) =>{
  try{
      const { username,email,gender,password_hash } = req.body
      const hashPassword = await bcrypt.hash(password_hash,10)//密碼加密處理

      const lastProfile = await prisma.users.findFirst({
        orderBy: {
          userId: 'desc' // 根據 userId 進行降序排序，取得最大 userId
        }
      });
      
      const newUserId = lastProfile ? lastProfile.userId + 1 : 1; // 如果有資料，+1；否則從 1 開始

      await prisma.users.create({
        data:{
          userId:newUserId,
          username,
          email,
          gender,
          password_hash:hashPassword
        }
      })
      res.status(201).json({message:'註冊成功'})
  }catch(err){
    if(err.code === 'P2002'){
            return res.status(409).json({message:'使用者已註冊'})
        }
        res.status(500).json({
          message:'伺服器錯誤',
          error: err.message, 
          stack: err.stack    
        })
    }
})

//登入
router.post('/login',async(req,res) => {
  try{
    const {email,password_hash} = req.body

    const user = await prisma.users.findUnique({
      where:{ email }
    })

    if(!user || !(await bcrypt.compare(password_hash,user.password_hash))){
      return res.status(401).json({message:'帳號或密碼錯誤'})
    }
    const token = jwt.sign({
      userId:user.id,
      userEmail:user.email
    },SECRET_KEY,{
    //期限
      expiresIn:'1h'// 可設置5m,1d...
    })
    res.json({ token })
    // // 將 token 存入 localStorage
    // localStorage.setItem('token', token);
  }catch(err){
    res.status(500).json({message:'伺服器錯誤'})
  }
  
  
})
//驗證使用者
const authenticateToken = (req,res,next) =>{
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    
    if(!token){
        return res.status(401).json({message:'沒提供token'})
    }
    jwt.verify(token,SECRET_KEY,(err,user) =>{
        if(err){
            return res.status(403).json({message:'token無效'})
        }
        req.user = user
        next()
    })
}


router.get('/profile',authenticateToken,(req,res) =>{
    res.json({user:req.user})
})

module.exports = router