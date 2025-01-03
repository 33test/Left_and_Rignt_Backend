import express from "express"
import prisma from "../configs/prisma.js"
import nodemailer from "nodemailer"
const router = express.Router()

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_SERVICE_AUTH_USER,
    pass: process.env.EMAIL_SERVICE_AUTH_PW,
  },
})

router.post("/", async (req, res) => {
  try {
    const { fullUrl, sendTo, sentBy } = req.body

    // 等待所有資料庫查詢完成
    const userEmailsPromises = sendTo.map((user) =>
      prisma.users.findMany({
        where: { username: user },
        select: { email: true },
      })
    )

    const userEmailsResults = await Promise.all(userEmailsPromises)

    // 提取 email 地址
    const emailAddresses = userEmailsResults
      .flat()
      .map((user) => user.email)
      .filter((email) => email) // 過濾掉空值

    if (emailAddresses.length === 0) {
      return res.status(400).json({
        success: false,
        message: "沒有找到有效的收件者郵箱",
      })
    }

    const mailOptions = {
      from: process.env.EMAIL_SERVICE_AUTH_USER,
      to: emailAddresses.join(", "), // 將收信的使用者信箱地址用逗號連接
      subject: `[L & R] ${sentBy}與你共享購物車`,
      html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #333;">Hey!👋 ${sentBy} 邀請你加入購物派對!🎆</h2>
      
      <div style="background-color: #f8f8f8; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p style="font-size: 16px; line-height: 1.5;">一起逛街購物更有趣!</p>
        <p style="font-size: 16px; line-height: 1.5;">現在就加入共享購物車，分享你的購物清單，互相交流推薦好物。</p>
        <p style="font-size: 16px; line-height: 1.5;">開啟愉快的購物時光吧!</p>
      </div>
      
      <div style="margin-top: 30px;">
        <p style="margin-bottom: 10px;">點擊進入：</p>
        <a href="${fullUrl}" style="display: inline-block; background-color: #0f4662; color: white; padding: 12px 25px; text-decoration: none; border-radius: 4px;">立即加入購物車</a>
      </div>

      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666;">
        <p>這是系統自動發送的郵件，請勿直接回覆。</p>
      </div>
    </div>
  `,
    }

    // 發送郵件
    const info = await transporter.sendMail(mailOptions)

    return res.json({
      success: true,
      message: "郵件發送成功",
      info: info,
    })
  } catch (error) {
    console.error("發送郵件錯誤:", error)
    return res.status(500).json({
      success: false,
      message: "發送郵件失敗",
      error: error.message,
    })
  }
})

export default router
