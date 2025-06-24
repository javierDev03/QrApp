import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { insertMueble, existsMueble, isDbReady } from "../services/db"; // ✅ Importa también existsMueble e isDbReady

const FurnitureForm = ({ qrCode }) => {
  const [formData, setFormData] = useState({
    numeroSerie: qrCode || "",
    tipo: "",
    marca: "",
    ubicacion: "",
    estado: "",
    notas: "",
    fechaRegistro: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (qrCode) {
      setFormData((prev) => ({ ...prev, numeroSerie: qrCode }));
    }
  }, [qrCode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isDbReady()) {
      alert("⚠️ La base de datos aún no está lista. Intenta de nuevo.");
      return;
    }

    if (existsMueble(formData.numeroSerie)) {
      alert("⚠️ Ya existe un mueble con ese número de serie");
      return;
    }

    const id = insertMueble(formData);
    alert("✅ Mueble guardado");
    navigate("/");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 p-4 max-w-md mx-auto pb-28"
    >
      <h2 className="text-xl font-semibold text-white text-center justify-center">
        Registrar Artículo
      </h2>

      <label htmlFor="numeroSerie" className="text-white">
        Número de Patrimonio
      </label>
      <input
        id="numeroSerie"
        name="numeroSerie"
        value={formData.numeroSerie}
        onChange={handleChange}
        placeholder="Ej: 001-AZUL-2024"
        className="p-2 rounded bg-gray-800 text-white"
      />
      
      <label htmlFor="tipo" className="text-white">
        Tipo
      </label>
      <input
        id="tipo"
        name="tipo"
        value={formData.tipo}
        onChange={handleChange}
        placeholder="Ej: Silla, Escritorio, Monitor"
        className="p-2 rounded bg-gray-800 text-white"
      />
      <label htmlFor="marca" className="text-white">
        Marca
      </label>
      <input
        id="marca"
        name="marca"
        value={formData.marca}
        onChange={handleChange}
        placeholder="Ej: HP, Dell, IKEA"
        className="p-2 rounded bg-gray-800 text-white"
      />
      <label htmlFor="ubicacion" className="text-white">
        Ubicación
      </label>
      <input
        id="ubicacion"
        name="ubicacion"
        value={formData.ubicacion}
        onChange={handleChange}
        placeholder="Ej: Aula 3, Oficina 2° Piso"
        className="p-2 rounded bg-gray-800 text-white"
      />
      <label htmlFor="estado" className="text-white">
        Estado
      </label>
      <select
        id="estado"
        name="estado"
        value={formData.estado}
        onChange={handleChange}
        className="p-2 rounded bg-gray-800 text-white"
      >
        <option value="">Selecciona un estado</option>
        <option value="Bueno">Bueno</option>
        <option value="Regular">Regular</option>
        <option value="Malo">Malo</option>
      </select>
      <label htmlFor="notas" className="text-white">
        Notas
      </label>
      <textarea
        id="notas"
        name="notas"
        value={formData.notas}
        onChange={handleChange}
        placeholder="Ej: Equipado con cable HDMI, requiere limpieza, etc."
        className="p-2 rounded bg-gray-800 text-white"
      />
      <label htmlFor="fechaRegistro" className="text-white">
        Fecha de Registro
      </label>
      <input
        type="date"
        id="fechaRegistro"
        name="fechaRegistro"
        value={formData.fechaRegistro}
        onChange={handleChange}
        className="p-3 rounded bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Guardar
      </button>
    </form>
  );
};

export default FurnitureForm;
