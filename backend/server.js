import app from "./src/app.js";

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`
          VietTour Server đang chạy
          Website:  http://localhost:${PORT}
          API:      http://localhost:${PORT}/api
          Database: ${process.env.DB_NAME || "web_du_lich"}
          Vui lòng bật frontend để truy cập vào website: http://localhost:5173
     `);
});
