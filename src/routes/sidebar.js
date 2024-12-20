import express from "express"
import prisma from "../configs/prisma.js"
const router = express.Router()
// 查詢父項目 API
router.get("/parents", async (req, res) => {
  try {
    const parents = await prisma.categories.findMany({
      where: {
        parent_id: null,
      },
      include: {
        children: true, // 查詢有子項目的父項目
      },
    })

    // 轉換資料，將 hasChildren 屬性加到每個父項目中
    const result = parents.map((parent) => ({
      ...parent,
      hasChildren: parent.children.length > 0,
    }))

    res.json(result) // 返回父項目資料，帶 hasChildren 屬性
  } catch (err) {
    console.error("查詢失敗:", err)
    return res.status(500).send("伺服器錯誤")
  }
})

// 查詢子項目 API
router.get("/children", async (req, res) => {
  const parentId = req.query.parent_id

  if (!parentId) {
    return res.status(400).send("缺少 parent_id")
  }

  try {
    const children = await prisma.categories.findMany({
      where: {
        parent_id: Number(parentId),
      },
    })

    res.json(children) // 返回子項目資料
  } catch (err) {
    console.error("查詢失敗:", err)
    return res.status(500).send("伺服器錯誤")
  }
})

export default router
