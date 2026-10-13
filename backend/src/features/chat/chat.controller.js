import { chatWithAssistant } from "./chat.service.js";

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
    });
};

export const sendMessage = async (req, res) => {
    try {
        const { messages } = req.body || {};

        if (!Array.isArray(messages) || messages.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Thiếu lịch sử hội thoại.",
            });
        }

        const result = await chatWithAssistant(messages);

        res.json({
            success: true,
            data: result,
        });
    } catch (error) {
        handleError(res, error, "Lỗi khi gọi trợ lý du lịch");
    }
};