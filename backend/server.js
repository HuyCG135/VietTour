import app from "./src/app.js";
import { startExpireJobs, closeExpireJobs } from "./src/jobs/expireBookingWorker.js";

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
    console.log(`
          VietTour Server đang chạy
          Website:  http://localhost:${PORT}
          API:      http://localhost:${PORT}/api
          Database: ${process.env.DB_NAME || "web_du_lich"}
          Vui lòng bật frontend để truy cập vào website: http://localhost:5173
     `);

    // Bật worker tự hủy đơn hết hạn (BullMQ) — fail-soft: Redis chưa lên thì log warning,
    // worker tự kết nối lại khi Redis sống, không chặn server
    startExpireJobs().catch((err) =>
        console.warn(`[Jobs] Không khởi động được worker hết hạn (sweep/lazy-check vẫn lo): ${err.message}`),
    );
});

// Graceful shutdown: đóng worker + queue trước khi thoát để job dở dang
// không bị treo "stalled" trong Redis
const shutdown = async (signal) => {
    console.log(`\nNhận ${signal} — đang tắt server...`);
    server.close();
    try {
        // Race timeout: Redis chết thì close có thể treo → sau 5s vẫn force thoát
        await Promise.race([
            closeExpireJobs(),
            new Promise((resolve) => setTimeout(resolve, 5000)),
        ]);
    } catch {
        // bỏ qua — process vẫn thoát
    }
    process.exit(0);
};
process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
