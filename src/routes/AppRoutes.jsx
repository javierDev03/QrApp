import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Home from '../views/Home';
import FurnitureFormPage from '../views/FurnitureFormPage';
import MueblesList from '../views/MueblesList';
import FurnitureDetail from '../views/FurnitureDetail';
import MobileLayout from '../layout/MobileLayout';
import QRScanner from '../components/QRScanner';
import PerfilPage from '../views/PerfilPage';
import NotFound from '../views/NotFound';
import LoginPage from '../components/LoginForm';
import RegisterPage from '../components/RegisterForm';

function AppRoutes() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('usuario'));

  // Escucha cambios de login/logout
  useEffect(() => {
    const interval = setInterval(() => {
      const user = localStorage.getItem('usuario');
      setIsLoggedIn(!!user);
    }, 500); // revisa cada medio segundo (puedes optimizar luego con contexto)

    return () => clearInterval(interval);
  }, []);

  const handleQRScan = (qrCode) => {
    console.log('📦 Navegando con QR:', qrCode);
    navigate(`/registrar?codigo=${encodeURIComponent(qrCode)}`);
  };

  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/registro" element={<RegisterPage />} />

      {/* Rutas protegidas */}
      {isLoggedIn ? (
        <Route element={<MobileLayout />}>
          <Route path="/" element={<MueblesList />} />
          <Route path="/scanner" element={<QRScanner onScan={handleQRScan} />} />
          <Route path="/perfil" element={<PerfilPage />} />
          <Route path="/detalle/:id" element={<FurnitureDetail />} />
          <Route path="/registrar" element={<FurnitureFormPage />} />
        </Route>
      ) : (
        <Route path="*" element={<Navigate to="/login" />} />
      )}

      {/* Ruta 404 (si no está logueado) */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;