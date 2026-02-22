import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { reservaService } from '../services/reservaService';
import type { Reserva } from '../types/Reserva';

const ReservaDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [reserva, setReserva] = useState<Reserva | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let activo = true;

    if (!id) {
      setError("ID de reserva no proporcionado.");
      setLoading(false);
      return;
    }

    const numericId = Number(id);

    if (isNaN(numericId)) {
      setError("ID de reserva inválido.");
      setLoading(false);
      return;
    }

    reservaService.get(numericId)
      .then((data) => {
        if (activo) setReserva(data);
      })
      .catch((err) => {
        console.error("Error al cargar la reserva:", err);
        if (activo) setError("No se pudo cargar la reserva.");
      })
      .finally(() => {
        if (activo) setLoading(false);
      });

    return () => {
      activo = false;
    };
  }, [id]);

  if (loading) return <p>Cargando detalle...</p>;
  if (error) return <p>{error}</p>;
  if (!reserva) return <p>Reserva no encontrada</p>;

  return (
    <section className="card">
      <h1>Detalle de Reserva #{reserva.id}</h1>

      <div className="detail-content">
        <p><strong>Cliente:</strong> {reserva.nombreCliente}</p>
        <p><strong>Fecha:</strong> {new Date(reserva.fecha).toLocaleDateString()}</p>
        <p><strong>Personas:</strong> {reserva.personas}</p>
        {reserva.userId && (
          <p><strong>ID Usuario:</strong> {reserva.userId}</p>
        )}
      </div>

      <div>
        <Link to="/dashboard">
          <button>Volver al listado</button>
        </Link>
      </div>
    </section>
  );
};

export default ReservaDetailPage;