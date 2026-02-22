import { useEffect, useState } from "react";
import ReservaForm from "../components/ReservaForm";
import ReservaList from "../components/ReservaList";
import { reservaService } from "../services/reservaService";
import type { Reserva } from "../types/Reserva";

export default function ReservasPage() {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);
  const [peticionEnProgreso, setPeticionEnProgreso] = useState<boolean>(false);
  const [reservaSeleccionada, setReservaSeleccionada] = useState<Reserva | null>(null);

  useEffect(() => {
    reservaService
      .getAll()
      .then((listaReservas) => setReservas(listaReservas))
      .catch((error) => console.error("Error al cargar reservas:", error))
      .finally(() => setCargando(false));
  }, []);

  function borrarReserva(reservaObjetivo: Reserva): void {
    if (reservaObjetivo.id == null) return;

    setPeticionEnProgreso(true);
    reservaService.delete(reservaObjetivo.id)
      .then(() => {
        setReservas((prev) =>
          prev.filter((r) => r.id !== reservaObjetivo.id)
        );
      })
      .catch((error) => {
        console.error("Error al borrar:", error);
        alert("No se pudo borrar la reserva.");
      })
      .finally(() => setPeticionEnProgreso(false));
  }

  function cancelarEdicionReserva(): void {
    setReservaSeleccionada(null);
  }

  function editarReserva(reservaObjetivo: Reserva): void {
    setPeticionEnProgreso(true);

    reservaService.update(reservaObjetivo)
      .then((reservaActualizada) => {
        setReservas((prev) =>
          prev.map((r) =>
            r.id === reservaObjetivo.id ? reservaActualizada : r
          )
        );
        cancelarEdicionReserva();
      })
      .catch((error) => {
        console.error("Error al editar:", error);
        alert("Error al actualizar la reserva.");
      })
      .finally(() => setPeticionEnProgreso(false));
  }

  function anadirReserva(
    reservaData: Omit<Reserva, "id" | "userId">
  ): void {
    setPeticionEnProgreso(true);

    reservaService.create(reservaData)
      .then((nuevaReserva) => {
        setReservas((prev) => [...prev, nuevaReserva]);
      })
      .catch((error: any) => {
        console.error("Error al crear:", error);
        alert(error?.response?.data?.message || "No se pudo crear la reserva.");
      })
      .finally(() => setPeticionEnProgreso(false));
  }

  return (
    <section className="card">
      <h1>Gestión de Reservas</h1>

      <ReservaList
        reservas={reservas}
        cargando={cargando}
        peticionEnProgreso={peticionEnProgreso}
        borrarReserva={borrarReserva}
        setReservaSeleccionada={setReservaSeleccionada}
        editarReserva={editarReserva}
      />

      <ReservaForm
        anadirReserva={anadirReserva}
        peticionEnProgreso={peticionEnProgreso}
        reservaSeleccionada={reservaSeleccionada}
        editarReserva={editarReserva}
        cancelarEdicionReserva={cancelarEdicionReserva}
      />
    </section>
  );
}
