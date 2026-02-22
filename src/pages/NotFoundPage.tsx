import { Link } from "react-router-dom";

export default function NotFoundPage() {
    return (
        <div >
            <h1 >404</h1>
            <h2>Página no encontrada</h2>
            <p>La ruta que intentas visitar no existe.</p>
            
            <Link to="/">
                <button>Volver al Inicio</button>
            </Link>
        </div>
    );
}