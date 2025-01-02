import express from "express"
import prisma from "../configs/prisma.js" // 使用 Prisma 作為資料庫 ORM
const router = express.Router()

router.put("/updateInformation", async (req, res) => {
  const {
    uid,
    username,
    email,
    phone,
    birthday,
    from_store,
    mobile_phone,
    introduced_by,
  } = req.body

  console.log("接收到的資料:", req.body)

  // 構建一個空的更新資料對象
  const updateData = {}
  // 定義 email 的正則表達式
  const emailRegex =
    /^[\w-]+(\.[\w-]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*(\.[a-zA-Z]{2,})$/

  // 更新 username
  if (username && username !== "null") {
    updateData.username = username
  }

  // 更新 email
  if (email && email !== "null") {
    if (emailRegex.test(email)) {
      updateData.email = email
    } else {
      return res.status(400).send("Email 格式無效")
    }
  }

  // 更新 phone
  if (!phone) {
    updateData.phone = null
  } else {
    updateData.phone = phone.toString()
  }

  // 更新 birthday
  if (!birthday) {
    updateData.birthday = null
  } else {
    updateData.birthday = new Date(birthday)
  }

  // 更新 mobile_phone
  if (!mobile_phone) {
    updateData.mobile_phone = null
  } else {
    updateData.mobile_phone = mobile_phone.toString()
  }

  // 更新 from_store
  if (!from_store) {
    updateData.from_store = null
  } else {
    updateData.from_store = from_store
  }

  // 更新 introduced_by
  if (!introduced_by) {
    updateData.introduced_by = null
  } else {
    updateData.introduced_by = introduced_by
  }

  console.log("更新資料:", updateData)

  try {
    const user = await prisma.users.update({
      where: {
        userId: uid, // 使用 uid 查找用戶
      },
      data: updateData, // 傳遞更新的資料
    })
    return res.json(user) // 返回更新後的資料
  } catch (err) {
    console.error("更新失敗:", err)
    return res.status(500).send("伺服器錯誤")
  }
})

export default router
