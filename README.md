# Left_and_Right_Backend

這是 Left & Right 電商網站的後端專案。使用 Node.js 搭配 Express 框架開發，採用 Prisma ORM 連接 MySQL 資料庫，提供 RESTful API 服務。

- [Left & Right 網站](https://left-and-right-accessory.up.railway.app/)
- [Left & Right 前端專案](https://github.com/groupLR/Left_and_Right.git)

## 系統架構

- **框架**：Express.js 4.21.1
- **資料庫**：MySQL 8.0
- **ORM**：Prisma 6.0.0
- **身份驗證**：JWT, Google OAuth
- **主要套件**：
  - dotenv：環境變數管理
  - cors：跨域資源共享
  - axios：HTTP 請求
  - bcrypt：密碼加密
  - cheerio：網頁爬蟲
  - uuid：唯一識別碼生成
  - zod：資料驗證
  - jsonwebtoken：JWT 身份驗證
  - mysql2：MySQL 驅動程式
  - node-schedule：排程任務

## 團隊成員

### 方玟蓉

- **GitHub**: [Fang-33](https://github.com/Fang-33)
- **Email**: 33justworkplace@gmail.com
- **負責功能**：
  - Google OAuth 登入整合
  - 共享購物車功能開發
  - 商品列表（分頁、篩選、排序）
  - 聯名商品功能
  - 購物車重購功能
  - 商品與共享購物車資料庫設計

### 陳瑩軒

- **GitHub**: [U0914015](https://github.com/U0914015)
- **Email**: lily414016@gmail.com
- **負責功能**：
  - 購物車功能開發
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
  - 導覽系統開發
  - 側邊欄功能
  - 會員資料整合

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

## 開始使用

1. 克隆專案

```bash
git clone https://github.com/your-username/Left_and_Right_Backend.git
cd Left_and_Right_Backend
```

2. 安裝依賴

```bash
npm install
```

3. 環境設定

- 複製 .env.example 為 .env
- 設定環境變數，以下範例

```markdown
DATABASE_URL="mysql://user:password@localhost:3306/database_name"
CORS_ALLOW_HOST=http://localhost:5173
SECRET_KEYT="your-jwt-secret"
GOOGLE_CLIENT_ID="your-google-client-id"
EXCHANGE_RATE_URL=https://v6.exchangerate-api.com/v6/
```

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

## 主要功能

- 會員系統（登入、註冊、Google OAuth）
- 商品管理
- 購物車系統
- 訂單管理
- 共享購物車

## 開發指南

- Commit 訊息格式：type(scope): #issueId message
- 分支管理：採用 GitHub Flow
- 程式碼審查：所有合併請求需經過 PR 審查

## 授權協議

本專案採用 MIT 授權 - 詳見 LICENSE 檔案
聯絡方式
若有任何問題或建議，請聯絡：

## 專案維護者：

- Fang-33
- Email：33justworkplace@gmail.com

## 致謝

感謝所有團隊成員的貢獻與努力。
