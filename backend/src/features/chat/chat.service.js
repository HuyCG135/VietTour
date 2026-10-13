import { embedTexts } from "./rag/embedder.js";
import { searchChunks } from "./rag/store.js";
import { isRagReady } from "./rag/index.js";

const OLLAMA_HOST = process.env.OLLAMA_HOST || "http://localhost:11434";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "qwen2.5:3b";
const RAG_MIN_SCORE = Number(process.env.RAG_MIN_SCORE || 0.6);
const RAG_TOP_K = Number(process.env.RAG_TOP_K || 8);
const MAX_HISTORY = 8;

const SYSTEM_PROMPT =
    "Bạn là trợ lý du lịch của VietTour, hỗ trợ khách hàng tìm hiểu và đặt tour. " +
    "Khi được cung cấp phần \"Dữ liệu tham khảo\", hãy trả lời DỰA TRÊN dữ liệu đó (tên tour, vùng miền, giá, lịch trình, lịch khởi hành...) và không bịa thêm thông tin không có trong dữ liệu. " +
    "Nếu dữ liệu không đủ để trả lời, hãy nói rõ bạn chưa có thông tin và gợi ý khách hàng liên hệ hotline. " +
    "Với câu hỏi chào hỏi/ngoài lề, trả lời ngắn gọn, thân thiện. Trả lời bằng tiếng Việt.";

const createError = (status, message) => {
    const err = new Error(message);
    err.status = status;
    return err;
};

export async function chatWithAssistant(messages) {
    if (!isRagReady()) {
        throw createError(503, "Trợ lý du lịch đang khởi tạo dữ liệu. Vui lòng thử lại sau vài giây.");
    }

    const history = Array.isArray(messages) ? messages.slice(-MAX_HISTORY) : [];
    const lastUser = [...history].reverse().find((m) => m && m.role === "user");

    let context = "";
    let sources = [];

    if (lastUser?.content) {
        const [queryEmbedding] = await embedTexts([lastUser.content]);
        const hits = searchChunks(queryEmbedding, RAG_TOP_K).filter((h) => h.score >= RAG_MIN_SCORE);

        context = hits.map((h) => h.chunk.text).join("\n\n");

        const seen = new Set();
        sources = hits
            .map((h) => h.chunk.metadata)
            .filter((m) => m?.type === "tour" && m.tourId)
            .filter((m) => {
                if (seen.has(m.tourId)) return false;
                seen.add(m.tourId);
                return true;
            })
            .map((m) => ({ tourId: m.tourId, tourName: m.tourName }));
    }

    const systemContent = context
        ? `${SYSTEM_PROMPT}\n\n### Dữ liệu tham khảo:\n${context}`
        : SYSTEM_PROMPT;

    const responses = await fetch(`${OLLAMA_HOST}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            model: OLLAMA_MODEL,
            messages: [{ role: "system", content: systemContent }, ...history],
            stream: false,
            options: { temperature: 0.3 },
        }),
    });

    if (!responses.ok) {
        throw createError(502, "Không kết nối được chatbot (Ollama). Vui lòng kiểm tra Docker.");
    }

    const data = await responses.json();

    return {
        message: data?.message?.content || "",
        sources,
    };
}