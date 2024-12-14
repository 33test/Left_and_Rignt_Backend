const express = require('express')
const router = express.Router()
const prisma = require('../configs/prisma');
const { object } = require('zod');
const e = require('express');

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
        for(let i = 0; i < memberUserId.length; i++){
          const username = await prisma.users.findUnique({
            where:{
              userId: memberUserId[i]
            },
            select: {
              username: true
            }
          })
          member.push({username:username["username"]})
        }
        member = member.map((object) => object.username)
        sharedCartList.push({ id: groupIdList[i], name: sharedCartName["name"], member})
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


module.exports = router
