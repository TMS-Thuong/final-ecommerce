# Hướng dẫn build & chạy Frontend (FE)

## 1. Chuẩn bị môi trường

- **Yêu cầu:** Node.js >= 18, npm >= 9

## 2. Cài đặt dependencies

```bash
npm install
```

## 3. Cấu hình biến môi trường

Tạo file `.env` tại thư mục `FE/` (nếu chưa có). Ví dụ:

```env
# Địa chỉ API backend
VITE_API_BASE_URL=http://localhost:3000/api

# Địa chỉ API lấy tỉnh/thành (nếu có)
VITE_PROVINCES_API_URL=https://provinces.open-api.vn/api/
```

> **Lưu ý:**  
> - Nếu backend chạy ở cổng khác, hãy sửa lại `VITE_API_BASE_URL` cho phù hợp.  
> - Các biến môi trường bắt đầu bằng `VITE_` mới được Vite sử dụng.

## 4. Các lệnh phát triển & build

- **Chạy dev (hot reload):**
  ```bash
  npm run dev
  ```
  FE sẽ chạy ở [http://localhost:3001](http://localhost:3001) (hoặc cổng do Vite chỉ định).

- **Build production:**
  ```bash
  npm run build
  ```

- **Preview production build:**
  ```bash
  npm run preview
  ```

- **Kiểm tra type (TypeScript):**
  ```bash
  npm run type-check
  ```

- **Kiểm tra & sửa code với ESLint:**
  ```bash
  npm run lint
  ```

- **Format code với Prettier:**
  ```bash
  npm run format
  ```

## 5. Một số lưu ý

- **IDE khuyến nghị:** [VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar)
- **Cấu hình thêm:** Xem chi tiết tại [Vite Configuration Reference](https://vite.dev/config/).
