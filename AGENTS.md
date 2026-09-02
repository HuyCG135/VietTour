# VietTour

Du lịch web app: `backend/` (Express + MySQL) và `frontend/` (React + Vite). Hai package độc lập, mỗi package có `package.json` riêng — **không có** root `package.json` / workspaces.

## Commands

Backend (port 3000):
- `cd backend; npm run dev` — dev với nodemon; `npm start` chạy `server.js`.
- Không có lint/test (test script là placeholder). Verify bằng cách chạy server + gọi API.

Frontend (Vite):
- `cd frontend; npm run dev` — dev server, proxy `/api` → `http://localhost:3000` (xem `vite.config.js`).
- `npm run lint` — eslint (đây là check duy nhất; không có typecheck/test).
- `npm run build` — xuất ra `frontend/dist`.

## Architecture

- Backend feature-based: `backend/src/features/<name>/{*.routes.js, *.controller.js, *.service.js, *.repository.js, *.validate.js}`; middleware dùng chung ở `backend/src/middlewares/`, mail ở `shared/mailService.js`. Controller chỉ lo HTTP (nhận req → gọi service → trả res); **service** chứa nghiệp vụ; **repository** là data access thuần (Knex/raw SQL).
- `backend/src/app.js` phục vụ luôn `frontend/dist` nếu đã build (kèm SPA fallback cho route không phải `/api`); nếu chưa build, `/` trả 503. => Trong dev, chạy frontend riêng qua Vite, không dựa vào backend serve.
- Routes mount tại `/api/auth`, `/api/tours`, `/api/bookings` (rate-limiter chung 100 req/15min áp lên `/api`).
- API response wrap: `{ success: boolean, data?, message? }` — frontend `useFetch.js` đọc `response.success`/`response.data`. Giữ format này khi thêm endpoint.
- Auth: JWT. Frontend lưu `token` + `user` trong `localStorage` (`features/auth/auth.api.js`); gửi header `Bearer <token>`. Backend middleware ở `middlewares/auth.js` gắn `req.user`.
- Backend `middlewares/auth.js` throw nếu thiếu `JWT_SECRET` (server không khởi động được).

## Setup & env

- MySQL: tạo DB bằng `db.sql` hoặc migration Knex (DB tên `db_viet_tour`, utf8mb4). Backend dùng pool `mysql2` promise (`src/config/db.js`), đọc `DB_HOST/DB_USER/DB_PASSWORD/DB_NAME`. Migration/seed Knex đọc cùng env trong `backend/knexfile.js`.

### Database (Knex migration + seed)

Lệnh chạy trong `backend/` (cần MySQL đang chạy + `DB_PASSWORD` đúng trong `backend/.env`):
- `npm run migrate` — chạy các migration trong `db/migrations/` (mỗi bảng 1 file, theo thứ tự khóa ngoại; khớp `db.sql`).
- `npm run migrate:rollback` — rollback lượt migration gần nhất.
- `npm run seed` — chạy mọi file `.js` trong `db/seeds/` theo thứ tự tên (Knex-native, mỗi file 1 seed độc lập; mỗi file phải export `seed(knex)`).
- `npm run migrate:make <name>` — tạo migration mới; tự đặt số thứ tự theo thứ tự bảng (bảng con phải sau bảng cha vì FK).

Seed structure (`backend/db/`):
- `seeds/00_reset.js` → xóa toàn bộ dữ liệu (thứ tự FK). `01..05` seed từng nhóm: users, tours(+images/itineraries/departures), services, bookings, reviews.
- Vì Knex chạy từng file độc lập (không share id), mỗi seed tự query lại id FK theo field duy nhất (email/slug) chứ không nhận id truyền vào.
- `db/seed-data/tours.js` — `TOUR_SEED`: **18 tour thật** chắt lọc từ file `db_vietravel_KTPM.sql` (đồ án KTPM), gồm description, images (cloudinary), itineraries, departures. Seeder `02_tours.js` đọc từ đây.
- `db/factories.js` — hàm sinh dữ liệu mẫu bằng faker (users/services); `db/seed-config.js` — tập trung số lượng (users/services/bookings/reviews; `tours` không còn dùng vì đã dùng data thật). **KHÔNG đặt file không-có-seed-fn trong `db/seeds/`** (Knex sẽ báo "must have a seed function").
- Muốn thêm bảng mới: thêm migration + tạo `seeds/0X_<ten>.js` (số X sau các bảng nó phụ thuộc).

> ✅ **Repository dùng Knex query builder** (`src/config/knex.js`), khớp schema mới (`price_default`, `cover_image`, `departure_id`, `adults`/`children`, `contact_*`).
>
> ⚠️ **Còn lệch:** `validateBooking`/`validateTour` (`src/features/booking/booking.validate.js`, `src/features/tour/tour.validate.js`) và `booking.service.js` (`createBookingService`) vẫn dùng field cũ (`price`, `tour_id`, `number_of_people`). Sửa tiếp thì khớp về schema mới. Schema chuẩn là `db.sql` + migration.
- Env backend bắt buộc: `JWT_SECRET`, `DB_*`. Khác: `PORT`, `VERIFY_EMAIL_SECRET`, `RESET_PASS_SECRET`, `FRONTEND_URL`, `SMTP_*` (email không bắt buộc — nếu thiếu SMTP, link verify/reset chỉ log ra console).
- Frontend: `VITE_API_URL` (mặc định `/api`).
- **Không có** `.env.example` trong repo — nếu cần tạo từ `process.env.*` / `import.meta.env.*` trong code.

## Conventions

- Code comment và message API/UI bằng **Tiếng Việt**. Giữ nguyên ngôn ngữ khi sửa.
- Frontend route: `/admin/*` và `/user/*` là layout riêng (`AdminRoutes.jsx` / `UserRoutes.jsx`); routes public nằm trong `MainLayout`. Tour detail dùng `:id` (không phải slug).
- Env vars không được viết trong git (`.gitignore` đã loại `.env*`).
