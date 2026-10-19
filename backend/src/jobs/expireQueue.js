import "dotenv/config";
import { Queue } from "bullmq";

// ============ Queue BullMQ cho việc TỰ HỦY đơn hết hạn thanh toán ============
// Redis là nơi lưu job "hẹn giờ" → app restart không mất hẹn giờ.
// Thiết kế fail-soft: Redis có chết cũng KHÔNG được làm hỏng nghiệp vụ —
// đơn đặt tour vẫn tạo bình thường, sweep (mỗi 5') + lazy-check sẽ lo bù.

const PAYMENT_DEADLINE_HOURS = Number(process.env.PAYMENT_DEADLINE_HOURS) || 24;

// maxRetriesPerRequest: null là yêu cầu bắt buộc của BullMQ cho worker (lệnh blocking)
// enableOfflineQueue: false → Redis không chạy thì lệnh fail NGAY (promise không treo vô hạn)
const connection = {
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: Number(process.env.REDIS_PORT) || 6379,
    maxRetriesPerRequest: null,
    enableOfflineQueue: false,
};

const queue = new Queue("booking-expire", {
    connection,
    // Retry cho MỌI job trong queue (đặt ở Queue vì job.opts được ghi lúc add job,
    // Worker chỉ đọc khi xử lý lỗi): lỗi → thử lại tối đa 3 lần, chờ tăng dần 5s→10s→20s
    defaultJobOptions: {
        attempts: 3,
        backoff: { type: "exponential", delay: 5000 },
    },
});

// Ghi log lỗi Redis nhưng dedup: ioredis retry ~100ms/lần → không spam console hàng chục dòng giống nhau
const lastLogged = new Map();
export const logRedisError = (scope, err) => {
    const msg = err?.message || String(err);
    if (lastLogged.get(scope) === msg) return;
    lastLogged.set(scope, msg);
    console.warn(`[Jobs] Lỗi kết nối Redis (${scope}): ${msg}`);
};

// Nếu không gắn listener cho 'error', lỗi kết nối Redis sẽ thành "unhandled error" làm sập app
queue.on("error", (err) => logRedisError("queue", err));

/**
 * Đặt hẹn giờ hủy đơn cho booking vừa tạo.
 * delay = hạn thanh toán (mặc định 24h) → job chạy đúng lúc đơn hết hạn.
 * Fail-soft 2 lớp:
 *  - Redis chết → queue.add có thể TREO chờ kết nối lại → race với timeout 3s,
 *    quá hạn thì bỏ qua (đơn vẫn OK, sweep + lazy-check sẽ lo bù);
 *  - reject/treout → chỉ log warning, đơn KHÔNG bị fail.
 */
const ADD_TIMEOUT_MS = 3000;
export const scheduleExpireJob = async (bookingId) => {
    try {
        await Promise.race([
            queue.add(
                "expire-booking",
                { bookingId },
                {
                    delay: PAYMENT_DEADLINE_HOURS * 60 * 60 * 1000,
                    // Job xong thì giữ thêm 1 ngày (để debug), job lỗi giữ 7 ngày rồi tự xóa
                    // → Redis không phình do tích lũy job
                    removeOnComplete: { age: 24 * 60 * 60 },
                    removeOnFail: { age: 7 * 24 * 60 * 60 },
                },
            ),
            new Promise((_, reject) =>
                setTimeout(() => reject(new Error(`timeout ${ADD_TIMEOUT_MS}ms chờ Redis`)), ADD_TIMEOUT_MS),
            ),
        ]);
    } catch (err) {
        console.warn(
            `[Jobs] Không đặt được job hết hạn cho booking #${bookingId} (Redis đang chạy chưa?): ${err.message}`,
        );
    }
};

export const closeExpireQueue = async () => {
    await queue.close();
};

export { queue, connection, PAYMENT_DEADLINE_HOURS };
