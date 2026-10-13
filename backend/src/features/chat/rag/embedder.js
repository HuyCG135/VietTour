// Gọi Ollama để tạo embedding văn bản bằng nomic-embed-text
const OLLAMA_HOST = process.env.OLLAMA_HOST || "http://localhost:11434";
const EMBED_MODEL = process.env.OLLAMA_EMBED_MODEL || "nomic-embed-text";

export async function embedTexts(texts) {
    if (!texts || texts.length === 0) return [];

    const response = await fetch(`${OLLAMA_HOST}/api/embed`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: EMBED_MODEL, input: texts }),
    });

    if (!response.ok) {
        throw new Error(`Ollama embedding thất bại: HTTP ${response.status}`);
    }

    const data = await response.json();
    return data.embeddings || [];
}