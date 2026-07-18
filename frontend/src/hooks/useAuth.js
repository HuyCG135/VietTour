import { useState, useEffect } from "react";
import { getUser } from "../features/auth/auth.api";

export default function useAuth() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        setUser(getUser());
    }, []);

    return { user, isAuthenticated: !!user, isAdmin: user?.role === "admin" };
}
