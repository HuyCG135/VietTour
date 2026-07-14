import app from "./src/app.js";

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`
          VietTour Server đang chạy
          Website:  http://localhost:${PORT}
          API:      http://localhost:${PORT}/api
          Database: ${process.env.DB_NAME || "web_du_lich"}

          Các trang có thể truy cập:
          • http://localhost:${PORT}/              → Trang chủ
          • http://localhost:${PORT}/tours         → Danh sách tours
          • http://localhost:${PORT}/login         → Đăng nhập
     `);
});
