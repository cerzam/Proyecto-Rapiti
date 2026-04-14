import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const CATEGORIAS = ['Todas', 'Abarrotes', 'Farmacia', 'Papelería', 'Ferretería', 'Verdulería', 'Carnicería', 'Tortillería', 'Dulcería'];

export default function Tiendas() {
  const [tiendas, setTiendas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [categoriaActiva, setCategoriaActiva] = useState('Todas');

  useEffect(() => {
    const fetchTiendas = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/tiendas`);
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

  const filtradas = categoriaActiva === 'Todas'
    ? tiendas
    : tiendas.filter(t => t.categoria === categoriaActiva);

  return (
    <div className="min-h-[calc(100vh-112px)] px-6 py-12 max-w-5xl mx-auto">

      <div className="mb-10 animate-fade-in-up">
        <h1 className="text-4xl font-bold text-white mb-2">
          Directorio de <span className="text-emerald-400">Tiendas</span>
        </h1>
        <p className="text-gray-400 text-sm">{filtradas.length} tiendas encontradas</p>
      </div>

      {loading && <div className="text-center py-16 text-gray-400">Cargando tiendas...</div>}

      {error && (
        <div role="alert" className="bg-red-900/30 border border-red-500 text-red-400 p-4 rounded-xl text-sm mb-6">
          {error}
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="flex flex-wrap gap-2 mb-8 animate-fade-in-up" style={{ animationDelay: '0.05s' }}>
            {CATEGORIAS.map(cat => (
              <button
                key={cat}
                onClick={() => setCategoriaActiva(cat)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500
                  ${categoriaActiva === cat
                    ? 'bg-emerald-500 border-emerald-500 text-white'
                    : 'border-neutral-700 text-gray-400 hover:border-neutral-500 hover:text-white'}`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtradas.map((tienda, i) => (
              <Link
                key={tienda.id}
                to={`/tiendas/${tienda.id}`}
                className="bg-neutral-900 border-2 border-neutral-800 rounded-2xl p-6 hover:border-emerald-500/50 hover:-translate-y-1 hover:shadow-[0_4px_24px_rgba(16,185,129,0.12)] transition-all duration-300 animate-fade-in-up focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-500"
                style={{ animationDelay: `${i * 0.07}s` }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h2 className="text-white font-bold text-lg">{tienda.nombre}</h2>
                    <span className="text-xs text-emerald-400 font-medium">{tienda.categoria}</span>
                  </div>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${tienda.abierto ? 'bg-emerald-500/20 text-emerald-400' : 'bg-neutral-700 text-gray-500'}`}>
                    {tienda.abierto ? 'Abierto' : 'Cerrado'}
                  </span>
                </div>
                <p className="text-gray-400 text-sm mb-1">📍 {tienda.direccion}</p>
                <p className="text-gray-500 text-sm">🕐 {tienda.horario}</p>
              </Link>
            ))}

            {filtradas.length === 0 && (
              <p className="text-gray-500 col-span-2 text-center py-12">No hay tiendas en esta categoría.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
