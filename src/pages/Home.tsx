import { Link } from "react-router-dom";

export default function Home() {
    // Borramos el hook useAuth porque no vamos a comprobar nada
    return (
        <div >
            <h1>Bienvenido a Gestión Reservas</h1>
            <p>La mejor aplicación para gestionar tus reservas.</p>
            
            <div >
                <Link to="/login">
                    <button>Iniciar Sesión</button>
                </Link>
                <Link to="/register">
                    <button >Registrarse</button>
                </Link>
            </div>
        </div>
    );
}