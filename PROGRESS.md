# VietTour — Tiến độ & Nhật ký cập nhật

> **Mục đích:** tóm tắt những gì đã làm / đang làm / còn lại để khi mở phiên làm việc mới, bạn chỉ cần gửi file này cho AI kèm yêu cầu tiếp theo.
>
> **Quy ước:** sau mỗi thay đổi hoàn thành → đánh dấu `[x]` trong checklist, thêm một mục vào **Lịch sử cập nhật** ở cuối file (ngày, việc đã làm, file liên quan, cách kiểm tra).

---

## 1. Trạng thái hiện tại

- **Cập nhật gần nhất:** 2026-10-19
- **Backend:** Express + MySQL (`db_viet_travel`, port `3307`), chạy `npm run dev` trong `backend/`.
- **Frontend:** React + Vite, chạy `npm run dev` trong `frontend/` (proxy `/api` → `http://localhost:3000`).
- **Đăng nhập admin test:** `admin@viettour.vn` / `123456` (field là `username`).
- **Đã hoàn thành:** dashboard `/admin/bookings` đã đọc dữ liệu thật từ DB (không còn mock data).

---

## 2. Checklist công việc

### ✅ Admin Bookings — Dashboard `/admin/bookings` (hoàn thành 2026-10-19)

- [x] Tạo backend feature `backend/src/features/admin/bookings/`
- [x] API danh sách booking + search + lọc status + phân trang
- [x] API thống kê 3 thẻ (Total Booking / Participants / Earnings)
- [x] API Trips Overview theo range (`7d | 30d | 3m | 12m`)
- [x] API Top Packages (top 5 tour theo số khách)
- [x] API chi tiết booking + danh sách hành khách
- [x] API đổi trạng thái booking (kèm hoàn/trừ ghế trong transaction)
- [x] Mount route `/api/admin/bookings` vào `backend/src/app.js`
- [x] Frontend API client `bookings.api.js`
- [x] `DashboardBooking` tải stats + top packages thật
- [x] `TripsOverview` đổi range hoạt động thật, trục Y co giãn
- [x] `BookingsTable` search + phân trang phía server
- [x] Xóa `frontend/src/features/admin/bookings/data/mockData.js`
- [x] Chạy `npm run lint` + `npm run build` (pass)
- [x] Test API bằng tài khoản admin thật (20 bookings / 63 khách / 0 đ earnings)

### ⬜ Việc có thể làm tiếp (backlog, chưa làm)

- [ ] Nút **Add Booking** trên dashboard (hiện chỉ là nút trang trí)
- [ ] Bộ lọc trạng thái (Pending / Confirmed / Cancelled) trên thanh công cụ bảng
- [ ] Sắp xếp theo cột (Name / Date / Price…) — backend chưa hỗ trợ sort
- [ ] Modal xem chi tiết booking — API `GET /api/admin/bookings/:id` đã sẵn sàng
- [ ] Đổi trạng thái booking ngay trên UI — API `PUT /api/admin/bookings/:id/status` đã sẵn sàng
- [ ] Xử lý 401 → chuyển về `/login` (hiện chỉ hiện toast lỗi)
- [ ] Nút **Today** trên bảng (hiện chỉ trang trí)
- [ ] Thêm vài booking `payment_status = 'paid'` để thấy Earnings khác 0
- [ ] Đồng bộ `TripsOverview` và `TopPackages` dùng chung một range

---

## 3. API Admin Bookings

Base: `/api/admin/bookings` — tất cả yêu cầu header `Authorization: Bearer <token>` và role `admin` hoặc `booking-staff`.

| Method | Endpoint | Query / Body | Mô tả |
|---|---|---|---|
| GET | `/` | `page`, `limit`, `search`, `status` | Danh sách + phân trang + tìm theo tên/mã/tour |
| GET | `/stats` | — | 3 thẻ thống kê + sparkline 12 tháng |
| GET | `/trips` | `range=7d\|30d\|3m\|12m` | Số chuyến `done` / `canceled` theo thời gian |
| GET | `/top-packages` | `range`, `limit=5` | Top tour theo tổng khách |
| GET | `/:id` | — | Chi tiết booking + passengers |
| PUT | `/:id/status` | `{ "status": "pending\|confirmed\|cancelled" }` | Đổi trạng thái, tự hoàn/trừ ghế |

### Quy tắc nghiệp vụ đã chốt

- **Earnings** = `SUM(total_price)` với `payment_status = 'paid'`.
- **Trục thời gian thống kê** = `bookings.created_at`.
- **Tên khách** = `users.fullname`, fallback `bookings.contact_name` nếu `user_id` null.
- **Trạng thái hiển thị** chỉ có 3 nhãn: `Pending`, `Confirmed`, `Cancelled` (không có `Completed`).
- **Trips Overview:** `done = confirmed`, `canceled = cancelled`.
- **Top Packages:** `SUM(adults + children)` theo tour, lấy top 5, tính % trên tổng khách trong range.
- **% thay đổi:** tháng hiện tại vs tháng trước; kỳ trước = 0 → `0%` (hoặc `100%` nếu kỳ này có dữ liệu).
- **Đổi trạng thái:** hủy booking → hoàn ghế; mở lại booking đã hủy → kiểm tra đủ chỗ rồi trừ ghế; tất cả trong transaction.

### Response mẫu

```json
// GET /api/admin/bookings
{
  "success": true,
  "data": [
    {
      "id": 18,
      "code": "BK-00018",
      "name": "Trần Quốc Lan",
      "package": "Tour Quy Nhơn – Phú Yên 3N2Đ",
      "duration": "3 ngày 2 đêm",
      "date": "05/10/2026",
      "price": 5729895,
      "status": "Confirmed",
      "payment_status": "unpaid",
      "adults": 4,
      "children": 0,
      "created_at": "2026-10-17T09:26:18.000Z"
    }
  ],
  "pagination": { "currentPage": 1, "totalPages": 2, "total": 20, "limit": 10 }
}
```

---

## 4. File quan trọng

### Backend (mới)

| File | Vai trò |
|---|---|
| `backend/src/features/admin/bookings/booking.routes.js` | Khai báo route, phân quyền |
| `backend/src/features/admin/bookings/booking.controller.js` | HTTP handler, format response |
| `backend/src/features/admin/bookings/booking.service.js` | Nghiệp vụ, map DTO, tính %, transaction đổi trạng thái |
| `backend/src/features/admin/bookings/booking.repository.js` | Knex query builder (list/stats/trips/top/detail/passengers/seats) |
| `backend/src/features/admin/bookings/booking.validate.js` | Validate query/param/body |

### Backend (sửa)

| File | Thay đổi |
|---|---|
| `backend/src/app.js` | Import + mount `/api/admin/bookings` |

### Frontend (mới)

| File | Vai trò |
|---|---|
| `frontend/src/features/admin/bookings/bookings.api.js` | Gọi 6 endpoint admin bookings |

### Frontend (sửa)

| File | Thay đổi |
|---|---|
| `frontend/src/features/admin/bookings/DashboardBooking.jsx` | Tải stats + top packages thật, map sang props component con |
| `frontend/src/features/admin/bookings/components/TripsOverview.jsx` | Tự fetch theo range, trục Y động, trạng thái loading/rỗng |
| `frontend/src/features/admin/bookings/components/BookingsTable.jsx` | Search debounce + phân trang server-side, format VND |
| `frontend/src/features/admin/bookings/components/TopPackages.jsx` | Format số theo `vi-VN` |
| `frontend/src/features/admin/bookings/dashboard.css` | Thêm `.chart-state`, `.table-state`, `.trips-chart.is-loading` |

### Đã xóa

- `frontend/src/features/admin/bookings/data/mockData.js` (và thư mục `data/`)

---

## 5. Lưu ý khi làm tiếp

- Backend dùng DB **`db_viet_travel`** trên port **`3307`** (xem `backend/.env`). Công cụ MySQL MCP của môi trường có thể trỏ sang DB khác (`db_viet_tour`) — **đừng sửa dữ liệu test qua MCP**, hãy kiểm tra bằng chính backend/Knex.
- `mysql2` trả `DECIMAL`/`SUM` dạng **string** → luôn `Number(...)` trước khi tính toán/format.
- Route tĩnh (`/stats`, `/trips`, `/top-packages`) phải khai báo **trước** `/:id`.
- Toàn bộ booking seed đang `created_at = 2026-10-17` và `payment_status = 'unpaid'` → sparkline chỉ có 1 cột, Earnings = `0 đ`. Đây là dữ liệu thật, không phải lỗi.
- Login dùng field `username` (không phải `email`).
- Khi thêm endpoint mới: giữ format response `{ success, data?, message? }` và cập nhật file này.

---

## 6. Cách kiểm tra nhanh

```powershell
# Backend (port 3000)
cd backend
npm run dev

# Frontend (Vite)
cd frontend
npm run dev
npm run lint
npm run build
```

Test API nhanh (PowerShell):

```powershell
$login = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" -Method Post `
  -ContentType "application/json" `
  -Body '{"username":"admin@viettour.vn","password":"123456"}'

$headers = @{ Authorization = "Bearer $($login.data.token)" }

Invoke-RestMethod -Uri "http://localhost:3000/api/admin/bookings?page=1&limit=10" -Headers $headers
Invoke-RestMethod -Uri "http://localhost:3000/api/admin/bookings/stats" -Headers $headers
Invoke-RestMethod -Uri "http://localhost:3000/api/admin/bookings/trips?range=12m" -Headers $headers
Invoke-RestMethod -Uri "http://localhost:3000/api/admin/bookings/top-packages?range=12m&limit=5" -Headers $headers
```

---

## 7. Lịch sử cập nhật

### 2026-10-19 — Nối dashboard Admin Bookings với DB thật

**Đã làm:**
- Tạo mới toàn bộ backend feature `admin/bookings` với 6 endpoint.
- Nối `DashboardBooking`, `TripsOverview`, `BookingsTable`, `TopPackages` với API thật.
- Xóa mock data.
- Kiểm tra: `npm run lint` pass, `npm run build` pass.
- Test API thật: 20 bookings, 63 khách, 0 đ earnings; trips 12 tháng; top 5 tour.
- Test đổi trạng thái `confirmed → cancelled → confirmed`, ghế được hoàn/trừ đúng và đã khôi phục dữ liệu test.

**File liên quan:**
- Thêm: `backend/src/features/admin/bookings/*` (5 file), `frontend/src/features/admin/bookings/bookings.api.js`
- Sửa: `backend/src/app.js`, `DashboardBooking.jsx`, `TripsOverview.jsx`, `BookingsTable.jsx`, `TopPackages.jsx`, `dashboard.css`
- Xóa: `frontend/src/features/admin/bookings/data/mockData.js`

**Ghi chú:**
- Earnings = `0 đ` vì toàn bộ booking seed là `unpaid`.
- Sparkline chỉ có 1 tháng có dữ liệu vì mọi booking được tạo cùng ngày `2026-10-17`.

---

## 8. Mẫu ghi cho lần cập nhật sau

```md
### YYYY-MM-DD — <Tên việc>

**Đã làm:**
- [x] ...
- [x] ...

**File liên quan:**
- Thêm: ...
- Sửa: ...
- Xóa: ...

**Kiểm tra:**
- `npm run lint` / `npm run build` / test API ...

**Ghi chú / việc còn lại:**
- ...
```
