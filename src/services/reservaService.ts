import axios from 'axios';
import type { Reserva } from '../types/Reserva';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string | undefined;

if (!API_BASE_URL) {
  throw new Error('No está definida la URL de la API');
}

const API_URL = `${API_BASE_URL}/reservations`;

// Helper para leer la sesión
const getSession = () => {
  const sessionStr = localStorage.getItem('auth_session');
  if (!sessionStr) return null;

  try {
    return JSON.parse(sessionStr);
  } catch {
    return null;
  }
};

const getAuthHeaders = () => {
  const session = getSession();
  const token = session?.token || session?.accessToken;

  return token
    ? { headers: { Authorization: `Bearer ${token}` } }
    : {};
};

export const reservaService = {
  create: (
    reserva: Omit<Reserva, 'id' | 'userId'>
  ): Promise<Reserva> =>
    axios.post(
      API_URL,
      {
        nombreCliente: reserva.nombreCliente,
        fecha: reserva.fecha,
        personas: Number(reserva.personas)
      },
      getAuthHeaders()
    ).then(r => r.data),

  getAll: (): Promise<Reserva[]> =>
    axios.get(API_URL, getAuthHeaders())
      .then(r => r.data),

  get: (id: number): Promise<Reserva> =>
    axios.get(`${API_URL}/${id}`, getAuthHeaders())
      .then(r => r.data),

  update: (reserva: Reserva): Promise<Reserva> =>
    axios.put(
      `${API_URL}/${reserva.id}`,
      {
        nombreCliente: reserva.nombreCliente,
        fecha: reserva.fecha,
        personas: Number(reserva.personas)
      },
      getAuthHeaders()
    ).then(r => r.data),

  delete: (id: number): Promise<void> =>
    axios.delete(`${API_URL}/${id}`, getAuthHeaders())
      .then(() => {})
};
