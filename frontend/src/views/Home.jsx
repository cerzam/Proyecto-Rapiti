import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const categorias = [
  { nombre: 'Frutas', emoji: '🍎' },
  { nombre: 'Carnes', emoji: '🥩' },
  { nombre: 'Farmacia', emoji: '💊' },
  { nombre: 'Limpieza', emoji: '🧴' },
];

const tiendas = [
  { nombre: 'Abarrotes Don José', distancia: '0.3 km' },
  { nombre: 'Oxxo Centro', distancia: '0.5 km' },
  { nombre: 'Walmart Angelópolis', distancia: '1.2 km' },
];

const Home = () => {
  const [busqueda, setBusqueda] = useState('');
  const navigate = useNavigate();

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
        <h1 className="text-5xl font-bold text-white leading-tight mb-4">
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
            className="flex-1 bg-neutral-900 border-2 border-neutral-700 text-white px-5 py-3 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500 focus:border-emerald-500 placeholder:text-gray-600 transition-all"
          />
          <button
            type="submit"
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-6 py-3 rounded-2xl transition-all focus:ring-4 focus:ring-emerald-500 outline-none"
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
        <h2 id="tiendas-titulo" className="text-xl font-bold text-white mb-6">
          Tiendas cerca de ti
        </h2>
        <div className="bg-neutral-900 border-2 border-neutral-800 rounded-2xl p-6">
          {/* Mapa placeholder */}
          <div className="w-full h-48 bg-neutral-800 rounded-xl mb-6 flex items-center justify-center relative overflow-hidden">
            <span className="text-gray-600 text-sm">Mapa próximamente</span>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
              <button className="bg-neutral-900 border border-emerald-500 text-emerald-400 text-sm px-4 py-2 rounded-full hover:bg-emerald-500 hover:text-white transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500">
                🗺️ EXPLORAR MAPA
              </button>
            </div>
          </div>

          {/* Lista de tiendas */}
          <ul className="space-y-3">
            {tiendas.map((tienda) => (
              <li
                key={tienda.nombre}
                className="flex items-center justify-between text-sm text-gray-400 border-b border-neutral-800 pb-3 last:border-0 last:pb-0"
              >
                <span className="text-white font-medium">{tienda.nombre}</span>
                <span className="text-emerald-400">{tienda.distancia}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

    </div>
  );
};

export default Home;
