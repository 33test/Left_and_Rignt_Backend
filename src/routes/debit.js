import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import db from '../configs/db.js'; // 假設這是 mysql2 連線設定
import ECPay from 'ecpay-payment'; // 綠界金流 SDK
import bodyParser from 'body-parser';

const router = express.Router();
const app = express();
app.use(bodyParser.json());
const ecpay = new ECPay({
  // 綠界提供的商店設定參數
  MerchantID: '3002599',
  HashKey: 'spPjZn66i0OhqJsQ', // 請替換成你從綠界管理後台獲取的 HashKey
  HashIV: 'hT5OJckN45isQTTs',  // 請替換成你從綠界管理後台獲取的 HashIV
});
router.post('/orderInsert', (req, res) => {
  const { customerInfo, orderNote, deliveryInfo, amount } = req.body;
  const userID = '10001';

  // 生成 UUID
  const deID = uuidv4();
  const cuID = uuidv4();
  const orID = uuidv4();

  // 開始資料庫事務
  db.beginTransaction((err) => {
    if (err) {
      return res.status(500).json({ message: '事務啟動失敗' });
    }

    // 插入送貨資料
    const deInsertQuery = `INSERT INTO deliver_pro_info(acName, acPhone, addr, city, postalCode, site, userID, delivrID) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    db.query(deInsertQuery, [
      deliveryInfo.recipientName,
      deliveryInfo.recipientPhone,
      deliveryInfo.address,
      deliveryInfo.city,
      deliveryInfo.postalCode,
      deliveryInfo.region,
      userID,
      deID,
    ], (err) => {
      if (err) {
        return db.rollback(() => {
          console.error('送貨資料插入錯誤:', err.message);
          res.status(500).json({ message: '送貨資料插入錯誤' });
        });
      }

      // 插入顧客資料
      const cuInsertQuery = `INSERT INTO customer_info (cuID, cuName, cuPhone, gender, userID) VALUES (?, ?, ?, ?, ?)`;
      db.query(cuInsertQuery, [cuID, customerInfo.name, customerInfo.phone, customerInfo.gender, userID], (err) => {
        if (err) {
          return db.rollback(() => {
            console.error('顧客資料插入錯誤:', err.message);
            res.status(500).json({ message: '顧客資料插入錯誤' });
          });
        }

        // 查詢購物車資料
        const checkQuery = `SELECT c.product_id, c.quantity, p.product_name FROM cart c
                    JOIN products p ON c.product_id = p.product_id
                    WHERE c.user_id = ?`;
        db.query(checkQuery, [userID], (err, cartResults) => {
          if (err) {
            return db.rollback(() => {
              console.error('查詢購物車資料錯誤:', err.message);
              res.status(500).json({ message: '查詢購物車資料錯誤' });
            });
          }
          if (cartResults.length === 0) {
            return db.rollback(() => {
              res.status(400).json({ message: '購物車為空' });
            });
          } // 生成購買商品的名稱
          const itemNames = cartResults.map((cartItem) => {
            return `${cartItem.product_name} (${cartItem.quantity})`; // 將商品名稱和數量組合成字串
          }).join('#'); // 使用逗號分隔
        

          // 插入購買產品並生成商品名稱
          const puInsertQuery = `INSERT INTO purchase_product(pu_id, user_id, product_id, quantity) VALUES (?, ?, ?, ?)`;
          let itemCount = 0;

          cartResults.forEach((cartItem) => {
            const puID = uuidv4(); // 為每件商品生成唯一 ID
            db.query(puInsertQuery, [puID, userID, cartItem.product_id, cartItem.quantity], (err) => {
              if (err) {
                return db.rollback(() => {
                  console.error('購買產品資料插入錯誤:', err.message);
                  res.status(500).json({ message: '購買產品資料插入錯誤' });
                });
              }

              
              itemCount++;

              // 當所有產品插入完成後清空購物車
              if (itemCount === cartResults.length) {
                const deleteQuery = `DELETE FROM cart WHERE user_id = ?`;
                db.query(deleteQuery, [userID], (err) => {
                  if (err) {
                    return db.rollback(() => {
                      console.error('清空購物車錯誤:', err.message);
                      res.status(500).json({ message: '清空購物車錯誤' });
                    });
                  }

                  // 插入訂單資料
                  const orInsertQuery = `INSERT INTO purchase_order(purchaseID, puID, DeliveryWay, DeliverySite, payWay, note, cuID, DeliverID) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
                  db.query(orInsertQuery, [orID, uuidv4(), '宅配', '台灣', '貨到付款', orderNote, cuID, deID], (err) => {
                    if (err) {
                      return db.rollback(() => {
                        console.error('訂單資料插入錯誤:', err.message);
                        res.status(500).json({ message: '訂單資料插入錯誤' });
                      });
                    }
              
      // 插入訂單完成後，處理綠界支付
      console.log(amount);
              console.log(itemNames); 
      const totalAmount = cartResults.reduce((sum, item) => sum + item.price * item.quantity, 0);
  
      const baseParams = {
        MerchantTradeNo: orID, // 訂單編號 (需唯一)
        MerchantTradeDate: new Date().toISOString().slice(0, 19).replace('T', ' '), // 訂單日期
        TotalAmount: '100', // 總金額
        TradeDesc: '購物網站商品訂購', // 訂單描述
       // ItemName: itemNames,
        ItemName:'XX商城商品一批X1',
        ReturnURL: 'https://yourwebsite.com/payment_return', // 支付結果通知 URL
        // OrderResultURL: 'https://yourwebsite.com/order_result', // 訂單完成通知 URL
        // PaymentType: 'aio',    
        // ChoosePayment: 'ALL',
        // EncryptType: 1,
      };
      console.log('yoyo')
      console.log(baseParams);
      try {
        // 生成支付連結
        const paymentForm = ecpay.payment_client.aio_check_out_all({
          parameters: baseParams,
        });
  
        db.commit((err) => {
          if (err) {
            return db.rollback(() => {
              console.error('提交事務錯誤:', err.message);
              res.status(500).json({ message: '提交事務錯誤' });
            });
          }
  
          // 回傳支付連結 HTML
          res.status(200).send(paymentForm);
        });
      } catch (err) {
        console.error('生成支付連結失敗:', err.message);
        db.rollback(() => {
          res.status(500).json({ message: '生成支付連結失敗' });
        });
      }
    });
  });
  
                  
                
              }
            });
          });
        });
      });
    });
  });
});




export default router;
