const API_URL = import.meta.env.VITE_API_URL || "/api";

export async function sendChat(messages) {
    const res = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages }),
    });
    return res.json();
}