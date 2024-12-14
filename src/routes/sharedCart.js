const express = require('express')
const router = express.Router()
const prisma = require('../configs/prisma');

// 取得共享購物車列表
router.get('/sharedCartList', async (req, res) => {
  const userId = "d9ee8caa-3dd2-4ca3-b72b-e0edfd19ae22" // 先用固定資料測試
  try {
    // 如果有這個使用者
    if (userId) {
      // 用 userId 找到 group_id
      let groupIdList = await prisma.shared_cart_users.findMany({
        where: {
          user_id: userId
        },
        select: {
          shared_cart_group_id: true
        }
      })
      // 取裡面的 shared_cart_group_id 欄位（不然會包在 {} 裡面
      groupIdList = groupIdList.map((object) => object.shared_cart_group_id)
      const sharedCartList = []
      for (let i = 0; i < groupIdList.length; i++) {
        // 找共享購物車名稱
        const sharedCartName = await prisma.shared_carts.findFirst({
          where: {
            group_id: groupIdList[i]
          },
          select: {
            name: true
          }
        })
        // 找成員
        let memberUserId = await prisma.shared_cart_users.findMany({
          where: {
            shared_cart_group_id: groupIdList[i],
            user_id: {
              not: userId
            }
          },
          select: {
            user_id: true
          }
        })
        memberUserId = memberUserId.map((object) => object["user_id"])
        let member = []
        for (let i = 0; i < memberUserId.length; i++) {
          const username = await prisma.users.findUnique({
            where: {
              userId: memberUserId[i]
            },
            select: {
              username: true
            }
          })
          member.push({ username: username["username"] })
        }
        member = member.map((object) => object.username)
        sharedCartList.push({ id: groupIdList[i], name: sharedCartName["name"], member })
      }
      res.json({
        sharedCartList,
      })
    }

  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: "伺服器錯誤" })
  }
})


// 取得特定共享購物車的產品列表
router.get('/sharedCartItem/:groupId?', async (req, res) => {
  const { groupId } = req.params
  // const userId = req.headers
  const userId = "d9ee8caa-3dd2-4ca3-b72b-e0edfd19ae22"
  try {
    const belongBy = await prisma.shared_cart_users.findMany({
      where: {
        shared_cart_group_id: parseFloat(groupId)
      },
      select: {
        user_id: true
      }
    })
    const belongByUserlist = []
    for (let i = 0; i < belongBy.length; i++) {
      belongByUserlist.push(belongBy[i]["user_id"])
    }
    const found = belongByUserlist.find((user) => user == userId)
    if (found) {
      let productIdList = await prisma.shared_carts.findMany({
        where: {
          group_id: parseFloat(groupId)
        },
        select: {
          product_id: true
        }
      })
      productIdList = productIdList.map((object) => object["product_id"])
      const productDataList = []
      for (let i = 0; i < productIdList.length; i++) {
        const productData = await prisma.products.findUnique({
          where: {
            product_id: productIdList[i]
          },
        })
        const imgPath = await prisma.product_images.findFirst({
          where: {
            product_id: productIdList[i],
            image_type: "main",
            order_sort: 1
          },
          select: {
            image_path: true
          }
        })
        const productQty = await prisma.shared_carts.findFirst({
          where: {
            product_id: productIdList[i],
            group_id: parseFloat(groupId)
          },
          select: {
            quantity: true
          }
        })
        productDataList.push({ ...productData, ...imgPath, ...productQty })
      }
      res.json(productDataList)
    } else {
      res.status(403).json({ message: "用戶沒有訪問這個共享購物車的權限" })
    }
  } catch (err){
    res.status(500).json("伺服器怪怪了")
  }
})


module.exports = router
