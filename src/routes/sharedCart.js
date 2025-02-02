import express from "express"
import prisma from "../configs/prisma.js"
import { v4 as uuidv4 } from "uuid"
const router = express.Router()

// 取得共享購物車列表
router.get("/sharedCartList", async (req, res) => {
  const userId = req.headers.userid
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

// 取得特定共享購物車資訊
router.get("/sharedCartItem/:groupId?", async (req, res) => {
  const { groupId } = req.params
  const userId = req.headers.userid

  try {
    // 先找到這個共享購物車的成員
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
    // 如果這個使用者有權限，取資訊
    if (found) {
      // 共享購物車資訊
      const cartName = await prisma.shared_carts.findFirst({
        where: {
          group_id: groupId,
        },
        select: {
          name: true,
        },
      })

      const memberName = []
      for (let i = 0; i < belongByUserlist.length; i++) {
        const username = await prisma.users.findUnique({
          where: {
            userId: belongByUserlist[i],
          },
          select: {
            username: true,
          },
        })
        memberName.push(username["username"])
      }

      // 產品資訊
      let productIdList = await prisma.shared_carts.findMany({
        where: {
          AND: {
            group_id: groupId,
            is_deleted: false,
          },
        },
        select: {
          product_id: true,
        },
      })
      // 移除 null 並取出 product_id
      productIdList = productIdList.filter((productId) => productId["product_id"] !== null).map((object) => object["product_id"])

      // 如果這個共享購物車裡面沒有商品
      if (productIdList[0] === null) {
        res.json({ info: { cartName: cartName["name"], memberName }, productDataList: [] })
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
          imgPath = `${process.env.API_URL}/${imgPath.image_path}`
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

        res.json({ info: { cartName: cartName["name"], memberName }, productDataList })
      }
    } else {
      res.status(403).json({ message: "用戶沒有訪問這個共享購物車的權限", belongByUserlist })
    }
  } catch (err) {
    res.status(500).json({ message: err.message })
    console.log(err.message)
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

// 新增好友到共享購物車
router.post("/addMemberToSharedCart", async (req, res) => {
  const { groupId, memberEmails } = req.body
  try {
    const memberUserId = await Promise.all(
      // 將 memberEmail 轉換成 userId
      memberEmails.map(async (email) => {
        const user = await prisma.users.findUnique({
          where: {
            email,
          },
          select: {
            userId: true,
          },
        })
        return user?.userId
      })
    )
    // 過濾掉已存在的成員再新增
    const memberNeedToAdd = await Promise.all(
      memberUserId.map(async (userId) => {
        const found = await prisma.shared_cart_users.findFirst({
          where: {
            shared_cart_group_id: groupId,
            user_id: userId,
          },
        })
        return found ? null : userId // 如果找到就返回 null，否則返回 userId
      })
    )

    // 過濾掉 null 值
    const filteredMembers = memberNeedToAdd.filter((userId) => userId !== null)

    // 新增成員
    if (filteredMembers.length === 0) {
      return res.json({ message: "沒有新增任何好友" })
    }
    await Promise.all(
      filteredMembers.map((userId) =>
        prisma.shared_cart_users.create({
          data: {
            shared_cart_group_id: groupId,
            user_id: userId,
          },
        })
      )
    )
    res.json({ message: "新增好友成功", newMembers: filteredMembers })
  } catch (err) {
    res.status(500).json({
      message: "新增好友失敗",
      err: err.message,
    })
  }
})

// 將商品新增到共享購物車、如果已經有了就增加購物車商品數量
router.post("/sharedCart/addProduct/:groupId", async (req, res) => {
  const { groupId } = req.params
  const productId = parseInt(req.body.productId)
  const { quantity } = req.body

  try {
    // 檢查共享購物車是否存在
    const sharedCartExist = await prisma.shared_carts.findFirst({
      where: {
        group_id: groupId,
      },
    })
    if (!sharedCartExist) {
      return res.status(404).json({ message: "找不到共享購物車" })
    }
    // 檢查商品是否存在，存在的話更新數量，不存在的話新增
    const productExist = await prisma.shared_carts.findFirst({
      where: {
        group_id: groupId,
        product_id: productId,
        is_deleted: false,
      },
      select: { id: true, quantity: true },
    })
    // 如果商品已存在，更新數量
    if (productExist) {
      // 取得現有數量
      const currentQty = productExist.quantity
      await prisma.shared_carts.update({
        where: {
          id: productExist.id,
        },
        data: {
          quantity: currentQty + quantity,
        },
      })
      res.json({ message: "更新商品成功", data: { groupId, productId, quantity: currentQty + quantity } })
    } else {
      // 商品是否曾經被刪除過
      const deletedProduct = await prisma.shared_carts.findFirst({
        where: {
          group_id: groupId,
          product_id: productId,
          is_deleted: true,
        },
      })
      // 如果刪除過，更新他
      if (deletedProduct) {
        await prisma.shared_carts.update({
          where: {
            id: deletedProduct.id,
          },
          data: {
            quantity,
            is_deleted: false,
          },
        })
        res.json({ message: "商品新增成功", data: { groupId, productId, quantity } })
      } else {
        // 表內完全沒有這筆資料，創建一筆
        await prisma.shared_carts.create({
          data: {
            group_id: groupId,
            name: sharedCartExist.name,
            product_id: productId,
            quantity,
          },
        })
        res.json({ message: "商品新增成功", data: { groupId, productId, quantity } })
      }
    }
  } catch (err) {
    res.status(500).json({
      message: "新增商品失敗",
      err: err.message,
    })
  }
})

// 更新共享購物車內商品數量
router.put("/sharedCart/updateProductQty/:groupId", async (req, res) => {
  const { groupId } = req.params
  const { productId, totalQty } = req.body
  try {
    const productNeedToUpdatedId = await prisma.shared_carts.findFirst({
      where: {
        AND: {
          group_id: groupId,
          product_id: productId,
        },
      },
      select: {
        id: true,
      },
    })

    if (!productNeedToUpdatedId) {
      res.status(404).json({ message: "共享購物車內沒有此商品" })
    } else {
      const updatedData = await prisma.shared_carts.update({
        where: {
          id: productNeedToUpdatedId.id,
        },
        data: {
          quantity: totalQty,
        },
      })
      res.json({ message: "更新共享購物車數量成功", updatedData })
    }
  } catch (err) {
    res.status(500).json({ message: "更新共享購物車商品數量失敗", err })
  }
})

// 刪除共享購物車內的商品
router.delete("/sharedCart/deleteProduct/:groupId", async (req, res) => {
  const { groupId } = req.params
  const { productId } = req.body
  try {
    // 確認有共享購物車
    const foundSharedCart = await prisma.shared_carts.findFirst({
      where: {
        group_id: groupId,
      },
    })
    if (!foundSharedCart) {
      return res.status(404).json({ message: "查無此共享購物車" })
    }
    // 確認共享購物車內有未刪除這個商品
    const foundProduct = await prisma.shared_carts.findFirst({
      where: {
        AND: {
          group_id: groupId,
          product_id: productId,
          is_deleted: false,
        },
      },
    })
    if (!foundProduct) {
      return res.status(404).json({ message: "共享購物車內沒有此商品" })
    }
    // 軟刪除
    await prisma.shared_carts.update({
      where: {
        id: foundProduct.id,
      },
      data: {
        is_deleted: true,
      },
    })
    res.json({ message: "成功刪除商品" })
  } catch (err) {
    res.status(500).json({ message: "伺服器錯誤" })
  }
})

export default router
