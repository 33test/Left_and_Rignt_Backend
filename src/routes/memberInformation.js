import express from "express"
import prisma from "../configs/prisma.js"
const router = express.Router()

router.get("/memberInformation", async (req, res) => {
  const { uid } = req.headers

  try {
    const user = await prisma.users.findUnique({
      where: {
        userId: uid,
      },
    })
    if (user) {
      return res.json(user)
    } else {
      return res.status(404).send("使用者未找到")
    }
  } catch (err) {
    console.error("查詢失敗:", err)
    return res.status(500).send("伺服器錯誤")
  }
})

export default router
