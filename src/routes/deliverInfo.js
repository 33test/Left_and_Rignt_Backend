import express from "express"
import prisma from "../configs/prisma.js"
const router = express.Router()

router.get("/getDeliverInfo", async (req, res) => {
  const { uid } = req.query // 從查詢參數中取得 UID

  try {
    // 根據 UID 查詢 users 資料表中的 user_id
    const user = await prisma.users.findUnique({
      where: {
        userId: uid, // 查詢 users 資料表，找到匹配的用戶
      },
      select: {
        id: true, // 只選擇 id 欄位
      },
    })

    // 如果找不到使用者資料，返回空物件
    if (!user) {
      return res.json({}) // 返回空物件表示未找到該用戶
    }

    // 使用查詢到的 user_id 查找 deliver 資料表中的相關紀錄
    const deliveryInfo = await prisma.deliver.findMany({
      where: {
        users: {
          id: user.id,
        },
      },
    })

    // 返回空陣列表示該用戶沒有送貨資料
    return res.json(deliveryInfo)
  } catch (err) {
    console.error("查詢失敗:", err)
    return res.status(500).send("伺服器錯誤")
  }
})

export default router
