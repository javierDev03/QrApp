import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMuebles, updateMueble, deleteMueble } from '../services/firebaseMuebles';
import { auth } from '../firebase';

const FurnitureDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [mueble, setMueble] = useState(null);
  const [editando, setEditando] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        const muebles = await getMuebles(user.uid);
        const encontrado = muebles.find(m => m.id === id);
        if (encontrado) {
          setMueble(encontrado);
        }
      } catch (error) {
        // Opcional: puedes mostrar un error al usuario o loguearlo
        console.error('Error al obtener los muebles:', error);
      }
    };
    fetchData();
  }, [id]);

  const handleChange = (e) => {
    setMueble({ ...mueble, [e.target.name]: e.target.value });
  };

 const handleGuardar = async () => {
  const data = {
    ...mueble,
    fechaRegistro: new Date(mueble.fechaRegistro).toISOString().split('T')[0], // ← normaliza formato
  };

  await updateMueble(mueble.id, data);
  setEditando(false);
  alert('✅ Mueble actualizado');
};

  const handleEliminar = async () => {
    if (confirm('¿Estás seguro de eliminar este mueble?')) {
      await deleteMueble(mueble.id);
      alert('🗑️ Mueble eliminado');
      navigate('/');
    }
  };

  if (!mueble) return <p className="text-center mt-8 text-white">Mueble no encontrado.</p>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-6 pb-28 max-w-md mx-auto pt-12">
      <h1 className="text-2xl font-bold mb-6 text-center drop-shadow">🔍 Detalle del Artículo</h1>

      <div className="bg-white/10 border border-white/20 backdrop-blur-sm p-5 rounded-xl shadow-lg space-y-4">
        {[
          { field: 'numeroSerie', label: 'Número de Patrimonio', placeholder: 'Ej. Silla-001' },
          { field: 'tipo', label: 'Tipo', placeholder: 'Ej. Escritorio, Silla' },
          { field: 'marca', label: 'Marca', placeholder: 'Ej. HP, Dell' },
          { field: 'ubicacion', label: 'Ubicación', placeholder: 'Ej. Aula 101' },
          { field: 'estado', label: 'Estado', placeholder: 'Ej. Bueno, Regular' },
          { field: 'notas', label: 'Notas', placeholder: 'Observaciones del mueble' },
          { field: 'fechaRegistro', label: 'Fecha de Registro', placeholder: 'YYYY-MM-DD' },
        ].map(({ field, label, placeholder }) => (
          <div key={field}>
            <label className="block text-sm font-semibold mb-1">{label}:</label>
            {editando ? (
              field === 'notas' ? (
                <textarea
                  name={field}
                  value={mueble[field]}
                  onChange={handleChange}
                  placeholder={placeholder}
                  className="w-full bg-gray-900/50 border border-gray-500 text-white p-2 rounded placeholder-gray-400 resize-none max-h-32 overflow-y-auto"
                />
              ) : field === 'estado' ? (
                <select
                  name="estado"
                  value={mueble.estado}
                  onChange={handleChange}
                  className="w-full bg-gray-900/50 border border-gray-500 text-white p-2 rounded placeholder-gray-400"
                >
                  <option value="">Selecciona un estado</option>
                  <option value="Bueno">Bueno</option>
                  <option value="Regular">Regular</option>
                  <option value="Malo">Malo</option>
                </select>
              ) : (
                <input
                  type={field === 'fechaRegistro' ? 'date' : 'text'}
                  name={field}
                  value={field === 'fechaRegistro'
                    ? new Date(mueble[field]).toISOString().split('T')[0]
                    : mueble[field]}
                  onChange={handleChange}
                  placeholder={placeholder}
                  className="w-full bg-gray-900/50 border border-gray-500 text-white p-2 rounded placeholder-gray-400"
                />
              )
            ) : (
              <>
                {field === 'fechaRegistro' && !mueble[field] ? (
                  <p className="text-gray-400 italic">Sin fecha registrada</p>
                ) : (
                  <p className="bg-gray-800/40 p-2 rounded break-words whitespace-pre-wrap overflow-auto max-h-32">
                    {field === 'fechaRegistro' && mueble[field]
                     ? new Date(mueble[field]).toISOString().split('T')[0]
                      : mueble[field]}
                  </p>
                )}
              </>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap gap-3 justify-center">
        {!editando ? (
          <button
            onClick={() => setEditando(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
          >
            ✏️ Editar
          </button>
        ) : (
          <button
            onClick={handleGuardar}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow"
          >
            💾 Guardar
          </button>
        )}
        <button
          onClick={handleEliminar}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded shadow"
        >
          🗑️ Eliminar
        </button>
      </div>
    </div>
  );
};

export default FurnitureDetail;