import { useState, useEffect } from "react";

export default function useFetch(fn, deps = []) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let ignore = false;

        const load = async () => {
            setLoading(true);
            setError("");
            try {
                const response = await fn();
                if (!ignore) {
                    if (response?.success) {
                        setData(response.data);
                    } else {
                        setError(response?.message || "Lỗi tải dữ liệu");
                    }
                }
            } catch (err) {
                if (!ignore) setError(err?.message || "Lỗi kết nối");
            } finally {
                if (!ignore) setLoading(false);
            }
        };

        load();
        return () => { ignore = true; };
    }, deps);

    return { data, loading, error };
}
