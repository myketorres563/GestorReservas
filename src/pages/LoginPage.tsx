import { useState } from "react";
import { useAuth } from "../auth/authContext";
import { Navigate, useNavigate, Link } from "react-router-dom";
import { authService } from "../services/authService";

export default function LoginPage() {
    const { isAuthenticated, login } = useAuth();
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();

    if (isAuthenticated) {
      return <Navigate to="/dashboard" replace />
    }

    async function handleSubmit( e: React.FormEvent) {
      e.preventDefault();
      
      // LOG 1: Verificar que el botón funciona y ver qué datos se envían
      console.log("--- INTENTO DE LOGIN ---");
      console.log("Datos del formulario:", { email, password });

      setError(null);
      setLoading(true);

      try {
        console.log("Llamando a authService.login()...");
        
        const session = await authService.login(email.trim(), password);
        
        // LOG 2: Ver qué devolvió el backend (token, usuario, etc.)
        console.log("Respuesta del servicio (Login exitoso):", session);

        login(session); 
        console.log("Contexto actualizado. Redirigiendo...");
        
        navigate("/dashboard", {replace: true })
      } catch (err) {
        // LOG 3: IMPORTANTE - Ver cuál es el error real (401, 500, Network Error, etc.)
        console.error("ERROR EN LOGIN:", err);
        
        // Opcional: Si el error trae mensaje del backend, podrías pintarlo en el console
        // console.log("Detalles del error:", err.response?.data || err.message);

        setError("Credenciales incorrectas o error de conexión");
      } finally {
        setLoading(false);
        console.log("--- FIN DEL PROCESO ---");
      }
    }

    return (
        <section className="card">
            <h1>Iniciar Sesión</h1>
            <p className="muted">Introduzca sus datos para acceder</p>

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <input
                        type="text"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="username"
                        required
                    />
                </div>

                <div className="form-group">
                    <input
                        type="password"
                        placeholder="Contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="current-password"
                        required
                    />
                </div>

                <div >
                    <button type="submit" disabled={loading}>
                        {loading ? "Entrando..." : "Entrar"}
                    </button>
                    
                    <div >
                        ¿No tienes cuenta? <Link to="/register" style={{ color: '#646cff', fontWeight: 'bold' }}>Regístrate aquí</Link>
                    </div>
                </div>
            </form>

            {error && <div className="toast error" >{error}</div>}
        </section>
    );
}