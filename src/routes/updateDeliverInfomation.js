import express from "express"
import prisma from "../configs/prisma.js"

const router = express.Router()

router.put("/updateDeliverInfo", async (req, res) => {
  const {
    uid,
    phone,
    recipient,
    recipient_phone,
    country,
    city,
    region,
    address,
  } = req.body

  const updateData = {}

  if (!phone) {
    updateData.phone = null
  } else {
    updateData.phone = phone.toString()
  }
  if (!recipient) {
    updateData.recipient = null
  }
  if (!recipient_phone) {
    updateData.recipient_phone = null
  } else {
    updateData.recipient_phone = recipient_phone.toString()
  }
  if (!country) {
    updateData.country = null
  }
  if (!city) {
    updateData.city = null
  }
  if (!region) {
    updateData.region = null
  }
  if (!address) {
    updateData.address = null
  }

  try {
    // 直接使用 uid 查詢 deliver 表中的紀錄
    const existingDeliverInfo = await prisma.deliver.findFirst({
      where: { owner: uid }, // 假設 deliver.owner 存的是 uid
    })

    if (!existingDeliverInfo) {
      return res.status(404).json({ error: "送貨資料不存在，請聯絡客服" })
    }

    // 更新已存在的送貨資料
    const result = await prisma.deliver.update({
      where: { id: existingDeliverInfo.id },
      data: updateData,
    })

    res.status(200).json({ message: "送貨資料已成功更新", data: result })
  } catch (error) {
    console.error("更新送貨資料失敗:", error)
    res.status(500).json({ error: "伺服器錯誤" })
  }
})

export default router
