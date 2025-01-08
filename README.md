# Left_and_Right_Backend

這是 Left & Right 電商網站的後端專案。使用 Node.js 搭配 Express 框架開發，採用 Prisma ORM 連接 MySQL 資料庫，提供 RESTful API 服務。

- [Left & Right 網站](https://left-and-right-accessory.up.railway.app/)
- [Left & Right 前端專案](https://github.com/groupLR/Left_and_Right.git)

# 致敬

本專案的設計與功能參考了 Bonny & Read 官方網站，純粹作為學習用途，幫助我們提升前端開發與架構設計的能力。特別感謝原網站提供的靈感與參考資料，對我們的設計與學習過程帶來了重要的啟發。

# 版權聲明

圖片版權歸 Bonny & Read 團隊所有，本專案僅作為學習用途，未經授權不得商業使用或再分發。

## 系統架構

- **框架**：Express
- **資料庫**：MySQL
- **ORM**：Prisma
- **即時共編**：WebSocket (ws)
- **身份驗證**：JWT, Google OAuth

## 主要功能

- 會員系統（登入、註冊、Google OAuth）
- 商品管理
  - 搜尋、篩選、排序、分頁
- 匯率轉換系統
- 購物車系統
- 訂單管理
- 共享購物車（即時同步）
  - 多人共同編輯
  - 即時資料同步
  - 購物車群組管理

## 團隊成員

### 方玟蓉

- **GitHub**: [Fang-33](https://github.com/Fang-33)
- **Email**: 33justworkplace@gmail.com
- **負責功能**：
  - Google OAuth 登入整合
  - 共享購物車功能開發
  - 商品列表（分頁、篩選、排序）
  - 聯名商品功能
  - 購物車重構
  - 商品與共享購物車資料庫設計

### 陳瑩軒

- **GitHub**: [U0914015](https://github.com/U0914015)
- **Email**: lily414016@gmail.com
- **負責功能**：
  - 購物車功能
  - 結帳流程實作
  - 購物車與結帳相關 API 開發
  - 交易相關資料庫設計

### 陳予晴

- **GitHub**: [Cloverche](https://github.com/Cloverche)
- **Email**: Sunny40224@gmail.com
- **負責功能**：
  - 會員系統開發
  - 商品詳情功能
  - 匯率轉換功能
  - 導覽列功能
  - 使用者資料庫設計

### 楊頌偉

- **GitHub**: [rocksypig](https://github.com/rocksypig)
- **Email**: rocksypig@gmail.com
- **負責功能**：
  - 訂單管理系統
  - 商品追蹤功能
  - 商品評論系統
  - 評論資料庫設計

### 陳心妍

- **GitHub**: [CHENPODO](https://github.com/CHENPODO)
- **Email**: podoyo23@gmail.com
- **負責功能**：
  - 商品搜尋功能
  - 優惠券系統
  - 前端頁尾開發

### 張翰浥

- **GitHub**: [Chang-Han-Yi](https://github.com/Chang-Han-Yi)
- **Email**: tommy890220@gmail.com
- **負責功能**：
  - 導覽列切版
  - 側邊欄功能
  - 會員資料

### 李沁騰

- **GitHub**: [leonli8731](https://github.com/leonli8731)
- **Email**: 6011212@gmail.com
- **負責功能**：
  - 首頁輪播功能
  - 分店資訊系統
  - 結帳介面開發

## 系統需求

- Node.js 16.x 以上
- MySQL 8.0 以上
- npm 8.x 以上
- WebSocket 支援

## 開始使用

1. 克隆專案

```bash
git clone https://github.com/groupLR/Left_and_Rignt_Backend.git
cd Left_and_Right_Backend
```

2. 安裝依賴

```bash
npm install
```

3. 環境設定

複製 `.env.example` 檔案為 `.env`，以便為專案設定環境變數

4. 資料庫設定

```
# 建立資料表
npx prisma migrate dev

# 初始化測試資料
npx prisma db seed
```

5. 啟動開發伺服器

```
npm run dev
```

## 開發指南

- Commit 訊息格式：type(scope): #issueId message
- 分支管理：採用 GitHub Flow
- 程式碼審查：所有合併請求需經過 PR 審查

## 授權協議

本專案採用 MIT 授權 - 詳見 LICENSE 檔案
