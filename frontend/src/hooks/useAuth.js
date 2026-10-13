import { useState } from "react";
import { getUser } from "../features/auth/auth.api";

export default function useAuth() {
    const [user] = useState(() => getUser());

    return { user, isAuthenticated: !!user, isAdmin: user?.role === "admin" };
}
