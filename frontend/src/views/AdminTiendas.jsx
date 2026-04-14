import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function AdminTiendas() {
  const [tiendas, setTiendas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTiendas = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${import.meta.env.VITE_API_URL}/tiendas`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setTiendas(data.data);
      } catch {
        setError('No se pudieron cargar las tiendas.');
      } finally {
        setLoading(false);
      }
    };
    fetchTiendas();
  }, []);

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Eliminar esta tienda?')) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/tiendas/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      setTiendas(prev => prev.filter(t => t.id !== id));
    } catch {
      alert('No se pudo eliminar la tienda.');
    }
  };

  return (
    <div className="min-h-[calc(100vh-112px)] px-6 py-12 max-w-5xl mx-auto">

      <div className="flex flex-wrap items-center justify-between gap-4 mb-10 animate-fade-in-up">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-1">
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

      {loading && <div className="text-center py-16 text-gray-400">Cargando tiendas...</div>}

      {error && (
        <div role="alert" className="bg-red-900/30 border border-red-500 text-red-400 p-4 rounded-xl text-sm mb-6">
          {error}
        </div>
      )}

      {!loading && !error && (
        <>
          {/* Mobile cards */}
          <div className="md:hidden flex flex-col gap-4 animate-fade-in-up" style={{ animationDelay: '0.07s' }}>
            {tiendas.map((t) => (
              <div key={t.id} className="bg-neutral-900 border-2 border-neutral-800 rounded-2xl p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-white font-semibold">{t.nombre}</p>
                    <p className="text-gray-400 text-sm">{t.categoria}</p>
                  </div>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${t.abierto ? 'bg-emerald-500/20 text-emerald-400' : 'bg-neutral-700 text-gray-500'}`}>
                    {t.abierto ? 'Abierto' : 'Cerrado'}
                  </span>
                </div>
                <div className="flex gap-3">
                  <Link
                    to={`/admin/tiendas/editar/${t.id}`}
                    className="flex-1 text-center text-gray-400 hover:text-white border border-neutral-700 hover:border-neutral-500 px-4 py-2 rounded-xl text-sm transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                  >
                    Editar
                  </Link>
                  <button
                    onClick={() => handleEliminar(t.id)}
                    className="flex-1 text-red-400 hover:text-white hover:bg-red-500 border border-red-500/40 hover:border-red-500 px-4 py-2 rounded-xl text-sm transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
            {tiendas.length === 0 && (
              <div className="text-center py-16 text-gray-500">
                No hay tiendas. <Link to="/admin/tiendas/nueva" className="text-emerald-400 hover:underline">Agrega una.</Link>
              </div>
            )}
          </div>

          {/* Desktop table */}
          <div className="hidden md:block bg-neutral-900 border-2 border-neutral-800 rounded-2xl overflow-hidden animate-fade-in-up" style={{ animationDelay: '0.07s' }}>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-800 text-gray-400 text-left">
                  <th className="px-6 py-4 font-medium">Tienda</th>
                  <th className="px-6 py-4 font-medium">Categoría</th>
                  <th className="px-6 py-4 font-medium">Estado</th>
                  <th className="px-6 py-4 font-medium text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {tiendas.map((t) => (
                  <tr key={t.id} className="border-b border-neutral-800 last:border-0 hover:bg-neutral-800/40 transition-colors">
                    <td className="px-6 py-4 text-white font-medium">{t.nombre}</td>
                    <td className="px-6 py-4 text-gray-400">{t.categoria}</td>
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
        </>
      )}
    </div>
  );
}
