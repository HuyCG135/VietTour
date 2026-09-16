// Lưu chunks + embedding in-memory, tìm kiếm bằng cosine similarity
const chunks = [];

export function clearChunks() {
    chunks.length = 0;
}

export function addChunk(chunk) {
    chunks.push(chunk);
}

export function getChunkCount() {
    return chunks.length;
}

const cosineSimilarity = (a, b) => {
    let dot = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < a.length; i++) {
        dot += a[i] * b[i];
        normA += a[i] * a[i];
        normB += b[i] * b[i];
    }

    if (normA === 0 || normB === 0) return 0;

    return dot / (Math.sqrt(normA) * Math.sqrt(normB));
};

// Trả về top-k chunk có độ tương đồng cao nhất với embedding câu hỏi
export function searchChunks(queryEmbedding, topK = 5) {
    return chunks
        .map((chunk) => ({ chunk, score: cosineSimilarity(queryEmbedding, chunk.embedding) }))
        .sort((a, b) => b.score - a.score)
        .slice(0, topK);
}