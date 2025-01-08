import express from "express"
import prisma from "../configs/prisma.js"
const router = express.Router()

// 取得所有優惠券
router.get("/", async (_req, res) => {
  try {
    const discounts = await prisma.discount.findMany()
    res.json(discounts)
  } catch (error) {
    console.error("查詢失敗:", error.message)
    res.status(500).json({ error: error.message })
  }
})

// 取得單一優惠券
router.get("/user/:user_id", async (req, res) => {
  const { user_id } = req.params
  try {
    const discount = await prisma.discount.findMany({
      where: { user_id: user_id },
    })

    if (!discount) {
      return res.status(404).send("沒有找到資料")
    }
    res.json(discount)
  } catch (error) {
    console.error("查詢失敗:", error.message)
    res.status(500).send("伺服器錯誤")
  }
})

// 新增優惠券
router.post("/:user_id", async (req, res) => {
  const { name, minSpend, discountAmount, startDate, endDate } = req.body
  const userId = req.params.user_id

  // 檢查是否所有必要的字都提供
  if (!userId || !name || minSpend === undefined || discountAmount === undefined || !startDate || !endDate) {
    return res.status(400).send("請提供完整的優惠券資訊")
  }

  // 確保數據類型正確
  const parsedMinSpend = parseFloat(minSpend)
  const parsedDiscountAmount = parseFloat(discountAmount)

  if (isNaN(parsedMinSpend) || isNaN(parsedDiscountAmount)) {
    return res.status(400).send("最低消費和折扣金額必須是有效數字")
  }

  if (parsedMinSpend <= 0 || parsedDiscountAmount <= 0) {
    return res.status(400).send("最低消費和折扣金額必須大於0")
  }

  // 日期格式驗證
  const startDateObj = new Date(startDate)
  const endDateObj = new Date(endDate)

  if (isNaN(startDateObj.getTime()) || isNaN(endDateObj.getTime())) {
    return res.status(400).send("日期格式不正確")
  }

  // 檢查優惠券是否已存在
  try {
    const existingDiscount = await prisma.discount.findFirst({
      where: { name, user_id: userId }, // 現為字符串
    })

    if (existingDiscount) {
      return res.status(409).send("優惠券名稱已存在")
    }

    const newDiscount = await prisma.discount.create({
      data: {
        user_id: userId,
        name,
        min_spend: parsedMinSpend,
        discount_amount: parsedDiscountAmount,
        start_date: startDateObj,
        end_date: endDateObj,
      },
    })
    res.status(201).json(newDiscount)
  } catch (error) {
    console.error("新增失敗:", error.message)
    res.status(500).send("伺服器錯誤")
  }
})

// 會員領取優惠券
router.post("/:id/claim", async (req, res) => {
  const { id } = req.params
  const { userId } = req.body // 用戶ID

  // 檢查是否提供了用戶ID
  if (!userId) {
    return res.status(400).send("請提供用戶ID")
  }

  try {
    // 查詢優惠券是否已經領取
    const discount = await prisma.discount.findUnique({
      where: { id: parseInt(id) },
    })

    // 如果優惠券已經領取，返回錯誤訊息
    if (discount.claimed) {
      return res.status(409).send("該優惠券已經被領取")
    }

    // 更新優惠券的領取狀態
    const updatedDiscount = await prisma.discount.update({
      where: { id: parseInt(id) },
      data: { claimed: true, claimedAt: new Date() }, // 更新 claimed 狀態和領取時間和領取時間
    })
    res.status(200).json(updatedDiscount)
  } catch (error) {
    console.error("領取失敗:", error.message)
    res.status(500).send("伺服器錯誤")
  }
})

// 更新優惠券
router.put("/update/:id", async (req, res) => {
  const { id } = req.params
  const { userId, name, minSpend, discountAmount, startDate, endDate } = req.body

  // 檢查是否所有必要的都提供
  if (!userId || !name || minSpend === undefined || discountAmount === undefined || !startDate || !endDate) {
    return res.status(400).send("請提供完整的優惠券資訊")
  }
  try {
    const updatedDiscount = await prisma.discount.update({
      where: { id: parseInt(id) },
      data: {
        user_id: parseInt(userId),
        name,
        min_spend: parseFloat(minSpend),
        discount_amount: parseFloat(discountAmount),
        start_date: new Date(startDate),
        end_date: new Date(endDate),
      },
    })
    res.json(updatedDiscount)
  } catch (error) {
    console.error("更新失敗:", error.message)
    res.status(500).send("伺服器錯誤")
  }
})

// 刪除優惠券
router.delete("/del/:id", async (req, res) => {
  const { id } = req.params
  try {
    const deleteDiscount = await prisma.discount.delete({
      where: { id: parseInt(id) },
    })
    res.status(200).send("刪除成功")
  } catch (error) {
    console.error("刪除失敗:", error.message)
    res.status(500).send("伺服器錯誤")
  }
})

export default router
