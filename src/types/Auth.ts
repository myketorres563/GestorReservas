// src/types/Auth.ts

export interface User {
  id: number;
  email: string;
  name: string;
}

// Lo que enviamos al hacer login
export interface LoginCredentials {
  email: string;
  password?: string;
}

// Lo que devuelve el servidor (json-server-auth devuelve accessToken)
export interface AuthResponse {
  accessToken: string;
  user: User;
}

// Lo que usa el Contexto de autenticación (AuthContext.tsx)
// Hacemos que sea compatible con la respuesta del servidor
export interface AuthSession {
  accessToken: string;
  token: string; 
  user: User;
}