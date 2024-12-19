import express from "express"
import prisma from "../configs/prisma.js"
import { v4 as uuidv4 } from "uuid"
const router = express.Router()

// 取得共享購物車列表
router.get("/sharedCartList", async (req, res) => {
  const userId = "d9ee8caa-3dd2-4ca3-b72b-e0edfd19ae22" // 先用固定資料測試
  try {
    // 如果有這個使用者
    if (userId) {
      // 用 userId 找到 group_id
      let groupIdList = await prisma.shared_cart_users.findMany({
        where: {
          user_id: userId,
          is_deleted: false,
        },
        select: {
          shared_cart_group_id: true,
        },
      })
      // 取裡面的 shared_cart_group_id 欄位（不然會包在 {} 裡面
      groupIdList = groupIdList.map((object) => object.shared_cart_group_id)
      const sharedCartList = []
      for (let i = 0; i < groupIdList.length; i++) {
        // 找共享購物車名稱
        const sharedCartName = await prisma.shared_carts.findFirst({
          where: {
            group_id: groupIdList[i],
          },
          select: {
            name: true,
          },
        })
        // 找成員
        let memberUserId = await prisma.shared_cart_users.findMany({
          where: {
            shared_cart_group_id: groupIdList[i],
            user_id: {
              not: userId,
            },
          },
          select: {
            user_id: true,
          },
        })
        memberUserId = memberUserId.map((object) => object["user_id"])
        let member = []
        for (let i = 0; i < memberUserId.length; i++) {
          const username = await prisma.users.findUnique({
            where: {
              userId: memberUserId[i],
            },
            select: {
              username: true,
            },
          })
          member.push({ username: username["username"] })
        }
        member = member.map((object) => object.username)
        sharedCartList.push({
          id: groupIdList[i],
          name: sharedCartName["name"],
          member,
        })
      }
      res.json({
        sharedCartList,
      })
    }
  } catch (err) {
    console.log(err.message)
    res.status(500).json({ message: "伺服器錯誤" })
  }
})

// 取得共享購物車的列表
router.get("/sharedCartItem/:groupId?", async (req, res) => {
  const { groupId } = req.params
  // const userId = req.headers
  const userId = "d9ee8caa-3dd2-4ca3-b72b-e0edfd19ae22"
  try {
    const belongBy = await prisma.shared_cart_users.findMany({
      where: {
        shared_cart_group_id: groupId,
      },
      select: {
        user_id: true,
      },
    })
    const belongByUserlist = []
    for (let i = 0; i < belongBy.length; i++) {
      belongByUserlist.push(belongBy[i]["user_id"])
    }
    const found = belongByUserlist.find((user) => user == userId)
    if (found) {
      let productIdList = await prisma.shared_carts.findMany({
        where: {
          group_id: groupId,
        },
        select: {
          product_id: true,
        },
      })

      productIdList = productIdList.map((object) => object["product_id"])
      if (productIdList[0] === null) {
        res.json([])
      } else {
        const productDataList = []
        for (let i = 0; i < productIdList.length; i++) {
          const productData = await prisma.products.findUnique({
            where: {
              product_id: productIdList[i],
            },
          })
          let imgPath = await prisma.product_images.findFirst({
            where: {
              product_id: productIdList[i],
              image_type: "main",
              order_sort: 1,
            },
            select: {
              image_path: true,
            },
          })
          imgPath = `http://localhost:3300/${imgPath.image_path}`
          const productQty = await prisma.shared_carts.findFirst({
            where: {
              product_id: productIdList[i],
              group_id: groupId,
            },
            select: {
              quantity: true,
            },
          })
          productDataList.push({
            ...productData,
            image_path: imgPath,
            ...productQty,
          })
        }
        res.json(productDataList)
      }
    } else {
      res.status(403).json({ message: "用戶沒有訪問這個共享購物車的權限" })
    }
  } catch (err) {
    res.status(500).json("伺服器怪怪了")
  }
})

// 創建共享購物車
router.post("/sharedCart", async (req, res) => {
  const { sharedCartName, creatorUID, memberEmail } = req.body
  const sharedCartGroupId = uuidv4()

  try {
    const memberUserId = await prisma.users.findUnique({
      where: {
        email: memberEmail,
      },
      select: {
        userId: true,
      },
    })

    // 使用事務確保所有操作都成功或都失敗
    await prisma.$transaction([
      prisma.shared_cart_users.createMany({
        data: [
          {
            shared_cart_group_id: sharedCartGroupId,
            user_id: memberUserId.userId,
          },
          {
            shared_cart_group_id: sharedCartGroupId,
            user_id: creatorUID,
          },
        ],
      }),

      prisma.shared_carts.create({
        data: {
          group_id: sharedCartGroupId,
          name: sharedCartName,
        },
      }),
    ])

    res.json({ message: "創建共享購物車成功", groupId: sharedCartGroupId })
  } catch (err) {
    res.status(500).json({
      message: "創建共享購物車失敗",
      err: err.message,
    })
  }
})

// 刪除共享購物車
router.delete("/deleteSharedCart/:groupId?", async (req, res) => {
  const { groupId } = req.params
  try {
    await prisma.$transaction([
      prisma.shared_cart_users.updateMany({
        where: {
          shared_cart_group_id: groupId,
          is_deleted: false,
        },
        data: {
          is_deleted: true,
        },
      }),

      prisma.shared_carts.updateMany({
        where: {
          group_id: groupId,
          is_deleted: false,
        },
        data: {
          is_deleted: true,
        },
      }),
    ])
    res.json({ message: "刪除成功" })
  } catch (err) {
    res.status(500).json({
      message: "刪除共享購物車失敗",
      err: err,
    })
  }
})

export default router
