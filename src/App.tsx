import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './auth/authContext';

// Importación de páginas
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage'; // Importamos la nueva página
import ReservasPage from './pages/ReservasPage';
import ReservaDetailPage from './pages/ReservaDetailPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';

// Layout para el menú de navegación privado (solo visible si estás logueado)
const LayoutPrivado = () => {
  const { logout } = useAuth();
  return (
    <div>
      <nav >
         <a href="/dashboard" >Reservas - </a>
         <a href="/perfil" >Mi Perfil</a>
         <button onClick={logout}>Cerrar Sesión</button>
      </nav>
      <Outlet />
    </div>
  );
};

// Guardián de rutas: Si no estás logueado, te manda al Login
const PrivateRoutes = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

function App() {
  return (
    // AuthProvider debe envolver todo para que useAuth funcione en toda la app
    <AuthProvider> 
        <BrowserRouter>
          <Routes>
            
            {/* --- RUTAS PÚBLICAS (Accesibles por todos) --- */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            <Route element={<PrivateRoutes />}>
              <Route element={<LayoutPrivado />}>
                <Route path="/dashboard" element={<ReservasPage />} />
                <Route path="/perfil" element={<ProfilePage />} />
                <Route path="/detalle/:id" element={<ReservaDetailPage />} />
              </Route>
            </Route>

            {/* --- RUTA 404 (Para URLs que no existen) --- */}
            <Route path="*" element={<NotFoundPage />} />
            
          </Routes>
        </BrowserRouter>
    </AuthProvider>
  );
}

export default App;