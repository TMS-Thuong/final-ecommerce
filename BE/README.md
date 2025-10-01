# 🛍️ E-Commerce Backend API

Backend API cho hệ thống thương mại điện tử được xây dựng bằng **Fastify**, **TypeScript**, **Prisma ORM**, và **PostgreSQL**.

---

## 📋 Mục Lục

- [Tính Năng](#-tính-năng)
- [Công Nghệ Sử Dụng](#-công-nghệ-sử-dụng)
- [Cấu Trúc Thư Mục](#-cấu-trúc-thư-mục)
- [Cài Đặt](#-cài-đặt)
- [Cấu Hình](#-cấu-hình)
- [Chạy Ứng Dụng](#-chạy-ứng-dụng)
- [API Documentation](#-api-documentation)
- [Database Schema](#-database-schema)
- [Scripts](#-scripts)
- [Docker](#-docker)
- [Troubleshooting](#-troubleshooting)

---

## ✨ Tính Năng

### 🔐 Authentication & Authorization
- Đăng ký/Đăng nhập với email & password
- Google OAuth 2.0 authentication
- JWT token authentication
- Email verification
- Password reset

### 🛒 E-Commerce Core
- **Products**: Quản lý sản phẩm, danh mục, thương hiệu
- **Shopping Cart**: Giỏ hàng với session support
- **Orders**: Quản lý đơn hàng, order tracking
- **Wishlist/Favorites**: Danh sách yêu thích
- **Reviews**: Đánh giá & review sản phẩm

### 💳 Payment & Shipping
- VNPay payment gateway integration
- Shipping method management
- Shipping fee calculation
- Multiple payment methods

### 👤 User Management
- Profile management
- Address management
- Order history
- Avatar upload

### 👨‍💼 Admin Features
- Role-based access control (RBAC)
- Permission management
- Order status management

---

## 🛠️ Công Nghệ Sử Dụng

- **Framework**: [Fastify](https://www.fastify.io/) v5.0
- **Language**: [TypeScript](https://www.typescriptlang.org/) v5.9
- **ORM**: [Prisma](https://www.prisma.io/) v4.16
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **Validation**: [Zod](https://zod.dev/) v3.24
- **Authentication**: JWT, Google OAuth 2.0
- **Email**: Nodemailer
- **Payment**: VNPay
- **Documentation**: Swagger/OpenAPI

---

## 📁 Cấu Trúc Thư Mục

```
BE/
├── prisma/
│   ├── migrations/          # Database migrations
│   └── schema.prisma        # Prisma schema
├── src/
│   ├── config/             # Configuration files
│   ├── constants/          # Constants & messages
│   ├── controllers/        # Route controllers
│   ├── decorator/          # Custom decorators
│   ├── middlewares/        # Custom middlewares
│   ├── plugins/            # Fastify plugins
│   ├── routes/             # API routes
│   ├── schemas/            # Response schemas
│   ├── services/           # Business logic
│   ├── types/              # TypeScript types
│   ├── utils/              # Utility functions
│   ├── validations/        # Zod validation schemas
│   ├── app.ts              # Fastify app setup
│   └── server.ts           # Server entry point
├── uploads/                # File uploads
├── .env                    # Environment variables
├── Dockerfile              # Docker configuration
├── docker-compose.yml      # Docker Compose setup
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🚀 Cài Đặt

### Prerequisites

- **Node.js**: >= 20.x
- **npm**: >= 9.x
- **PostgreSQL**: >= 14.x
- **Docker** (optional): Latest version

### Local Setup

1. **Clone repository**:
```bash
git clone <repository-url>
cd final-ecommerce/BE
```

2. **Cài đặt dependencies**:
```bash
npm install
```

3. **Cấu hình environment variables** (xem phần [Cấu Hình](#-cấu-hình)):
```bash
cp .env.example .env
# Chỉnh sửa file .env với thông tin của bạn
```

4. **Chạy Prisma migrations**:
```bash
npx prisma migrate dev --name init
npx prisma generate
```

---

## ⚙️ Cấu Hình

Tạo file `.env` trong thư mục `BE/`:

```env
# App Configuration
PORT=3000
HOST=0.0.0.0
BASE_URL=http://localhost:3000
CLIENT_URL=http://localhost:3001
ORDER_COMPLETE=http://localhost:3001/order/complete

# Database
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name
DATABASE_URL=postgresql://your_db_user:your_db_password@localhost:5432/your_db_name

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_this

# SMTP Configuration (Gmail example)
SMTP_SERVER=smtp.gmail.com
GMAIL_USERNAME=your_email@gmail.com
GMAIL_PASSWORD=your_gmail_app_password

# Google OAuth 2.0
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com

# VNPay Payment Gateway
VNP_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
VNP_RETURN_URL=http://localhost:3000/payment/vnpay_return
VNP_TMN_CODE=your_vnpay_tmn_code
VNP_HASH_SECRET=your_vnpay_hash_secret
```

### 📝 Lưu Ý Quan Trọng

- **JWT_SECRET**: Sử dụng chuỗi ngẫu nhiên mạnh, dài ít nhất 32 ký tự
- **GMAIL_PASSWORD**: Sử dụng App Password, không phải password thường
- **DATABASE_URL**: Đảm bảo format đúng cho Prisma
- **VNPay**: Đăng ký tài khoản sandbox tại [VNPay](https://vnpay.vn/)

---

## 🏃 Chạy Ứng Dụng

### Development Mode

```bash
npm run dev
```

Server sẽ chạy tại `http://localhost:3000` với hot-reload.

### Production Build

```bash
# Build TypeScript
npm run build

# Start production server
npm start
```

### Available Scripts

```bash
# Development
npm run dev              # Chạy dev server với hot-reload

# Build
npm run build            # Compile TypeScript + resolve path aliases
npm start                # Chạy production server

# Code Quality
npm run lint             # Chạy ESLint
npm run lint:check       # Kiểm tra linting
npm run format           # Format code với Prettier
npm run prettier:check   # Kiểm tra format

# Database
npx prisma migrate dev   # Tạo & chạy migration (dev)
npx prisma migrate deploy # Chạy migration (production)
npx prisma generate      # Generate Prisma Client
npx prisma studio        # Mở Prisma Studio
npx prisma db seed       # Chạy seed data
```

---

## 📚 API Documentation

### Swagger UI

Sau khi khởi động server, truy cập Swagger documentation tại:

```
http://localhost:3000/api/docs
```

### Main API Endpoints

#### Authentication
```
POST   /user/api/register              # Đăng ký
POST   /user/api/login                 # Đăng nhập
POST   /user/api/google-login          # Google OAuth
POST   /user/api/verify-email          # Xác thực email
POST   /user/api/forgot-password       # Quên mật khẩu
POST   /user/api/reset-password        # Reset mật khẩu
POST   /user/api/refresh-token         # Refresh token
```

#### Products
```
GET    /api/products                   # Danh sách sản phẩm
GET    /api/products/:id               # Chi tiết sản phẩm
GET    /api/products/:id/images        # Hình ảnh sản phẩm
```

#### Categories & Brands
```
GET    /api/categories                 # Danh sách categories
GET    /api/categories/:id             # Chi tiết category
GET    /api/brands                     # Danh sách brands
GET    /api/brands/:id                 # Chi tiết brand
```

#### Cart
```
GET    /api/cart                       # Xem giỏ hàng
POST   /api/cart                       # Thêm vào giỏ
PUT    /api/cart/:id                   # Cập nhật giỏ
DELETE /api/cart/:id                   # Xóa khỏi giỏ
```

#### Orders
```
GET    /api/orders                     # Danh sách đơn hàng
GET    /api/orders/:id                 # Chi tiết đơn hàng
POST   /api/orders                     # Tạo đơn hàng
PUT    /api/orders/:id                 # Cập nhật đơn hàng
```

#### Reviews
```
GET    /api/reviews/product/:id        # Reviews của sản phẩm
POST   /api/reviews                    # Tạo review
PUT    /api/reviews/:id                # Cập nhật review
POST   /api/reviews/upload             # Upload review image
```

#### User Profile
```
GET    /api/user/profile               # Xem profile
PUT    /api/user/profile               # Cập nhật profile
PUT    /api/user/password              # Đổi mật khẩu
PUT    /api/user/avatar                # Cập nhật avatar
```

#### Addresses
```
GET    /user/api/addresses             # Danh sách địa chỉ
POST   /user/api/addresses             # Thêm địa chỉ
PUT    /user/api/addresses/:id         # Cập nhật địa chỉ
DELETE /user/api/addresses/:id         # Xóa địa chỉ
```

#### Payment
```
POST   /api/payment/create-url         # Tạo URL thanh toán VNPay
GET    /payment/vnpay_return           # VNPay callback
POST   /payment/vnpay_ipn              # VNPay IPN
```

---

## 🗄️ Database Schema

### Main Entities

- **Users**: Thông tin người dùng, authentication
- **Addresses**: Địa chỉ giao hàng/thanh toán
- **Categories**: Danh mục sản phẩm (hierarchical)
- **Brands**: Thương hiệu
- **Products**: Sản phẩm với variants & attributes
- **ProductImages**: Hình ảnh sản phẩm
- **Carts & CartItems**: Giỏ hàng
- **Orders & OrderItems**: Đơn hàng & chi tiết
- **Reviews & ReviewImages**: Đánh giá sản phẩm
- **Favorites & FavoriteItems**: Danh sách yêu thích
- **PaymentMethods**: Phương thức thanh toán
- **ShippingMethods**: Phương thức vận chuyển
- **Coupons**: Mã giảm giá
- **Admin, Roles, Permissions**: Quản trị & phân quyền

### View Schema

```bash
npx prisma studio
```

Hoặc xem file `prisma/schema.prisma`.

---

## 🐳 Docker

### Build và Chạy với Docker Compose

1. **Đảm bảo có file `.env`** với cấu hình đúng:
```env
# Lưu ý: DATABASE_URL host phải là 'db' (tên service trong docker-compose)
DATABASE_URL=postgresql://your_user:your_password@db:5432/your_dbname
```

2. **Build và start services**:
```bash
docker-compose up --build
```

3. **Chạy migrations** (trong một terminal khác):
```bash
docker exec -it app_ecommerce sh
npx prisma migrate deploy
npx prisma generate
exit
```

4. **Kiểm tra logs**:
```bash
docker logs -f app_ecommerce
```

### Docker Commands

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker logs -f app_ecommerce
docker logs -f postgres_ecommerce

# Access container shell
docker exec -it app_ecommerce sh

# Rebuild
docker-compose up --build

# Remove volumes (⚠️ mất data)
docker-compose down -v
```

---

## 🔧 Troubleshooting

### Prisma Binary Target Error

Nếu gặp lỗi về Prisma binary target trong Docker:

1. Kiểm tra `prisma/schema.prisma`:
```prisma
generator client {
  provider      = "prisma-client-js"
  binaryTargets = ["native", "debian-openssl-1.1.x", "debian-openssl-3.0.x"]
}
```

2. Regenerate Prisma Client:
```bash
npx prisma generate
```

### TypeScript Path Aliases

Dự án sử dụng path aliases (`@app/*`, `@services/*`, etc.). Khi build:

1. `tsc` compile TypeScript
2. `tsc-alias` chuyển đổi aliases thành relative paths

Script build: `tsc -p tsconfig.json && tsc-alias -p tsconfig.json`

### OpenSSL Warnings trong Docker

Warnings về OpenSSL là bình thường và không ảnh hưởng hoạt động. Nếu muốn loại bỏ, cập nhật Dockerfile:

```dockerfile
RUN apt-get update -y && \
    apt-get install -y openssl && \
    rm -rf /var/lib/apt/lists/*
```

### Port Already in Use

Nếu port 3000 đã được sử dụng:

1. Đổi PORT trong `.env`
2. Hoặc kill process đang dùng port:
```bash
lsof -ti:3000 | xargs kill -9
```

---

## 📞 Support

Nếu gặp vấn đề, vui lòng:
1. Kiểm tra logs: `npm run dev` hoặc `docker logs -f app_ecommerce`
2. Xem Swagger docs: `http://localhost:3000/api/docs`
3. Tạo issue trên GitHub repository

---

## 📄 License

[MIT License](LICENSE)

---
