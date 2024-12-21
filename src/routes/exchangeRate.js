import express from "express"
import prisma from "../configs/prisma.js"
import axios from "axios"
import { scheduleJob } from "node-schedule"

const router = express.Router()
const baseCurrency = "TWD"
const API_KEY = process.env.EXCHANGE_RATE_API_KEY
let counts = 10

//從API取得匯率
const getRate = async () => {
  try {
    const response = await axios.get(`https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${baseCurrency}`)
    counts++
    return response.data.conversion_rates
  } catch (err) {
    throw new Error("資料拿取失敗")
  }
}

//手動更新資料庫匯率資料
const ratesUpdate = async (rateData) => {
  try {
    // 先檢查 rateData 是否有效
    if (!rateData || typeof rateData !== "object") {
      throw new Error("無效的匯率資料")
    }

    //查詢資料庫中的幣種
    const existingCurrencies = (
      await prisma.rates.findMany({
        select: { currency: true },
      })
    ).map((item) => item.currency)

    // 更新資料庫匯率
    const updateRates = existingCurrencies
      // 確認是否有API中沒有的幣種
      .filter((currency) => rateData[currency] !== undefined)
      .map((currency) =>
        prisma.rates.update({
          where: { currency },
          data: {
            rate: rateData[currency],
            latestUpdateTime: new Date(),
          },
        })
      )
    if (updateRates.length === 0) {
      throw new Error("沒有可更新的匯率資料")
    }
    await Promise.all(updateRates)
  } catch (err) {
    throw new Error(`資料更新失敗: ${err.message}`)
  }
}
//定時更新資料庫匯率資料
const scheduleRateUpdate = () => {
  //每5分鐘更新一次
  scheduleJob("*/5 * * * *", async () => {
    try {
      console.log("開始執行定時更新", new Date().toLocaleString("zh-TW", { timeZone: "Asia/Taipei" }))

      //拿到API匯率
      const rateData = await getRate()

      //資料庫更新
      await ratesUpdate(rateData)

      console.log({
        message: "定時更新成功",
        date: new Date().toLocaleString("zh-TW", { timeZone: "Asia/Taipei" }),
        counts,
      })
    } catch (err) {
      console.log({
        message: "定時更新失敗",
        date: new Date().toLocaleString("zh-TW", { timeZone: "Asia/Taipei" }),
        error: err.message,
        counts,
      })
    }
  })
}
//手動更新資料庫
router.get("/update", async (_req, res) => {
  try {
    //拿到API匯率
    const rateData = await getRate()

    //資料庫更新
    await ratesUpdate(rateData)

    res.status(200).json({
      message: "更新完成",
      counts,
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

//查找特定匯率
router.get("/:currency?", async (req, res) => {
  try {
    const currency = req.params.currency

    if (!currency) {
      return res.status(400).json({ message: "請提供幣種" })
    }
    //匯率資訊
    const rate = await prisma.rates.findUnique({
      where: { currency: currency },
    })
    if (!rate) {
      return res.status(404).json({ message: "資料庫沒有此幣種" })
    }
    res.status(200).json({
      currency: rate.currency,
      rate: rate.rate,
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

scheduleRateUpdate()
export default router
