import React, { useState } from 'react';
import { registerUser } from '../services/db';
import { useNavigate } from 'react-router-dom';

export default function RegisterForm() {
  const [form, setForm] = useState({ nombre: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    const ok = registerUser(form);
    if (ok) {
      alert('✅ Registrado correctamente');
      navigate('/login'); // ⬅️ redirige al login
    } else {
      alert('❌ Ya existe ese email');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-4">
      <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-lg w-full max-w-md border border-white/20">
        <h2 className="text-white text-2xl font-bold mb-6 text-center">Crear cuenta</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            name="nombre"
            onChange={handleChange}
            placeholder="Nombre completo"
            className="w-full px-4 py-2 rounded bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            name="email"
            type="email"
            onChange={handleChange}
            placeholder="Correo electrónico"
            className="w-full px-4 py-2 rounded bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            name="password"
            type="password"
            onChange={handleChange}
            placeholder="Contraseña"
            className="w-full px-4 py-2 rounded bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold transition duration-300"
          >
            Registrarse
          </button>
          <p className="text-white text-sm text-center">
            ¿Ya tienes cuenta?{" "}
            <a href="/login" className="text-blue-400 underline">
              Inicia sesión aquí
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}