# Left_and_Right_Backend

這是 Left & Right 專題的後端專案。使用 Node.js 搭配 Express 框架開發，連接 MySQL 資料庫，提供 RESTful API 服務給前端專案使用。

## 系統需求

- Node.js 16.x 以上
- MySQL 8.0 以上
- npm 8.x 以上

## 開始使用

1. 克隆專案到本地
```bash
git clone https://github.com/your-username/Left_and_Right_Backend.git
cd Left_and_Right_Backend
```

2. 下載 database
- 下載 database 資料夾中的 .sql 檔案，並 import 到你本地的 MySQL 中

  
3. 安裝相依套件
```bash
npm install
```

4. 環境設定
- 複製 `.env.example` 檔案並命名為 `.env`
- 設定必要的環境變數：
```env
DATABASE_URL="mysql://user:password@localhost:3306/database_name"
PORT=3300
```

5. 初始化資料庫
```bash
# 從現有數據庫生成 Prisma schema
npx prisma db pull

# 生成 Prisma Client
npx prisma generate
```

5. 啟動開發伺服器
```bash
npm run dev
```

## 使用技術

- **Node.js** - JavaScript 執行環境
- **Express** - Web 應用程式框架
- **Prisma** - 下一代 ORM 工具
- **MySQL** - 關聯式資料庫
- **dotenv** - 環境變數管理
- **cors** - 跨域資源共享中介軟體

## 主要套件說明

- **[nodemon - npm](https://www.npmjs.com/package/nodemon)** (^3.0.x)
  - 用於開發環境中自動重啟應用程式
  - 監控原始碼變更，提升開發效率

- **[cors - npm](https://www.npmjs.com/package/cors)** (^2.8.x)
  - 處理跨域請求
  - 支援前端跨域存取 API

- **[dotenv - npm](https://www.npmjs.com/package/dotenv)** (^16.x)
  - 載入和管理環境變數
  - 分離配置與程式碼

- **[express - npm](https://www.npmjs.com/package/express)** (^4.18.x)
  - Node.js Web 應用程式框架
  - 處理 HTTP 請求和路由

- **[prisma - npm](https://www.npmjs.com/package/prisma)** (^5.x)
  - 現代化資料庫工具
  - 提供型別安全的資料庫存取

- **[@prisma/client - npm](https://www.npmjs.com/package/@prisma/client)**
  - Prisma 客戶端
  - 用於資料庫操作的 API


## 授權協議

本專案採用 MIT 授權 - 查看 [LICENSE](LICENSE) 檔案了解詳情

## 聯絡方式

- 專案維護者：Fang-33
- Email：33justworkplace@gmail.com

## 致謝

感謝所有對本專案做出貢獻的開發者們。
