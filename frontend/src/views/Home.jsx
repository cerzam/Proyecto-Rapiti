import { useNavigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

const categorias = [
  { nombre: 'Frutas', emoji: '🍎' },
  { nombre: 'Carnes', emoji: '🥩' },
  { nombre: 'Farmacia', emoji: '💊' },
  { nombre: 'Limpieza', emoji: '🧴' },
];

const Home = () => {
  const [busqueda, setBusqueda] = useState('');
  const [tiendas, setTiendas] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/tiendas`)
      .then(r => r.json())
      .then(data => setTiendas((data.data || []).filter(t => t.abierto).slice(0, 4)))
      .catch(() => {});
  }, []);

  const handleBuscar = (e) => {
    e.preventDefault();
    if (busqueda.trim()) {
      navigate(`/buscador?q=${encodeURIComponent(busqueda.trim())}`);
    }
  };

  return (
    <div className="min-h-[calc(100vh-112px)] px-6 py-12 max-w-5xl mx-auto">

      {/* HERO */}
      <section className="text-center mb-14 animate-fade-in-up">
        <h1 className="text-3xl sm:text-5xl font-bold text-white leading-tight mb-4">
          Ahorra en tu <span className="text-emerald-400">canasta básica</span>
        </h1>
        <p className="text-gray-400 text-lg mb-8">
          Compara precios de tienditas locales y supermercados cerca de ti.
        </p>

        <form onSubmit={handleBuscar} className="flex gap-3 max-w-xl mx-auto">
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="¿Qué necesitas hoy? (ej. Huevo, Leche...)"
            aria-label="Buscar productos"
            className="flex-1 min-w-0 bg-neutral-900 border-2 border-neutral-700 text-white px-5 py-3 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500 focus:border-emerald-500 placeholder:text-gray-600 transition-all"
          />
          <button
            type="submit"
            className="shrink-0 bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-6 py-3 rounded-2xl transition-all focus:ring-4 focus:ring-emerald-500 outline-none"
          >
            BUSCAR
          </button>
        </form>
      </section>

      {/* CATEGORÍAS */}
      <section className="mb-14" aria-labelledby="categorias-titulo">
        <h2 id="categorias-titulo" className="text-xl font-bold text-white mb-6">
          Categorías Populares
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {categorias.map((cat, i) => (
            <button
              key={cat.nombre}
              onClick={() => navigate(`/buscador?q=${cat.nombre}`)}
              className="bg-neutral-900 border-2 border-neutral-800 hover:border-emerald-500/50 rounded-2xl p-6 flex flex-col items-center gap-3 transition-all hover:-translate-y-1 focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-500 animate-fade-in-up"
              style={{ animationDelay: `${i * 0.07}s` }}
            >
              <span className="text-4xl" role="img" aria-label={cat.nombre}>{cat.emoji}</span>
              <span className="text-white font-semibold">{cat.nombre}</span>
            </button>
          ))}
        </div>
      </section>

      {/* TIENDAS CERCANAS */}
      <section aria-labelledby="tiendas-titulo">
        <div className="flex items-center justify-between mb-6">
          <h2 id="tiendas-titulo" className="text-xl font-bold text-white">
            Tiendas cerca de ti
          </h2>
          <Link to="/tiendas" className="text-emerald-400 hover:underline text-sm">
            Ver todas →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {tiendas.map((tienda, i) => (
            <Link
              key={tienda.id}
              to={`/tiendas/${tienda.id}`}
              className="bg-neutral-900 border-2 border-neutral-800 rounded-2xl p-5 flex items-center justify-between hover:border-emerald-500/50 hover:-translate-y-1 transition-all duration-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-500 animate-fade-in-up"
              style={{ animationDelay: `${i * 0.07}s` }}
            >
              <div>
                <p className="text-white font-semibold">{tienda.nombre}</p>
                <p className="text-emerald-400 text-xs mt-1">{tienda.categoria}</p>
              </div>
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${tienda.abierto ? 'bg-emerald-500/20 text-emerald-400' : 'bg-neutral-700 text-gray-500'}`}>
                {tienda.abierto ? 'Abierto' : 'Cerrado'}
              </span>
            </Link>
          ))}
        </div>
      </section>

    </div>
  );
};

export default Home;
