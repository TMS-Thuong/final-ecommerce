# Hướng dẫn build & chạy Backend bằng Docker

## 1. Chuẩn bị file môi trường

- Tạo file `.env` trong thư mục `BE/` nếu chưa có. Ví dụ nội dung chi tiết:

```env
# App
PORT=3000
HOST=0.0.0.0
BASE_URL=http://localhost:3000
CLIENT_URL=http://localhost:3001
ORDER_COMPLETE=http://localhost:3001/order/complete

# Database
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name
DATABASE_URL=postgresql://your_db_user:your_db_password@db:5432/your_db_name

# JWT
JWT_SECRET=your_jwt_secret

# SMTP (Gmail example)
SMTP_SERVER=smtp.gmail.com
GMAIL_USERNAME=your_gmail@gmail.com
GMAIL_PASSWORD=your_gmail_app_password

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id

# VNPay
VNP_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
VNP_RETURN_URL=http://localhost:3000/payment/vnpay_return
VNP_TMN_CODE=your_vnp_tmn_code
VNP_HASH_SECRET=your_vnp_hash_secret
```

> **Lưu ý:**
> - `DATABASE_URL` phải đúng định dạng của Prisma/Postgres, ví dụ:  
>   `postgresql://user:password@db:5432/dbname`
> - Tên host là `db` vì trong `docker-compose.yml` service database tên là `db`.
> - Các biến khác (SMTP, Google, VNPay) điền theo thông tin thực tế của bạn.

---

## 2. Build và chạy bằng Docker Compose

Tại thư mục `BE/`, chạy lệnh:

```bash
docker-compose up --build
```

- Lệnh này sẽ build image cho BE và khởi động cả BE lẫn Postgres.
- Ứng dụng BE sẽ chạy ở cổng `3000`, database Postgres ở cổng `5433` trên máy host.

---

## 3. Chạy Prisma migrate & generate

Sau khi các container đã chạy, bạn cần thực hiện migrate database và generate Prisma Client.

1. **Truy cập vào container app:**

```bash
docker exec -it app_ecommerce sh
```

2. **Chạy migrate và generate:**

```bash
npx prisma migrate deploy
npx prisma generate
```

---

## 4. Các lệnh Docker hữu ích

- **Dừng các container:**

```bash
docker-compose down
```

- **Chạy lại container sau khi đã build:**

```bash
docker-compose up -d
```

- **Xem log của app:**

```bash
docker logs -f app_ecommerce
```

- **Xem log của database:**

```bash
docker logs -f postgres_ecommerce
```

- **Truy cập shell vào container app:**

```bash
docker exec -it app_ecommerce sh
```

- **Truy cập shell vào container database:**

```bash
docker exec -it postgres_ecommerce bash
```

- **Xóa toàn bộ container, network, volume (cẩn thận!):**

```bash
docker-compose down -v
```

- **Xóa image đã build (nếu cần làm sạch):**

```bash
docker rmi $(docker images 'be_app_ecommerce' -q)
```

---

## 5. Kết thúc

- API BE sẽ sẵn sàng tại: [http://localhost:3000](http://localhost:3000)
- Database Postgres sẽ sẵn sàng tại: `localhost:5433`

---

**Tóm tắt các file quan trọng:**
- `BE/Dockerfile`: Định nghĩa cách build image cho BE.
- `BE/docker-compose.yml`: Quản lý các service (BE, Postgres).
- `BE/prisma/schema.prisma`: Định nghĩa schema cho Prisma.
- `.env`: File cấu hình môi trường (tự tạo theo hướng dẫn trên).
