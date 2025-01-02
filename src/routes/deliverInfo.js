import express from "express"
import prisma from "../configs/prisma.js"

const router = express.Router()

router.get("/getDeliverInfo", async (req, res) => {
  const { uid } = req.query // 從查詢參數中取得 UID

  try {
    // 根據 UID 查詢 users 資料表中的 userId
    const user = await prisma.users.findUnique({
      where: {
        userId: uid,
      },
      select: {
        id: true,
        userId: true,
      },
    })

    if (!user) {
      return res.status(404).send("使用者未找到")
    }

    // 查找 deliver 資料表中的相關紀錄
    let deliveryInfo = await prisma.deliver.findMany({
      where: {
        owner: user.userId,
      },
    })

    // 如果 deliver 資料表沒有找到紀錄，新增一筆資料
    if (deliveryInfo.length === 0) {
      const newDeliver = await prisma.deliver.create({
        data: {
          owner: user.userId,
          phone: null, // 預設為 null 或其他默認值
          recipient: null,
          recipient_phone: null,
          country: null,
          city: null,
          region: null,
          address: null,
        },
      })

      // 將新插入的紀錄設置為返回值
      deliveryInfo = [newDeliver]
    }

    return res.json(deliveryInfo) // 返回 deliver 資料表中的紀錄
  } catch (err) {
    console.error("查詢或插入失敗:", err)
    return res.status(500).send("伺服器錯誤")
  }
})

export default router
