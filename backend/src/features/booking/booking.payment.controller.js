import { VNPay, ignoreLogger, ProductCode, VnpLocale, dateFormat } from "vnpay";
import { createPaymentUrlService, confirmPaymentService } from "./booking.service.js";

const handleError = (res, error, fallbackMessage) => {
    if (error.status && error.status < 500) {
        return res.status(error.status).json({
            success: false,
            message: error.message,
        });
    }

    console.error(`${fallbackMessage}:`, error);
    res.status(500).json({
        success: false,
        message: fallbackMessage,
        error: error.message,
    });
};

const getVNPayInstance = () => {
    const { VNP_TMN_CODE, VNP_SECURE_SECRET, VNP_HOST } = process.env;

    if (!VNP_TMN_CODE || !VNP_SECURE_SECRET || !VNP_HOST) {
        const error = new Error(
            "Thiếu cấu hình VNPay (VNP_TMN_CODE, VNP_SECURE_SECRET, VNP_HOST) trong backend/.env",
        );
        error.status = 500;
        throw error;
    }

    return new VNPay({
        tmnCode: VNP_TMN_CODE,
        secureSecret: VNP_SECURE_SECRET,
        vnpayHost: VNP_HOST,
        testMode: true,
        hashAlgorithm: "SHA512",
        loggerFn: ignoreLogger,
    });
};

// Tạo URL thanh toán VNPay cho một booking đã tồn tại (unpaid/pending)
export const createVNPayUrl = async (req, res) => {
    try {
        const { booking_id } = req.body;
        const vnpayUrl = await createPaymentUrlService(req, booking_id, getVNPayInstance());

        res.status(201).json({
            success: true,
            vnpayUrl,
            bookingId: booking_id,
        });
    } catch (error) {
        handleError(res, error, "Không thể tạo liên kết thanh toán");
    }
};

// VNPay callback: browser redirect về sau khi thanh toán xong (route public)
export const vnpayReturn = async (req, res) => {
    const extractBookingId = (txnRef) => {
        const match = String(txnRef || "").match(/^BOK(\d+)/);
        return match ? Number(match[1]) : null;
    };

    const redirect = (status, message, bookingId) => {
        const query = `status=${status}&message=${encodeURIComponent(message || "")}`;
        return res.redirect(
            bookingId ? `/payment-result?${query}&bookingId=${bookingId}` : `/payment-result?${query}`,
        );
    };

    try {
        const verify = getVNPayInstance().verifyReturnUrl(req.query);

        if (!verify.isSuccess) {
            return redirect("error", "Giao dịch thất bại hoặc bị hủy", null);
        }

        const bookingId = extractBookingId(req.query.vnp_TxnRef);
        if (!bookingId) {
            return redirect("error", "Không tìm thấy mã đơn hàng", null);
        }

        await confirmPaymentService(bookingId);
        return redirect("success", "", bookingId);
    } catch (error) {
        console.error("VNPay Return Error:", error);
        return redirect("error", "Lỗi máy chủ khi xử lý thanh toán", null);
    }
};