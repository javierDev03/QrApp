import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMuebles } from '../services/db';
import { generatePDFReport } from '../utils/generatePDFReport';

const MueblesList = () => {
  const [muebles, setMuebles] = useState([]);
  const navigate = useNavigate();
  const [filtroTipo, setFiltroTipo] = useState('');
  const [filtroUbicacion, setFiltroUbicacion] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const raw = await getMuebles();
      setMuebles(raw);
    };
    fetchData();
  }, []);

  const mueblesFiltrados = muebles.filter((m) => {
    const fecha = new Date(m.fechaRegistro);
    const desde = fechaInicio ? new Date(fechaInicio) : null;
    const hasta = fechaFin ? new Date(fechaFin) : null;

    return (
      (!filtroTipo || m.tipo.toLowerCase().includes(filtroTipo.toLowerCase())) &&
      (!filtroUbicacion || m.ubicacion.toLowerCase().includes(filtroUbicacion.toLowerCase())) &&
      (!desde || fecha >= desde) &&
      (!hasta || fecha <= hasta)
    );
  });

  const handleView = (id) => {
    navigate(`/detalle/${id}`);
  };

  return (
    <div className="p-4 space-y-4 max-w-md pt-12 mx-auto min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <h1 className="text-2xl font-bold text-center mb-6 text-white drop-shadow-md">Inventario</h1>
      <div className="flex flex-col gap-2 mb-4">
        <input
          type="text"
          placeholder="Filtrar por tipo..."
          value={filtroTipo}
          onChange={(e) => setFiltroTipo(e.target.value)}
          className="p-2 rounded bg-gray-800 text-white placeholder-gray-400"
        />
        <input
          type="text"
          placeholder="Filtrar por ubicación..."
          value={filtroUbicacion}
          onChange={(e) => setFiltroUbicacion(e.target.value)}
          className="p-2 rounded bg-gray-800 text-white placeholder-gray-400"
        />
        <input
          type="date"
          value={fechaInicio}
          onChange={(e) => setFechaInicio(e.target.value)}
          className="p-2 rounded bg-gray-800 text-white placeholder-gray-400"
        />
        <input
          type="date"
          value={fechaFin}
          onChange={(e) => setFechaFin(e.target.value)}
          className="p-2 rounded bg-gray-800 text-white placeholder-gray-400"
        />
        {mueblesFiltrados.length > 0 && (
          <button
            onClick={() => generatePDFReport(mueblesFiltrados)}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full"
          >
            Descargar reporte PDF
          </button>
        )}
      </div>
      {muebles.length === 0 ? (
        <p className="text-center text-gray-400">No hay elementos registrados aún.</p>
      ) : (
        mueblesFiltrados.map((mueble, index) => (
          <div
            key={mueble.id}
            className="bg-white/10 border border-white/20 backdrop-blur-sm text-white p-4 rounded-2xl shadow-lg space-y-2 transition-transform hover:scale-[1.01]"
          >
            <div className="text-xs text-gray-300 font-mono">#{index + 1}</div>
            <div><span className="font-semibold">🔖 Serie:</span> {mueble.numeroSerie}</div>
            <div><span className="font-semibold">📦 Tipo:</span> {mueble.tipo}</div>
            <div><span className="font-semibold">📍 Ubicación:</span> {mueble.ubicacion}</div>
            <div className="pt-2">
              <button
                onClick={() => handleView(mueble.id)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm py-1.5 px-4 rounded-lg w-full"
              >
                Ver detalles
              </button>
            </div>
          </div>
        ))
      )}
      <div className="h-20" /> {/* Padding al final para no quedar oculto bajo el navbar */}
    </div>
  );
};

export default MueblesList;