import { useState } from 'react';
import { Link } from 'react-router-dom';

const TIENDAS_MOCK = [
  { id: 1, nombre: 'Abarrotes Don José', categoria: 'Abarrotes', abierto: true, productos: 6 },
  { id: 2, nombre: 'Farmacia San Rafael', categoria: 'Farmacia', abierto: true, productos: 2 },
  { id: 3, nombre: 'Papelería El Estudiante', categoria: 'Papelería', abierto: false, productos: 0 },
  { id: 4, nombre: 'Mini Super La Esquina', categoria: 'Abarrotes', abierto: true, productos: 1 },
  { id: 5, nombre: 'Ferretería El Tornillo', categoria: 'Ferretería', abierto: false, productos: 0 },
  { id: 6, nombre: 'Verduras y Frutas Lupita', categoria: 'Verdulería', abierto: true, productos: 2 },
];

export default function AdminTiendas() {
  const [tiendas, setTiendas] = useState(TIENDAS_MOCK);

  const handleEliminar = (id) => {
    if (!window.confirm('¿Eliminar esta tienda?')) return;
    setTiendas(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div className="min-h-[calc(100vh-112px)] px-6 py-12 max-w-5xl mx-auto">

      <div className="flex items-center justify-between mb-10 animate-fade-in-up">
        <div>
          <h1 className="text-4xl font-bold text-white mb-1">
            Gestión de <span className="text-emerald-400">Tiendas</span>
          </h1>
          <p className="text-gray-400 text-sm">{tiendas.length} tiendas registradas</p>
        </div>
        <Link
          to="/admin/tiendas/nueva"
          className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-5 py-3 rounded-2xl transition-all focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-500"
        >
          + Nueva tienda
        </Link>
      </div>

      <div className="bg-neutral-900 border-2 border-neutral-800 rounded-2xl overflow-hidden animate-fade-in-up" style={{ animationDelay: '0.07s' }}>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-800 text-gray-400 text-left">
              <th className="px-6 py-4 font-medium">Tienda</th>
              <th className="px-6 py-4 font-medium">Categoría</th>
              <th className="px-6 py-4 font-medium">Productos</th>
              <th className="px-6 py-4 font-medium">Estado</th>
              <th className="px-6 py-4 font-medium text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {tiendas.map((t) => (
              <tr key={t.id} className="border-b border-neutral-800 last:border-0 hover:bg-neutral-800/40 transition-colors">
                <td className="px-6 py-4 text-white font-medium">{t.nombre}</td>
                <td className="px-6 py-4 text-gray-400">{t.categoria}</td>
                <td className="px-6 py-4 text-gray-400">{t.productos}</td>
                <td className="px-6 py-4">
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${t.abierto ? 'bg-emerald-500/20 text-emerald-400' : 'bg-neutral-700 text-gray-500'}`}>
                    {t.abierto ? 'Abierto' : 'Cerrado'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-3">
                    <Link
                      to={`/admin/tiendas/editar/${t.id}`}
                      className="text-gray-400 hover:text-white border border-neutral-700 hover:border-neutral-500 px-4 py-2 rounded-xl transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                    >
                      Editar
                    </Link>
                    <button
                      onClick={() => handleEliminar(t.id)}
                      className="text-red-400 hover:text-white hover:bg-red-500 border border-red-500/40 hover:border-red-500 px-4 py-2 rounded-xl transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {tiendas.length === 0 && (
          <div className="text-center py-16 text-gray-500">
            No hay tiendas. <Link to="/admin/tiendas/nueva" className="text-emerald-400 hover:underline">Agrega una.</Link>
          </div>
        )}
      </div>
    </div>
  );
}
