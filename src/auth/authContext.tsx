import { createContext, useContext, useMemo, useState } from "react";
import type { AuthSession, User } from "../types/Auth";
import { authStorage } from "./authStorage";

type AuthContextValue = {
    user: User | null;
    isAuthenticated: boolean;
    login: (session: AuthSession) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const initial: AuthSession | null = authStorage.get();

    // CORRECCIÓN: Si hay usuario pero NO hay token, forzamos que sea null (logout)
    const validSession = (initial && initial.token && initial.user) ? initial : null;

    // Si la sesión no era válida, limpiamos el storage para no dejar basura
    if (initial && !validSession) {
        authStorage.clear();
    }

    const [user, setUser] = useState<User | null>(validSession?.user ?? null);
    const [token, setToken] = useState<string | null>(validSession?.token ?? null);

    function login(session: AuthSession) {
        authStorage.set(session);
        setUser(session.user);
        setToken(session.token);
    }

    function logout() {
        authStorage.clear();
        setUser(null);
        setToken(null);
    }

    const value = useMemo<AuthContextValue>(() => {
        return {
            user,
            isAuthenticated: Boolean(user && token), // Doble verificación
            login,
            logout
        };
    }, [user, token]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
    const contexto = useContext(AuthContext);
    if (!contexto) throw new Error("useAuth debe usarse dentro de <AuthProvider />");
    return contexto;
}