import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { insertMueble } from "../services/firebaseMuebles";
import { auth } from '../firebase'; // Asegúrate de importar auth también

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
  const [errors, setErrors] = useState({});

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

  const validateForm = () => {
    const newErrors = {};
    if (!formData.numeroSerie.trim()) newErrors.numeroSerie = "Este campo es obligatorio.";
    if (!formData.tipo.trim()) newErrors.tipo = "Este campo es obligatorio.";
    if (!formData.marca.trim()) newErrors.marca = "Este campo es obligatorio.";
    if (!formData.ubicacion.trim()) newErrors.ubicacion = "Este campo es obligatorio.";
    if (!formData.estado.trim()) newErrors.estado = "Debes seleccionar un estado.";
    if (!formData.fechaRegistro.trim()) newErrors.fechaRegistro = "Selecciona una fecha.";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      alert("⚠️ Debes iniciar sesión para guardar.");
      return;
    }

    try {
      console.log("📌 UID:", user.uid);
      console.log("📦 Datos del mueble:", formData);

      await insertMueble(user.uid, formData);
      alert("✅ Mueble guardado");
      navigate("/");
    } catch (error) {
      console.error("Error al guardar en Firebase:", error);
      alert("❌ Error al guardar el mueble: " + error.message);
    }
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
      {errors.numeroSerie && <p className="text-red-400 text-sm">{errors.numeroSerie}</p>}

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
      {errors.tipo && <p className="text-red-400 text-sm">{errors.tipo}</p>}

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
      {errors.marca && <p className="text-red-400 text-sm">{errors.marca}</p>}

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
      {errors.ubicacion && <p className="text-red-400 text-sm">{errors.ubicacion}</p>}

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
      {errors.estado && <p className="text-red-400 text-sm">{errors.estado}</p>}

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
      {errors.fechaRegistro && <p className="text-red-400 text-sm">{errors.fechaRegistro}</p>}

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
