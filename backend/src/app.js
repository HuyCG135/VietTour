import express from "express";
import cors from "cors";
import fs from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import "dotenv/config";

import requestLogger from "./middlewares/logger.js";
import { errorHandler, notFound } from "./middlewares/errorHandler.js";
import rateLimiter from "./middlewares/rateLimiter.js";
import tourRoutes from "./features/tour/tour.routes.js";
import authRoutes from "./features/auth/auth.routes.js";
import bookingRoutes from "./features/booking/booking.routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// ============ GLOBAL MIDDLEWARES ============
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logger
app.use(requestLogger);

// Rate limiter (100 requests per 15 minutes)
app.use("/api", rateLimiter(100, 15 * 60 * 1000));

const frontendDistPath = join(__dirname, "../frontend/dist");

app.use("/api/tours", tourRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);

app.get("/api/test", (req, res) => {
    res.json({
        success: true,
        message: "API is working!",
        timestamp: new Date(),
    });
});

// ============ FRONTEND ROUTES ============
if (fs.existsSync(frontendDistPath)) {
    app.use(express.static(frontendDistPath));

    // SPA fallback for client-side routing
    app.get(/^\/(?!api).*/, (req, res) => {
        res.sendFile(join(frontendDistPath, "index.html"));
    });
} else {
    app.get("/", (req, res) => {
        res.status(503).json({
            success: false,
            message: "Frontend chưa được build. Chạy: cd frontend && npm run build",
        });
    });
}

// ============ ERROR HANDLERS ============
// 404 handler - phải đặt sau tất cả routes
app.use(notFound);

// Error handler - phải đặt cuối cùng
app.use(errorHandler);

export default app;
