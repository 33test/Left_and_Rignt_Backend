import express from "express"
import prisma from "../configs/prisma.js"
const router = express.Router()

// 查詢大類別 API
router.get("/", async (_req, res) => {
  try {
    //找到大類別
    const parentsCategories = await prisma.categories.findMany({
      where: {
        parent_id: null,
      },
      select: {
        categories_id: true,
        category_name: true,
      },
    })
    //找到小類別
    const childrenCategories = await prisma.categories.findMany({
      where: {
        parent_id: { not: null },
      },
      select: {
        categories_id: true,
        category_name: true,
        parent_id: true,
      },
    })
    //兩者結合
    const groupCategories = parentsCategories.reduce((acc, cur) => {
      acc[cur.categories_id] = {
        category_id: cur.categories_id,
        category_name: cur.category_name,
        children: [],
      }
      return acc
    }, {})
    childrenCategories.forEach((child) => {
      if (groupCategories[child.parent_id]) {
        groupCategories[child.parent_id].children.push({
          categories_id: child.categories_id,
          category_name: child.category_name,
        })
      }
    })
    res.status(200).json(groupCategories)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
