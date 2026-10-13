import { useState, useEffect } from "react";

const API_URL = import.meta.env.VITE_API_URL || "/api";

export default function useTourFilters() {
    const [filters, setFilters] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let ignore = false;

        const load = async () => {
            try {
                const res = await fetch(`${API_URL}/tours/filters`);
                const json = await res.json();
                if (!ignore && json?.success) {
                    setFilters(json.data);
                }
            } catch {
                /* ignore */
            } finally {
                if (!ignore) setLoading(false);
            }
        };

        load();
        return () => { ignore = true; };
    }, []);

    return { filters, loading };
}
