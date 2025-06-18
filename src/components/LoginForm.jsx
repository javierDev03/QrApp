import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // 👈 importar hook
import { loginUser } from "../services/db";

export default function LoginForm() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate(); // 👈 inicializar hook

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = await loginUser(form);
    if (user) {
      alert("👋 Bienvenido " + user.nombre);
      localStorage.setItem("usuario", JSON.stringify(user));
      window.location.href = "/"; // redirigir forzando recarga
    } else {
      alert("❌ Usuario no válido");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-8 shadow-2xl"
      >
        <h2 className="text-white text-2xl font-semibold text-center mb-6">
          Bienvenido
        </h2>
        <div className="mb-4">
          <label className="block text-white text-sm mb-1">Correo</label>
          <input
            name="email"
            onChange={handleChange}
            placeholder="Correo"
            className="w-full px-4 py-2 rounded bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-6">
          <label className="block text-white text-sm mb-1">Contraseña</label>
          <input
            name="password"
            type="password"
            onChange={handleChange}
            placeholder="Contraseña"
            className="w-full px-4 py-2 rounded bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold transition duration-300"
        >
          Entrar
        </button>
        <p className="text-white text-sm text-center mt-4">
          ¿No tienes cuenta?{" "}
          <a href="/registro" className="text-blue-400 underline">
            Crea una aquí
          </a>
        </p>
      </form>
    </div>
  );
}