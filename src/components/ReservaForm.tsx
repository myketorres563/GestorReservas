import { useEffect, useState } from "react";
import type { Reserva } from "../types/Reserva";

type ReservaFormProps = {
    anadirReserva: (reserva: Omit<Reserva, 'id'>) => void;
    editarReserva: (reserva: Reserva) => void;
    cancelarEdicionReserva: () => void;
    peticionEnProgreso: boolean;
    reservaSeleccionada: Reserva | null;
}

function ReservaForm({ 
    anadirReserva, 
    peticionEnProgreso, 
    reservaSeleccionada, 
    editarReserva, 
    cancelarEdicionReserva 
}: ReservaFormProps) {
    
    // ESTADO INICIAL: todos como string
    const initialState = {
        nombreCliente: "",
        fecha: "",
        personas: "1"
    };

    const [formData, setFormData] = useState(initialState);

    useEffect(() => {
        if (reservaSeleccionada) {
            // Ajustamos la fecha para que se vea bien en el input
            let fechaFormatoInput = reservaSeleccionada.fecha || "";
            if (reservaSeleccionada.fecha && reservaSeleccionada.fecha.length > 10) {
                fechaFormatoInput = reservaSeleccionada.fecha.substring(0, 10);
            }

            setFormData({
                nombreCliente: reservaSeleccionada.nombreCliente || "",
                fecha: fechaFormatoInput,
                personas: reservaSeleccionada.personas?.toString() || "1"
            });
        } else {
            setFormData(initialState);
        }
    }, [reservaSeleccionada]);

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        
        // Validación simple
        if (formData.nombreCliente.trim().length === 0 || !formData.fecha) {
            alert("Rellena nombre y fecha");
            return;
        }

        // Preparamos el objeto con personas como número
        const reservaLimpia = {
            nombreCliente: formData.nombreCliente,
            fecha: formData.fecha,
            personas: Number(formData.personas)
        };

        if (reservaSeleccionada && reservaSeleccionada.id) {
            // Editar
            editarReserva({ ...reservaLimpia, id: reservaSeleccionada.id });
        } else {
            // Crear
            anadirReserva(reservaLimpia);
            setFormData(initialState); // Limpiar tras crear
        }
    }

    return (
        <section className="card form-section">
            <h2>
                {reservaSeleccionada 
                    ? `Editar reserva de: ${reservaSeleccionada.nombreCliente}` 
                    : "Agregar nueva reserva"}
            </h2>
            
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Nombre:</label>
                    <input 
                        type="text" 
                        name="nombreCliente"
                        placeholder="Nombre del cliente" 
                        value={formData.nombreCliente} 
                        onChange={handleChange} 
                        required
                        disabled={peticionEnProgreso}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="fecha">Fecha:</label>
                    <input 
                        type="date" 
                        id="fecha"       // <- id asociado
                        name="fecha"
                        value={formData.fecha} 
                        onChange={handleChange} 
                        required
                        disabled={peticionEnProgreso}
                    />
                    </div>

                
                <div className="form-group">
                    <label>Personas:</label>
                    <input 
                        type="number" 
                        name="personas"
                        min="1"
                        placeholder="1" 
                        value={formData.personas} 
                        onChange={handleChange} 
                        required
                        disabled={peticionEnProgreso}
                    />
                </div>
                
                <div className="actions">
                    <button type="submit" disabled={peticionEnProgreso}>
                        {peticionEnProgreso 
                            ? "Guardando..." 
                            : (reservaSeleccionada ? "Guardar" : "Agregar")}
                    </button>
                    
                    {reservaSeleccionada && (
                        <button 
                            type="button" 
                            className="cancel" 
                            disabled={peticionEnProgreso} 
                            onClick={() => {
                                setFormData(initialState);
                                cancelarEdicionReserva();
                            }}
                        >
                            Cancelar
                        </button>
                    )}
                </div>
            </form>
        </section>
    );
}

export default ReservaForm;
