// Rate limiter đơn giản dùng in-memory Map
const rateLimiter = (maxRequests, windowMs) => {
    const clients = new Map();

    return (req, res, next) => {
        const key = req.ip || req.socket?.remoteAddress || "unknown";
        const now = Date.now();

        if (!clients.has(key)) {
            clients.set(key, { count: 1, start: now });
            return next();
        }

        const client = clients.get(key);

        // Reset nếu đã hết thời gian window
        if (now - client.start > windowMs) {
            clients.set(key, { count: 1, start: now });
            return next();
        }

        client.count++;

        if (client.count > maxRequests) {
            return res.status(429).json({
                success: false,
                message: "Quá nhiều yêu cầu. Vui lòng thử lại sau.",
            });
        }

        next();
    };
};

export default rateLimiter;
