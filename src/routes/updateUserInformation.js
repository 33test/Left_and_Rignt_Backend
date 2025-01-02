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

  if (username !== "" && username !== null && username !== "null") {
    updateData.username = username // 更新 username
  }
  if (email !== "" && email !== null && email !== "null") {
    // 檢查 email 格式是否有效
    if (emailRegex.test(email)) {
      updateData.email = email // 更新 email
    } else {
      return res.status(400).send("Email 格式無效") // 如果 email 格式錯誤，返回錯誤
    }
  }
  if (phone === "" || phone === null || phone === "null") {
    updateData.phone = null // 如果是空字串或 null 或 'null'，設為 null
  } else if (phone !== undefined) {
    updateData.phone = phone.toString() // 確保電話號碼是字串型別
  }
  if (birthday === "" || birthday === null || birthday === "null") {
    updateData.birthday = null // 如果是空字串或 null 或 'null'，設為 null
  } else if (birthday !== undefined) {
    updateData.birthday = new Date(birthday) // 將生日轉換為日期型別
  }
  if (mobile_phone === "" || mobile_phone === null || mobile_phone === "null") {
    updateData.mobile_phone = null // 如果是空字串或 null 或 'null'，設為 null
  } else if (mobile_phone !== undefined) {
    updateData.mobile_phone = mobile_phone.toString() // 確保手機號碼是字串型別
  }
  if (from_store === "" || from_store === null || from_store === "null") {
    updateData.from_store = null // 如果是空字串或 null 或 'null'，設為 null
  } else if (from_store !== undefined) {
    updateData.from_store = from_store // 更新 from_store
  }
  if (
    introduced_by === "" ||
    introduced_by === null ||
    introduced_by === "null"
  ) {
    updateData.introduced_by = null // 如果是空字串或 null 或 'null'，設為 null
  } else if (introduced_by !== undefined) {
    updateData.introduced_by = introduced_by // 更新 introducer_by
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
