import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';

export default function RegisterPage() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Enviamos nombre, email y password
      // Nota: TypeScript podría quejarse si LoginCredentials no tiene 'name'.
      // Lo forzamos aquí porque json-server-auth sí lo acepta.
      await authService.register(formData as any);
      
      alert('Usuario registrado con éxito. Ahora inicia sesión.');
      navigate('/login');
    } catch (err) {
      setError('Error al registrar. El email podría estar en uso.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <section className="card">
      <h1>Crear Cuenta</h1>
      <p className="muted">Regístrate para gestionar tus reservas</p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
            <input
              type="text"
              name="name"
              placeholder="Nombre completo"
              value={formData.name}
              onChange={handleChange}
              required
            />
        </div>

        <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
        </div>

        <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              value={formData.password}
              onChange={handleChange}
              required
            />
        </div>

        {error && <div className="toast error">{error}</div>}
        
        <div className="actions" >
            <button type="submit" disabled={loading}>
            {loading ? 'Registrando...' : 'Registrarse'}
            </button>
            
            <div >
                ¿Ya tienes cuenta? <Link to="/login" style={{ color: '#646cff' }}>Inicia sesión aquí</Link>
            </div>
        </div>
      </form>
    </section>
  );
}