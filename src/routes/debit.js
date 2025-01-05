import express from "express"
import { v4 as uuidv4 } from "uuid"
import db from "../configs/db.js"
import prisma from "../configs/prisma.js"
import ECPay from "ecpay-payment" // 綠界金流 SDK

const router = express.Router()

// 資料庫查詢的通用方法
const queryDatabase = (query, params) => {
  return new Promise((resolve, reject) => {
    db.query(query, params, (err, results) => {
      if (err) {
        reject(err)
      } else {
        resolve(results)
      }
    })
  })
}

// 處理綠界支付的方法
const createECPayment = (orderId, amount = "1000") => {
  const baseParams = {
    MerchantTradeNo: orderId, // 訂單編號 (需唯一)
    MerchantTradeDate: new Date()
      .toLocaleString("zh-TW", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      })
      .replace(/\//g, "/"), // 格式: YYYY/MM/DD HH:mm:ss
    TotalAmount: amount, // 訂單總金額
    TradeDesc: "購物網站商品訂購", // 訂單描述
    ItemName: "XX商城商品一批X1#123", // 綠界金流建議不要改，容易在測試環境中出錯，故寫死
    ReturnURL: `${process.env.CORS_ALLOW_HOST}/Debit`, // 支付結果通知 URL
    OrderResultURL: `${process.env.CORS_ALLOW_HOST}/Debit`, // 訂單完成通知 URL
    ClientBackURL: `${process.env.CORS_ALLOW_HOST}/MemberOrder`, // 返回商店網址
  }

  const ecpay = new ECPay({
    // 綠界提供的商店設定參數
    MerchantID: "3002599",
    HashKey: "spPjZn66i0OhqJsQ",
    HashIV: "hT5OJckN45isQTTs",
  })

  return ecpay.payment_client.aio_check_out_all(baseParams)
}

// 處理訂單插入的方法
const createOrder = async (orderData) => {
  const { orID, DeliveryWay, DeliverySite, payWay, orderNote, cuID, deID } = orderData
  const orInsertQuery = `INSERT INTO purchase_order(purchaseID, puID, DeliveryWay, DeliverySite, payWay, note, cuID, DeliverID) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`

  await queryDatabase(orInsertQuery, [orID, uuidv4(), DeliveryWay, DeliverySite, payWay, orderNote, cuID, deID])
}

// 處理購物車商品插入的方法
const insertPurchaseProducts = async (cartResults, userID) => {
  if (cartResults.length === 0) {
    throw new Error("購物車為空")
  }

  const puInsertQuery = `INSERT INTO purchase_product(pu_id, user_id, product_id, quantity) VALUES (?, ?, ?, ?)`

  const insertPromises = cartResults.map((cartItem) => queryDatabase(puInsertQuery, [uuidv4(), userID, cartItem.product_id, cartItem.quantity]))

  await Promise.all(insertPromises)
}

// 清空一般購物車的方法
const clearNormalCart = async (userID) => {
  const deleteQuery = `DELETE FROM cart WHERE user_id = ?`
  await queryDatabase(deleteQuery, [userID])
}

// 清空共享購物車的方法
const clearSharedCart = async (groupId) => {
  return prisma.shared_carts.updateMany({
    where: {
      group_id: groupId,
      is_deleted: false,
    },
    data: {
      is_deleted: true,
    },
  })
}

// 執行資料庫事務的通用方法
const executeTransaction = (operation) => {
  return new Promise((resolve, reject) => {
    db.beginTransaction((err) => {
      if (err) {
        return reject(err)
      }

      operation()
        .then(() => {
          db.commit((err) => {
            if (err) {
              return db.rollback(() => {
                reject(err)
              })
            }
            resolve()
          })
        })
        .catch((err) => {
          db.rollback(() => {
            reject(err)
          })
        })
    })
  })
}

router.post("/orderInsert", async (req, res) => {
  try {
    const { customerInfo, orderNote, deliveryInfo, DeliverySite, DeliveryWay, payWay, isSharedCart, groupId } = req.body
    const userID = req.headers.userid

    // 生成 UUID
    const deID = uuidv4()
    const cuID = uuidv4()
    const orID = uuidv4().slice(-10) // 因為綠界訂單編號限制長度，所以只取後 10 碼

    // 開始資料庫事務
    await executeTransaction(async () => {
      // 插入送貨資料
      const deInsertQuery = `INSERT INTO deliver_pro_info(acName, acPhone, addr, city, postalCode, site, userID, delivrID) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
      await queryDatabase(deInsertQuery, [
        deliveryInfo.recipientName,
        deliveryInfo.recipientPhone,
        deliveryInfo.address,
        deliveryInfo.city,
        deliveryInfo.postalCode,
        deliveryInfo.region,
        userID,
        deID,
      ])

      // 插入顧客資料
      const cuInsertQuery = `INSERT INTO customer_info (cuID, cuName, cuPhone, gender, userID) VALUES (?, ?, ?, ?, ?)`
      await queryDatabase(cuInsertQuery, [cuID, customerInfo.name, customerInfo.phone, customerInfo.gender, userID])

      // 根據購物車類型選擇查詢方式
      let cartResults
      if (isSharedCart) {
        // 查詢共享購物車
        cartResults = await prisma.shared_carts.findMany({
          where: {
            group_id: groupId,
            is_deleted: false,
          },
          select: {
            product_id: true,
            quantity: true,
          },
        })
      } else {
        // 查詢一般購物車
        const checkQuery = `SELECT c.product_id, c.quantity FROM cart c
          JOIN products p ON c.product_id = p.product_id
          WHERE c.user_id = ?`
        cartResults = await queryDatabase(checkQuery, [userID])
      }

      // 插入購買產品資料
      await insertPurchaseProducts(cartResults, userID)

      // 清空購物車
      if (isSharedCart) {
        await clearSharedCart(groupId)
      } else {
        await clearNormalCart(userID)
      }

      // 創建訂單
      await createOrder({ orID, DeliveryWay, DeliverySite, payWay, orderNote, cuID, deID })

      if (payWay !== "貨到付款") {
        // 生成支付連結
        const paymentForm = createECPayment(orID)

        // 回傳支付連結 HTML
        res.status(200).send(paymentForm)
      } else {
        res.status(200).json({ message: "訂單建立成功" })
      }
    })
  } catch (error) {
    console.error("訂單處理錯誤:", error)
    res.status(500).json({ message: error.message || "訂單處理失敗" })
  }
})

export default router
