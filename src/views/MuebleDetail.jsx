// src/components/MuebleDetail.jsx
import React, { useState, useEffect } from 'react';
import { db } from '../services/db';

const MuebleDetail = ({ id, onBack }) => {
  const [mueble, setMueble] = useState(null);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const load = async () => {
      const result = await db.exec(`SELECT * FROM muebles WHERE id = ?`, [id]);
      if (result.length > 0 && result[0].values.length > 0) {
        const keys = result[0].columns;
        const values = result[0].values[0];
        const obj = Object.fromEntries(keys.map((k, i) => [k, values[i]]));
        setMueble(obj);
      }
    };
    load();
  }, [id]);

  const handleChange = (e) => {
    setMueble({ ...mueble, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    const { numeroSerie, tipo, marca, ubicacion, estado, notas } = mueble;
    await db.run(
      `UPDATE muebles SET numeroSerie = ?, tipo = ?, marca = ?, ubicacion = ?, estado = ?, notas = ? WHERE id = ?`,
      [numeroSerie, tipo, marca, ubicacion, estado, notas, id]
    );
    alert('✅ Cambios guardados');
    setEditMode(false);
  };

  const handleDelete = async () => {
    if (confirm('¿Eliminar este mueble?')) {
      await db.run(`DELETE FROM muebles WHERE id = ?`, [id]);
      alert('🗑️ Eliminado');
      onBack();
    }
  };

  if (!mueble) return <p className="text-white">Cargando...</p>;

  return (
    <div className="p-4 max-w-md mx-auto bg-gray-800 text-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Detalle del Mueble</h2>
      {['numeroSerie', 'tipo', 'marca', 'ubicacion', 'estado', 'notas'].map((field) => (
        <div className="mb-3" key={field}>
          <label className="block text-sm capitalize">{field}:</label>
          {editMode ? (
            <input
              name={field}
              value={mueble[field]}
              onChange={handleChange}
              className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded"
            />
          ) : (
            <p className="bg-gray-700 p-2 rounded">{mueble[field]}</p>
          )}
        </div>
      ))}

      <div className="flex gap-2 mt-4">
        {editMode ? (
          <button onClick={handleSave} className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700">
            Guardar
          </button>
        ) : (
          <button onClick={() => setEditMode(true)} className="bg-yellow-600 px-4 py-2 rounded hover:bg-yellow-700">
            Editar
          </button>
        )}
        <button onClick={handleDelete} className="bg-red-600 px-4 py-2 rounded hover:bg-red-700">
          Borrar
        </button>
        <button onClick={onBack} className="bg-gray-600 px-4 py-2 rounded hover:bg-gray-700">
          Volver
        </button>
      </div>
    </div>
  );
};

export default MuebleDetail;