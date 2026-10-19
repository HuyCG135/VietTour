# VietTour — Tiến độ & Nhật ký cập nhật

> **Mục đích:** tóm tắt những gì đã làm / đang làm / còn lại để khi mở phiên làm việc mới, bạn chỉ cần gửi file này cho AI kèm yêu cầu tiếp theo.
>
> **Quy ước:** sau mỗi thay đổi hoàn thành → đánh dấu `[x]` trong checklist, thêm một mục vào **Lịch sử cập nhật** ở cuối file (ngày, việc đã làm, file liên quan, cách kiểm tra).

---

## 1. Trạng thái hiện tại

- **Cập nhật gần nhất:** 2026-10-20
- **Backend:** Express + MySQL (`db_viet_travel`, port `3307`), chạy `npm run dev` trong `backend/`.
- **Frontend:** React + Vite, chạy `npm run dev` trong `frontend/` (proxy `/api` → `http://localhost:3000`).
- **Đăng nhập admin test:** `admin@viettour.vn` / `123456` (field là `username`).
- **Đã hoàn thành:** dashboard `/admin/bookings` đọc dữ liệu thật từ DB; đã có trang chi tiết `/admin/bookings/:id` (bấm dòng trong bảng để mở).

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

### ✅ Cập nhật giao diện tiếng Việt + bộ lọc (2026-10-19)

- [x] Đổi toàn bộ nhãn dashboard sang tiếng Việt (StatCards, Trips Overview, Top Packages, bảng booking)
- [x] Top Packages: tính theo **số lượt đặt trong 12 tháng**, xếp tour nhiều booking nhất lên đầu
- [x] Đổi % Top Packages = số booking của tour / tổng booking trong năm
- [x] Nhãn % Top Packages: chữ trắng, nền trùng đúng màu lát donut tương ứng
- [x] Bảng booking: đưa **Mã booking** lên cột đầu, **Tên khách** cột thứ hai
- [x] Bỏ nút **Add Booking**
- [x] Thay nút **Today** bằng bộ lọc **Từ ngày / Đến ngày** (ngày khởi hành)
- [x] Thêm bộ lọc **Trạng thái** (Chờ xử lý / Đã xác nhận / Đã hủy)
- [x] Backend list hỗ trợ `fromDate`, `toDate`
- [x] Trả về `status` (raw) + `status_label` (tiếng Việt)
- [x] `npm run lint` + `npm run build` pass; test API lọc ngày + trạng thái

### ✅ Admin Booking Detail `/admin/bookings/:id` (hoàn thành 2026-10-19)

- [x] Thêm route `/admin/bookings/:id` + nút bấm được trên từng dòng bảng booking
- [x] Tạo thư mục `frontend/src/features/admin/bookings/BookingDetail/` tách nhỏ component
- [x] Header chi tiết: mã booking, ngày đặt, trạng thái, link quay lại
- [x] Thông tin tour, thông tin khách hàng (gồm ghi chú), danh sách hành khách
- [x] Component **Tổng tiền** (giống ảnh): dòng người lớn/trẻ em, tổng cộng, khối ĐÃ THU / CHƯA THU / ĐÃ HOÀN TIỀN
- [x] Component **Lịch sử hoạt động**: timeline dot màu, mới nhất trên cùng
- [x] Backend detail trả thêm `history` (suy ra từ `created_at`, `updated_at`, `status`, `payment_status`)
- [x] Modal **In hóa đơn** dùng `print-only` có sẵn + `window.print()`
- [x] Skeleton khi tải, alert + nút thử lại khi lỗi
- [x] `npm run lint` + `npm run build` pass; test API `GET /:id` có `history`

### ✅ Seed DB thực tế — users + 50 bookings + passengers (2026-10-20)

- [x] `00_reset.js`: xóa theo thứ tự FK + reset `AUTO_INCREMENT` để id sạch từ 1
- [x] `01_users.js`: 3 tài khoản nội bộ **giữ nguyên email** + 30 khách hàng tên thật, email theo tên thật, SĐT/địa chỉ đầy đủ
- [x] `04_bookings.js`: 50 booking, `total_price` tính đúng từ giá tour + phụ thu lịch khởi hành
- [x] `created_at` trải 13 tháng (luôn trước ngày khởi hành ≥ 5 ngày); `updated_at` sau `created_at` (xác nhận/thanh toán/hủy)
- [x] Nhiều tổ hợp trạng thái: `confirmed/paid`, `confirmed/unpaid`, `pending/unpaid`, `cancelled/refunded`, `cancelled/unpaid`
- [x] `contact_name/phone/email/dob/gender` lấy từ tài khoản khách thật (15% đơn khách vãng lai)
- [x] `passengers` khớp đúng `adults + children`, đủ tên/giới tính/ngày sinh/loại khách
- [x] Trừ `seats_available` của lịch khởi hành theo số khách đã đặt (không tính đơn hủy)
- [x] `05_reviews.js`: đánh giá chỉ cho đơn đã xác nhận & đã đi, ngày sau khởi hành, nội dung đa dạng
- [x] `seed-config.js`: `users: 30`, `services: 10`, `bookings: 50`, `reviews: 40`
- [x] Chạy `npm run seed` + verify: 33 users / 50 bookings / 172 passengers; 0 đơn lệch giá; 0 sai ngày; 0 lệch passenger
- [x] Test API admin: `/stats`, `/trips`, `/top-packages`, list, `/:id` đều `success=true` với dữ liệu mới

### ⬜ Việc có thể làm tiếp (backlog, chưa làm)

- [ ] Nút **Add Booking** trên dashboard — đã bỏ theo yêu cầu, chỉ thêm lại khi cần
- [ ] Sắp xếp theo cột (Name / Date / Price…) — backend chưa hỗ trợ sort
- [ ] Đổi trạng thái booking ngay trên UI — API `PUT /api/admin/bookings/:id/status` đã sẵn sàng
- [ ] Xử lý 401 → chuyển về `/login` (hiện chỉ hiện toast lỗi)
- [x] Thêm booking `payment_status = 'paid'` / `refunded` để thấy Earnings + sparkline nhiều tháng
- [ ] Đồng bộ `TripsOverview` và `TopPackages` dùng chung một range

---

## 3. API Admin Bookings

Base: `/api/admin/bookings` — tất cả yêu cầu header `Authorization: Bearer <token>` và role `admin` hoặc `booking-staff`.

| Method | Endpoint        | Query / Body                                              | Mô tả                                                                   |
| ------ | --------------- | --------------------------------------------------------- | ----------------------------------------------------------------------- |
| GET    | `/`             | `page`, `limit`, `search`, `status`, `fromDate`, `toDate` | Danh sách + tìm kiếm + lọc trạng thái + lọc ngày khởi hành + phân trang |
| GET    | `/stats`        | —                                                         | 3 thẻ thống kê + sparkline 12 tháng                                     |
| GET    | `/trips`        | `range=7d\|30d\|3m\|12m`                                  | Số chuyến `done` / `canceled` theo thời gian                            |
| GET    | `/top-packages` | `range=12m`, `limit=5`                                    | Top tour theo số lượt đặt                                               |
| GET    | `/:id`          | —                                                         | Chi tiết booking + passengers + `history` (lịch sử suy ra)              |
| PUT    | `/:id/status`   | `{ "status": "pending\|confirmed\|cancelled" }`           | Đổi trạng thái, tự hoàn/trừ ghế                                         |

### Quy tắc nghiệp vụ đã chốt

- **Earnings** = `SUM(total_price)` với `payment_status = 'paid'`.
- **Trục thời gian thống kê** = `bookings.created_at`.
- **Tên khách** = `users.fullname`, fallback `bookings.contact_name` nếu `user_id` null.
- **Trạng thái hiển thị** chỉ có 3 nhãn tiếng Việt: `Chờ xử lý`, `Đã xác nhận`, `Đã hủy` (không có `Hoàn thành`). API trả thêm `status` raw (`pending/confirmed/cancelled`) để lọc.
- **Trips Overview:** `done = confirmed`, `canceled = cancelled`.
- **Top Packages:** đếm **số lượt đặt** (`COUNT(bookings.id)`) theo tour trong **12 tháng**, xếp tour nhiều booking nhất lên đầu; `% = số booking của tour / tổng booking trong kỳ`.
- **Lọc ngày trên bảng:** `fromDate` / `toDate` áp lên `tour_departures.departure_date` (cột Ngày khởi hành), định dạng `YYYY-MM-DD`.
- **% thay đổi:** tháng hiện tại vs tháng trước; kỳ trước = 0 → `0%` (hoặc `100%` nếu kỳ này có dữ liệu).
- **Đổi trạng thái:** hủy booking → hoàn ghế; mở lại booking đã hủy → kiểm tra đủ chỗ rồi trừ ghế; tất cả trong transaction.
- **Lịch sử hoạt động:** suy ra (DB chưa có bảng audit) từ `created_at` (khởi tạo), `updated_at` + `status`/`payment_status` (xác nhận/thanh toán/hủy/hoàn tiền). Trùng thời điểm thì ưu tiên: hủy/hoàn tiền → thanh toán → xác nhận → khởi tạo.
- **Bảng giá chi tiết:** đơn giá = `price_default + price_moving` (người lớn), `price_child + price_moving_child` (trẻ em). Nếu tổng các dòng lệch `total_price` → thêm dòng "Ưu đãi / điều chỉnh".

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
			"status": "confirmed",
			"status_label": "Đã xác nhận",
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

| File                                                        | Vai trò                                                           |
| ----------------------------------------------------------- | ----------------------------------------------------------------- |
| `backend/src/features/admin/bookings/booking.routes.js`     | Khai báo route, phân quyền                                        |
| `backend/src/features/admin/bookings/booking.controller.js` | HTTP handler, format response                                     |
| `backend/src/features/admin/bookings/booking.service.js`    | Nghiệp vụ, map DTO, tính %, transaction đổi trạng thái            |
| `backend/src/features/admin/bookings/booking.repository.js` | Knex query builder (list/stats/trips/top/detail/passengers/seats) |
| `backend/src/features/admin/bookings/booking.validate.js`   | Validate query/param/body                                         |

### Backend (sửa)

| File                                                     | Thay đổi                                                     |
| -------------------------------------------------------- | ------------------------------------------------------------ |
| `backend/src/app.js`                                     | Import + mount `/api/admin/bookings`                         |
| `backend/src/features/admin/bookings/booking.service.js` | Thêm `buildHistory()` + trả `history` trong chi tiết booking |

### Frontend (mới)

| File                                                   | Vai trò                                                                                                                                                                                                       |
| ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `frontend/src/features/admin/bookings/bookings.api.js` | Gọi 6 endpoint admin bookings                                                                                                                                                                                 |
| `frontend/src/features/admin/bookings/BookingDetail/`  | Trang chi tiết booking: `index.jsx`, `BookingHeader`, `TourInfoSection`, `CustomerSection`, `PassengersSection`, `TotalPriceCard`, `ActivityHistory`, `InvoiceModal`, `common`, `bookingMeta`, `detailFormat` |

### Frontend (sửa)

| File                                                                | Thay đổi                                                                                                                            |
| ------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `frontend/src/features/admin/bookings/DashboardBooking.jsx`         | Tải stats + top packages thật, nhãn thẻ tiếng Việt                                                                                  |
| `frontend/src/features/admin/bookings/components/TripsOverview.jsx` | Tự fetch theo range, trục Y động, tiêu đề/chú thích tiếng Việt                                                                      |
| `frontend/src/features/admin/bookings/components/BookingsTable.jsx` | Mã booking cột đầu (link chi tiết), cả dòng bấm được để mở chi tiết, search debounce, lọc ngày + trạng thái, phân trang server-side |
| `frontend/src/features/admin/bookings/components/TopPackages.jsx`   | Top tour theo lượt đặt trong 12 tháng, nhãn tiếng Việt                                                                              |
| `frontend/src/features/admin/bookings/dashboard.css`                | Style bộ lọc `.filter-box`, `.filter-select`, trạng thái tải/rỗng, dòng bấm được `.row-clickable`, link mã `.booking-code-link`     |
| `frontend/src/routes/AdminRoutes.jsx`                               | Thêm route `bookings/:id` → trang chi tiết booking                                                                                  |

### Đã xóa

- `frontend/src/features/admin/bookings/data/mockData.js` (và thư mục `data/`)

---

## 5. Lưu ý khi làm tiếp

- Backend dùng DB **`db_viet_travel`** trên port **`3307`** (xem `backend/.env`). Công cụ MySQL MCP của môi trường có thể trỏ sang DB khác (`db_viet_tour`) — **đừng sửa dữ liệu test qua MCP**, hãy kiểm tra bằng chính backend/Knex.
- `mysql2` trả `DECIMAL`/`SUM` dạng **string** → luôn `Number(...)` trước khi tính toán/format.
- Route tĩnh (`/stats`, `/trips`, `/top-packages`) phải khai báo **trước** `/:id`.
- Seed hiện tại: **33 user** (3 nội bộ + 30 khách), **50 booking**, **172 passenger**, trải 13 tháng với đủ trạng thái `confirmed/paid`, `confirmed/unpaid`, `pending/unpaid`, `cancelled/refunded`, `cancelled/unpaid`. Chạy `cd backend; npm run seed` để dựng lại DB sạch (reset id từ 1).
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
Invoke-RestMethod -Uri "http://localhost:3000/api/admin/bookings?fromDate=2026-10-01&toDate=2026-12-31&status=confirmed" -Headers $headers
Invoke-RestMethod -Uri "http://localhost:3000/api/admin/bookings/stats" -Headers $headers
Invoke-RestMethod -Uri "http://localhost:3000/api/admin/bookings/trips?range=12m" -Headers $headers
Invoke-RestMethod -Uri "http://localhost:3000/api/admin/bookings/top-packages?range=12m&limit=5" -Headers $headers
```

---

## 7. Lịch sử cập nhật

### 2026-10-20 — Seed DB thực tế: user thật + 50 booking + passenger khớp

**Đã làm:**

- [x] `00_reset.js`: xóa theo thứ tự FK rồi `ALTER TABLE ... AUTO_INCREMENT = 1` → id sạch bắt đầu từ 1.
- [x] `01_users.js`: **giữ nguyên email admin/staff** (`admin@`, `tourstaff@`, `bookingstaff@viettour.vn`); thay 30 khách hàng bằng tên thật + email theo tên thật (vd `nguyenvanan@gmail.com`) + SĐT/địa chỉ đầy đủ, ngày đăng ký trải đều.
- [x] `04_bookings.js`: 50 booking sinh theo PRNG có seed (chạy lại ổn định):
  - `total_price` = `adults*(price_default + price_moving) + children*(price_child + price_moving_child)` — **tính toán, không bịa**.
  - `created_at` trải 13 tháng gần nhất, luôn **trước** ngày khởi hành ≥ 5 ngày; `updated_at` = lúc xác nhận/thanh toán/hủy (sau `created_at`).
  - Đủ trạng thái: `confirmed/paid` (28), `confirmed/unpaid` (7), `pending/unpaid` (7), `cancelled/refunded` (6), `cancelled/unpaid` (2).
  - `contact_name/phone/email/dob/gender` lấy từ tài khoản khách thật; ~15% đơn là khách vãng lai nhưng vẫn đủ thông tin.
  - `passengers` khớp đúng `adults + children` (172 hành khách), đủ tên/giới tính/ngày sinh/`passenger_type`.
  - Cập nhật `seats_available` của `tour_departures` theo số khách đã đặt (bỏ qua đơn hủy).
- [x] `05_reviews.js`: chỉ đánh giá đơn đã xác nhận & đã đi, ngày sau khởi hành, rating/nội dung đa dạng, phủ tối thiểu mỗi tour.
- [x] `seed-config.js`: `users: 30`, `services: 10`, `bookings: 50`, `reviews: 40`.

**File liên quan:**

- Sửa: `backend/db/seeds/00_reset.js`, `01_users.js`, `04_bookings.js`, `05_reviews.js`, `backend/db/seed-config.js`

**Kiểm tra:**

- `cd backend; npm run seed` → `Ran 6 seed files`.
- Query verify: 33 users / 30 customers / 50 bookings / 172 passengers / 30 reviews; **0** đơn lệch `total_price`; **0** đơn `created_at >= departure_date`; **0** đơn `updated_at < created_at`; **0** đơn lệch số passenger.
- Test API admin: `/stats` (50 bookings, 172 khách, earnings `402.660.000 đ`, sparkline 12 tháng), `/trips`, `/top-packages`, list, `/:id` (có `history` 3 mốc cho đơn `cancelled/refunded`) đều `success=true`.

**Ghi chú:**

- Chạy `npm run seed` sẽ **xóa toàn bộ** dữ liệu hiện có và dựng lại DB sạch; redis không cần cho bước seed.

---

### 2026-10-19 — Chỉnh nền header card + màu khối "Chưa thu"

**Đã làm:**

- [x] Header các card (Thông tin tour, Thông tin khách hàng, Danh sách hành khách, Tổng tiền, Lịch sử hoạt động) dùng nền xanh nhạt `bg-primary-50/60`.
- [x] Khối **Chưa thu** đổi từ nền vàng (amber) sang xanh dương (`bg-sky-100`, chữ `text-sky-700`).
- [x] Đưa tiêu đề Tổng tiền / Lịch sử hoạt động vào header card thống nhất với các card còn lại.

**File liên quan:**

- Sửa: `frontend/src/features/admin/bookings/BookingDetail/common.jsx`, `TotalPriceCard.jsx`, `ActivityHistory.jsx`

**Kiểm tra:**

- `npm run lint` pass, `npm run build` pass.

---

### 2026-10-19 — Trang Admin Booking Detail + click dòng mở chi tiết

**Đã làm:**

- [x] Thêm route `/admin/bookings/:id`; bấm một dòng (hoặc mã booking) trong bảng sẽ mở chi tiết đúng `id`.
- [x] Tạo thư mục `frontend/src/features/admin/bookings/BookingDetail/` và tách component: header, thông tin tour, khách hàng, hành khách, tổng tiền, lịch sử hoạt động, modal hóa đơn.
- [x] Component **Tổng tiền**: dòng người lớn/trẻ em + dòng "Ưu đãi / điều chỉnh" khi lệch tổng, tổng cộng, khối thu tiền theo `payment_status` (ĐÃ THU / CHƯA THU / ĐÃ HOÀN TIỀN).
- [x] Component **Lịch sử hoạt động**: timeline dot màu, sắp xếp mới nhất trên cùng.
- [x] Backend `getBookingDetailService` trả thêm `history` (suy ra, không cần migration).
- [x] Modal **In hóa đơn** dùng `print-only` có sẵn.
- [x] Skeleton khi tải + alert/nút thử lại khi lỗi.

**File liên quan:**

- Thêm: `frontend/src/features/admin/bookings/BookingDetail/` (index, BookingHeader, TourInfoSection, CustomerSection, PassengersSection, TotalPriceCard, ActivityHistory, InvoiceModal, common, bookingMeta, detailFormat)
- Sửa: `backend/src/features/admin/bookings/booking.service.js`, `frontend/src/routes/AdminRoutes.jsx`, `frontend/src/features/admin/bookings/components/BookingsTable.jsx`, `frontend/src/features/admin/bookings/dashboard.css`

**Kiểm tra:**

- `npm run lint` pass, `npm run build` pass.
- Test API `GET /api/admin/bookings/:id`: booking hủy trả `history` 2 mốc (hủy + khởi tạo) đúng thứ tự; kèm `passengers` và `status_label`.

**Ghi chú:**

- Lịch sử là **suy ra** từ `created_at`/`updated_at` + trạng thái; chưa có bảng audit riêng. Booking seed đều `unpaid` nên khối thu tiền hiển thị "CHƯA THU".
- Trang chi tiết hiện chỉ hiển thị, chưa có nút đổi trạng thái.

---

### 2026-10-19 — Chỉnh độ tương phản nhãn % Top Packages

**Đã làm:**

- [x] Nhãn phần trăm trong Top Packages dùng **chữ trắng**.
- [x] Nền nhãn giữ đúng **màu tương ứng với lát donut** của từng tour.
- [x] Thêm bóng chữ nhẹ để chữ trắng dễ đọc hơn trên nền sáng.
- [x] Giữ nguyên màu lát donut.

**File liên quan:**

- Sửa: `TopPackages.jsx`, `dashboard.css`

**Kiểm tra:**

- `npm run lint` pass, `npm run build` pass.

---

### 2026-10-19 — Việt hóa dashboard + bộ lọc ngày/trạng thái + Top Packages theo lượt đặt

**Đã làm:**

- [x] Việt hóa toàn bộ nhãn: thẻ thống kê, Tổng quan chuyến đi, Tour đặt nhiều nhất, bảng booking, phân trang.
- [x] Top Packages: tính tổng lượt đặt trong 12 tháng, xếp tour nhiều booking nhất lên đầu, `%` theo tổng lượt đặt.
- [x] Bảng booking: cột **Mã booking** đầu tiên, **Tên khách** thứ hai.
- [x] Bỏ nút **Add Booking**.
- [x] Thay nút **Today** bằng bộ lọc **Từ ngày / Đến ngày** + **Trạng thái**.
- [x] Backend list nhận `fromDate`, `toDate` và trả `status` raw + `status_label` tiếng Việt.

**File liên quan:**

- Sửa backend: `booking.repository.js`, `booking.service.js`, `booking.validate.js`
- Sửa frontend: `DashboardBooking.jsx`, `TripsOverview.jsx`, `TopPackages.jsx`, `BookingsTable.jsx`, `dashboard.css`

**Kiểm tra:**

- `npm run lint` pass, `npm run build` pass.
- Test API: lọc `fromDate=2026-10-01&toDate=2026-12-31&status=confirmed` → 4 booking đúng.
- Test validate: ngày sai định dạng / from > to → 400.
- Test top-packages: `totalBookings = 20`, tour top 3 booking (15%).

**Ghi chú:**

- TopPackages hiện cố định range `12m` trong `DashboardBooking`.
- Bộ lọc ngày áp lên `tour_departures.departure_date` (Ngày khởi hành).

---

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
