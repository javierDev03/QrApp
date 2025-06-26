import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signOut, onAuthStateChanged } from 'firebase/auth';

export default function PerfilPage() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUsuario(user);
    });

    return () => unsubscribe(); // limpiamos el listener
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  return (
    <div className="min-h-screen m-4 flex items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="bg-gray-900 border border-gray-700 rounded-xl shadow-lg p-6 w-full max-w-md text-white">
        <div className="flex items-center gap-4 mb-6">
          <div className="bg-blue-600 rounded-full p-3">
            <span className="text-3xl">👤</span>
          </div>
          <h1 className="text-2xl font-bold">Mi Perfil</h1>
        </div>

        {usuario && (
          <div className="space-y-3 mb-6">
            <div className="bg-gray-800 p-3 rounded-md">
              <p className="text-sm text-gray-400">Nombre</p>
              <p className="text-lg font-semibold">{usuario.displayName || 'Sin nombre'}</p>
            </div>
            <div className="bg-gray-800 p-3 rounded-md">
              <p className="text-sm text-gray-400">Correo</p>
              <p className="text-lg font-semibold">{usuario.email}</p>
            </div>
          </div>
        )}

        <button
          onClick={handleLogout}
          className="w-full bg-red-700 hover:bg-red-800 text-white py-2 rounded-md font-semibold transition"
        >
          🚪 Cerrar sesión
        </button>
      </div>
    </div>
  );
}