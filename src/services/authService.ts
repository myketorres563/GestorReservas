// src/auth/authService.ts
import axios from "axios";
import type { AuthSession, LoginCredentials } from "../types/Auth";
import { authStorage } from "../auth/authStorage";

// Valor por defecto para evitar pantallas blancas si no hay variable de entorno
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const authService = {
    // Login
    login(email: string, password?: string): Promise<AuthSession> {
        return axios.post<AuthSession>(`${API_BASE_URL}/login`, { email, password })
            .then((r) => {
                if (!r.data.token) throw new Error("Login fallido: token no recibido");
                authStorage.set(r.data); // Guardamos sesión automáticamente
                return r.data;
            });
    },

    // Register
    register(credentials: LoginCredentials): Promise<AuthSession> {
        return axios.post<AuthSession>(`${API_BASE_URL}/register`, credentials)
            .then((r) => {
                if (!r.data.token) throw new Error("Registro fallido: token no recibido");
                authStorage.set(r.data); // Guardamos sesión automáticamente
                return r.data;
            });
    },

    // Logout
    logout(): void {
        authStorage.clear();
    },

    // Obtener sesión actual del almacenamiento
    getSession(): AuthSession | null {
        return authStorage.get();
    }
};
