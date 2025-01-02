import express from "express"
import prisma from "../configs/prisma.js"

const router = express.Router()

router.put("/updateDeliverInfo", async (req, res) => {
  const { uid } = req.body // 從請求主體中取得 uid
  const { phone, recipient, recipient_phone, country, city, region, address } =
    req.body // 從請求主體中取得更新資料
  console.log("接收到的資料:", req.body)

  try {
    // 查找該用戶是否存在，並獲取整數型 id
    const user = await prisma.users.findUnique({
      where: { userId: uid }, // 使用 uid 查找用戶
      select: { id: true }, // 只選擇 id 欄位
    })

    if (!user) {
      return res.status(404).json({ error: "用戶不存在" }) // 如果用戶不存在，返回錯誤訊息
    }

    const userId = user.id // 使用整數型的 id 進行後續操作

    // 檢查是否已存在該用戶的送貨資料
    const existingDeliverInfo = await prisma.deliver.findFirst({
      where: { owner: userId }, // 使用整數型 user_id
    })

    let result
    if (existingDeliverInfo) {
      // 如果已存在，執行更新操作
      result = await prisma.deliver.update({
        where: { id: existingDeliverInfo.id }, // 使用送貨資料的主鍵 id
        data: {
          phone,
          recipient,
          recipient_phone,
          country,
          city,
          region,
          address,
        },
      })
      res.status(200).json({ message: "送貨資料已成功更新", data: result })
    } else {
      // 如果不存在，執行新增操作
      result = await prisma.deliver.create({
        data: {
          owner: userId, // 傳遞整數型 userId
          phone,
          recipient,
          recipient_phone,
          country,
          city,
          region,
          address,
        },
      })
      res.status(201).json({ message: "送貨資料已成功新增", data: result })
    }
  } catch (error) {
    console.error("更新或新增送貨資料失敗:", error) // 捕捉錯誤並打印
    res.status(500).json({ error: "更新或新增送貨資料時發生錯誤" }) // 返回內部錯誤訊息
  }
})

export default router
