import { useAuth } from "../auth/authContext";

export default function ProfilePage() {
    const { user } = useAuth();

    return (
        <section className="card">
            <h1>Mi Perfil</h1>
            <p className="muted">Información del usuario conectado.</p>

            <div >
                <p><strong>ID de Usuario:</strong> {user?.id}</p>
                <p><strong>Email:</strong> {user?.email}</p>
                {/* Algunos backends devuelven nombre, otros no. Lo manejamos seguro: */}
                <p><strong>Nombre:</strong> {user?.name || "Usuario registrado"}</p>
            </div>
        </section>
    );
}