import { embedTexts } from "./embedder.js";
import { clearChunks, addChunk, getChunkCount } from "./store.js";
import { RAG_SOURCES } from "./sources.js";

// Khởi tạo index RAG: đọc dữ liệu từ các nguồn → nhúng embedding → đưa vào store in-memory.
// Chạy nền lúc server start; nếu Ollama/DB chưa sẵn sàng sẽ thử lại định kỳ, không làm sập server.

let ready = false;
let lastError = null;
let retryCount = 0;

const MAX_RETRIES = 10;
const RETRY_DELAY_MS = 60_000;

export const isRagReady = () => ready;

export const ragStatus = () => ({
    ready,
    chunks: getChunkCount(),
    sources: RAG_SOURCES.map((s) => s.name),
    error: lastError?.message || null,
});

async function rebuild() {
    const chunks = [];
    for (const source of RAG_SOURCES) {
        const sourceChunks = await source.build();
        chunks.push(...sourceChunks);
    }

    const embeddings = await embedTexts(chunks.map((c) => c.text));

    clearChunks();
    for (let i = 0; i < chunks.length; i++) {
        addChunk({ ...chunks[i], embedding: embeddings[i] });
    }

    ready = true;
    retryCount = 0;
    lastError = null;
    console.log(`RAG sẵn sàng: ${chunks.length} chunks (nguồn: ${RAG_SOURCES.map((s) => s.name).join(", ")})`);
}

function scheduleRetry(error) {
    ready = false;
    lastError = error;
    retryCount += 1;

    if (retryCount <= MAX_RETRIES) {
        console.error(
            `RAG chưa khởi tạo được (lần ${retryCount}/${MAX_RETRIES}): ${error.message} — thử lại sau ${RETRY_DELAY_MS / 1000}s`,
        );
        setTimeout(tryRebuild, RETRY_DELAY_MS);
    } else {
        console.error("RAG không khởi tạo được sau nhiều lần thử. Kiểm tra Ollama (Docker) và MySQL.");
    }
}

async function tryRebuild() {
    try {
        await rebuild();
    } catch (error) {
        scheduleRetry(error);
    }
}

export function initRag() {
    tryRebuild();
}