<div align="center">

# 🇻🇳 VietTour

**Nền tảng đặt tour du lịch Việt Nam** — Full-stack với React + Vite ở frontend và Express + MySQL ở backend.

[![Node](https://img.shields.io/badge/Node.js-20+-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white)](https://expressjs.com)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![MySQL](https://img.shields.io/badge/MySQL-8-4479A1?logo=mysql&logoColor=white)](https://www.mysql.com)
[![Knex](https://img.shields.io/badge/Knex.js-3-D26B38?logo=)](https://knexjs.org)
[![Faker](https://img.shields.io/badge/Faker-10-008080?logo=faker&logoColor=white)](https://fakerjs.dev)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

</div>

---

## 📖 Tổng quan

VietTour là một ứng dụng web đặt tour du lịch hoàn chỉnh, gồm hai package độc lập:

| Thư mục | Công nghệ | Vai trò |
|---------|-----------|---------|
| `backend/` | Express 5 + MySQL 8 | REST API + migration/seed |
| `frontend/` | React 19 + Vite 7 + Tailwind 4 | Giao diện người dùng |

**Tính năng chính**
- 🔐 Đăng ký / đăng nhập bằng JWT, xác thực email qua SMTP
- 🗺️ Danh sách & tìm kiếm tour, xem chi tiết theo miền (Bắc/Trung/Nam)
- 🧾 Đặt tour (chọn chuyến xuất phát `departure`, số người lớn/trẻ)
- ⭐ Đánh giá tour, danh sách yêu thích (wishlist)
- 👤 Phân vai `user` / `admin`, panel quản trị riêng (`/admin/*`, `/user/*`)
- 🗄️ Migration + seeder + factory (giống Laravel, dùng `@faker-js/faker`) để tạo dữ liệu mẫu nhanh

---

## 🧱 Cấu trúc thư mục

```
viettour/
├── backend/                      # REST API (Express + MySQL)
│   ├── src/
│   │   ├── app.js                # Khởi tạo Express, serve frontend/dist
│   │   ├── config/db.js          # Pool kết nối MySQL (mysql2/promise)
│   │   ├── features/
│   │   │   ├── auth/             # Đăng ký, đăng nhập, xác thực email...
│   │   │   ├── booking/          # Đặt tour, lịch sử, admin quản lý
│   │   │   └── tour/             # CRUD + tìm kiếm tour
│   │   ├── middlewares/          # auth (JWT), rate limiter, validation...
│   │   └── shared/mailService.js # Gửi email xác thực / reset mật khẩu
│   ├── db/
│   │   ├── migrations/           # 11 migration, mỗi bảng 1 file (Knex)
│   │   ├── seeds/                # 6 seeder độc lập (00_reset → 05)
│   │   ├── factories.js          # Sinh dữ liệu mẫu
│   │   └── seed-config.js        # Chỉnh số lượng mẫu
│   ├── knexfile.js               # Cấu hình Knex (đọc từ .env)
│   ├── server.js                 # Điểm khởi chạy backend
│   └── package.json
│
├── frontend/                     # Giao diện (React + Vite)
│   └── src/
│       ├── layouts/              # MainLayout, AdminLayout, UserLayout
│       ├── routes/               # AppRoutes, AdminRoutes, UserRoutes
│       ├── features/             # auth, tours, user/*, admin/*
│       ├── components/           # Header, Footer, Sidebar, ...
│       └── hooks/                # useFetch, useAuth
│
├── db.sql                        # Schema MySQL chuẩn (tham khảo)
├── AGENTS.md                     # Hướng dẫn cho AI/agent (opencode)
└── opencode.json                 # Config opencode
```

> Cấu trúc backend theo **feature-based**: mỗi nhóm tính năng có đủ `*.routes.js`, `*.controller.js`, `*.model.js`/`*.repository.js` trong cùng thư mục.

---

## 🚀 Cài đặt

### Yêu cầu

- [Node.js](https://nodejs.org) **20+**
- [MySQL](https://www.mysql.com) **8.x** đang chạy
- npm (đi kèm Node.js)

### 1. Clone & cài dependencies

```bash
# Cài backend
cd backend
npm install

# Cài frontend
cd ../frontend
npm install
```

### 2. Cấu hình biến môi trường

Mỗi package có riêng file `.env`. Sao chép từ `.env.example`:

```bash
# Backend
cd backend
cp .env.example .env      # Windows: copy .env.example .env

# Frontend
cd ../frontend
cp .env.example .env      # Windows: copy .env.example .env
```

**`backend/.env`** — các biến bắt buộc:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=db_viet_tour

JWT_SECRET=một_chuỗi_bí_mật_dài
VERIFY_EMAIL_SECRET=một_chuỗi_khác
RESET_PASS_SECRET=một_chuỗi_nữa
FRONTEND_URL=http://localhost:5173
```

> `JWT_SECRET` là **bắt buộc** — nếu thiếu, backend sẽ throw lỗi và không khởi động được (xem `src/middlewares/auth.js`).
>
> Biến `SMTP_*` (SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS...) là **tùy chọn**. Nếu không cấu hình, link xác thực / đặt lại mật khẩu sẽ chỉ **in ra console** thay vì gửi email.

### 3. Khởi tạo database

Dùng migration Knex để tạo schema (được ưu tiên vì có dùng khi thêm bảng):

```bash
cd backend
npm run migrate
```

> Hoặc import trực tiếp bằng file `db.sql` trong root nếu bạn không muốn dùng Knex.

---

## 🧪 Tạo dữ liệu mẫu (Seeder & Factory)

VietTour dùng **Knex.js** — bộ migration + seeder + factory giống Laravel — để tạo dữ liệu mẫu tự động, không cần chèn tay.

### Chạy seed (toàn bộ)

```bash
cd backend
npm run seed
```

Kết quả mặc định (theo `db/seed-config.js`):

| Bảng | Số lượng |
|------|----------|
| `users` | 1 admin + 10 customer |
| `tours` | 15 tour |
| `tour_departures` | ~2–4 chuyến / tour |
| `services` | 6 dịch vụ |
| `bookings` | 20 booking |
| `reviews` | ~29 đánh giá |

### Cách hoạt động

Knex chạy **từng file** trong `db/seeds/` **độc lập, theo thứ tự tên**:

```
db/seeds/
├── 00_reset.js      # Xóa toàn bộ dữ liệu (đúng thứ tự khóa ngoại)
├── 01_users.js      # users
├── 02_tours.js      # tours + tour_images + itineraries + departures
├── 03_services.js   # services + tour_services
├── 04_bookings.js   # bookings (FK → users, departures)
└── 05_reviews.js    # reviews (FK → users, tours)
```

Vì mỗi seed chạy riêng và **không chia sẻ id**, mỗi file tự query lại id khóa ngoại theo **field duy nhất** (email, slug) thay vì nhận id truyền vào.

### Thay đổi số lượng mẫu

Mở `backend/db/seed-config.js`:

```js
export const SEED_CONFIG = {
    users: 10,    // số customer (ngoài 1 admin)
    tours: 15,
    services: 6,
    bookings: 20,
    reviews: 30,
};
```

### Thay đổi nội dung / thêm dữ liệu mới

Factory ở `backend/db/factories.js` chứa các hàm sinh dữ liệu (`makeTour`, `makeUser`, `makeDeparture`, `makeService`, `makeItinerary`...). Sửa tại đây để đổi nội dung mẫu.

Factory dùng [`@faker-js/faker`](https://fakerjs.dev) kết hợp **bộ dữ liệu Việt Nam tự định nghĩa** (họ tên, số điện thoại đầu số `09x`, địa điểm/tour theo miền, giá làm tròn bội số 50.000đ) để sinh dữ liệu giả trông thật:

```js
import { faker } from "@faker-js/faker";

export function makeTour(index) {
    const region = pick(REGIONS);
    const location = pick(LOCATIONS[region]);
    const activity = pick(TOUR_ACTIVITIES);
    const name = `Tour ${location} ${activity}`;
    return {
        name,
        slug: `${slugify(name)}-${faker.number.int({ min: 1000, max: 9999 })}`,
        // ... price_default, price_child, region, duration
    };
}
```

### Thêm một bảng / entity mới

Muốn seed thêm bảng mới (ví dụ `payments`):

1. **Tạo migration** — bảng con đặt sau bảng cha vì khóa ngoại:
   ```bash
   cd backend
   npm run migrate:make create_payments
   ```
2. **Tạo seeder** — tạo file `db/seeds/06_payments.js`, export `seed(knex)`:
   ```js
   export async function seed(knex) {
       const rows = [...];            // dữ liệu, hoặc dùng factory
       await knex("payments").insert(rows);
   }
   ```
3. **Chạy lại:**
   ```bash
   npm run seed
   ```

> ⚠️ Chỉ đặt các file **có** hàm `seed` trong `db/seeds/` — Knex sẽ báo lỗi `must have a seed function` nếu có file lạ. `factories.js` và `seed-config.js` nằm ở `db/` để tránh điều này.

---

## ▶️ Chạy dự án

### Chế độ phát triển (2 terminal — khuyên dùng)

Vite dev server có **hot reload** và proxy `/api` → `localhost:3000`.

```bash
# Terminal 1 — Backend API (port 3000)
cd backend
npm run dev

# Terminal 2 — Frontend dev (port 5173)
cd frontend
npm run dev
```

Mở trình duyệt: **http://localhost:5173**

### Chế độ production-style (1 server)

Backend có thể tự phục vụ frontend sau khi build:

```bash
# Build frontend
cd frontend
npm run build

# Chỉ cần backend (port 3000)
cd ../backend
npm run dev
```

Mở trình duyệt: **http://localhost:3000**

> Backend kiểm tra sự tồn tại của `frontend/dist` **lúc khởi động**. Nếu bạn build sau khi backend đã chạy, hãy **restart** backend để nó phục vụ UI.

---

## 🔑 Tài khoản mẫu (sau khi seed)

| Vai trò | Email | Mật khẩu |
|---------|-------|----------|
| Admin | `admin@viettour.vn` | `123456` |
| Customer | `user1@example.com` ... `user10@example.com` | `123456` |

---

## 🔌 API

Base URL: `http://localhost:3000/api`

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| `POST` | `/api/auth/register` | Đăng ký | — |
| `POST` | `/api/auth/login` | Đăng nhập (email/phone + mật khẩu) | — |
| `GET` | `/api/auth/profile` | Thông tin cá nhân | ✅ JWT |
| `PUT` | `/api/auth/profile` | Cập nhật profile | ✅ JWT |
| `POST` | `/api/auth/change-password` | Đổi mật khẩu | ✅ JWT |
| `GET` | `/api/auth/verify-email` | Xác thực email (redirect) | token |
| `POST` | `/api/auth/forgot-password` | Gửi link reset | — |
| `POST` | `/api/auth/reset-password` | Đặt lại mật khẩu | token |
| `GET` | `/api/tours` | Danh sách tour | — |
| `GET` | `/api/tours/search?q=` | Tìm kiếm tour | — |
| `GET` | `/api/tours/region/:region` | Tour theo miền | — |
| `GET` | `/api/tours/:id` | Chi tiết tour | — |
| `POST` | `/api/tours` | Tạo tour | ✅ Admin |
| `PUT` | `/api/tours/:id` | Cập nhật tour | ✅ Admin |
| `DELETE` | `/api/tours/:id` | Xóa tour | ✅ Admin |
| `POST` | `/api/bookings/` | Đặt tour | ✅ User |
| `GET` | `/api/bookings/my-bookings` | Lịch sử đặt | ✅ User |
| `PUT` | `/api/bookings/:id/cancel` | Hủy booking | ✅ User |
| `GET` | `/api/bookings/` | Tất cả booking | ✅ Admin |
| `PUT` | `/api/bookings/:id/status` | Cập nhật trạng thái | ✅ Admin |
| `DELETE` | `/api/bookings/:id` | Xóa booking | ✅ Admin |

**Format response thống nhất:**

```json
{ "success": true, "data": { ... } }        // thành công
{ "success": false, "message": "..." }      // lỗi
```

---

## 🛠️ Scripts

| Lệnh | Vị trí | Mô tả |
|------|--------|-------|
| `npm run dev` | backend | Chạy API với nodemon |
| `npm start` | backend | Chạy API (production) |
| `npm run migrate` | backend | Chạy migration Knex |
| `npm run migrate:rollback` | backend | Rollback migration |
| `npm run migrate:make <name>` | backend | Tạo migration mới |
| `npm run seed` | backend | Chạy seeder |
| `npm run dev` | frontend | Vite dev server |
| `npm run build` | frontend | Build ra `frontend/dist` |
| `npm run lint` | frontend | ESLint |

---

## 🧠 Ghi chú cho nhà phát triển (schema hiện tại)

> ⚠️ **Lệch schema tạm thời:** các model hiện tại (`tour.model.js`, `booking.model.js`) vẫn dùng field cũ (`price`, `image`, `tour_id`, `number_of_people`) — **không khớp** với schema chuẩn mới trong `db.sql` + migration (`price_default`, `cover_image`, `departure_id`, `adults`/`children`, `contact_*`).
>
> Schema chuẩn bây giờ là **`db.sql` + migration**. Khi sửa model/API, hãy khớp về schema mới.

---

## 📜 License

[MIT](LICENSE)
