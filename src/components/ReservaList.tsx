import { useNavigate } from "react-router-dom";
import type { Reserva } from "../types/Reserva";

type ReservaListProps = {
    reservas: Reserva[];
    cargando: boolean;
    peticionEnProgreso: boolean;
    borrarReserva: (reserva: Reserva) => void;
    editarReserva: (reserva: Reserva) => void; 
    setReservaSeleccionada: (reserva: Reserva) => void;
};

function ReservaList({ reservas, cargando, peticionEnProgreso, setReservaSeleccionada, borrarReserva }: ReservaListProps) {
    const navigate = useNavigate();

    function verReserva(reserva: Reserva): void {
        // Navega al detalle si tienes esa ruta configurada
        navigate(`/detalle/${reserva.id}`);
    }

    return (
        <div className="list-container">
            {cargando && <p>Cargando reservas...</p>}
            
            {!cargando && (
                <ul className="reserva-list">
                    {reservas && reservas.map((reserva) => (
                        <li key={reserva.id} className="reserva-item">

                            {/* AQUÍ ESTÁ EL CAMBIO QUE PEDISTE */}
                            <span 
                                className="reserva-info" 
                                onClick={() => { verReserva(reserva) }}
                                style={{ cursor: 'pointer' }}
                            >
                                <strong>
                                    {reserva.userId}
                                </strong>
                            </span>

                            <div className="actions">
                                <button 
                                    className="edit" 
                                    disabled={peticionEnProgreso} 
                                    onClick={(e) => {
                                        e.stopPropagation(); // Evita entrar al detalle al editar
                                        setReservaSeleccionada(reserva);
                                    }} 
                                    title="Editar"
                                >
                                <p>Editar</p>
                                </button>
                                <button 
                                    className="delete" 
                                    disabled={peticionEnProgreso} 
                                    onClick={(e) => {
                                        e.stopPropagation(); // Evita entrar al detalle al borrar
                                        borrarReserva(reserva);
                                    }} 
                                    title="Eliminar"
                                >
                                <p>Eliminar</p>
                                </button>
                            </div>
                        </li>
                    ))}
                    
                    {reservas.length === 0 && <p className="muted">No hay reservas registradas.</p>}
                </ul>
            )}
        </div>
    );
}

export default ReservaList;