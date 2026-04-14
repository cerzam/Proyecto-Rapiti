import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

function Estrellas({ rating }) {
  return (
    <div className="flex items-center gap-1" aria-label={`Rating: ${rating} de 5`}>
      {[1, 2, 3, 4, 5].map(n => (
        <span key={n} className={n <= Math.round(rating) ? 'text-emerald-400' : 'text-neutral-600'}>★</span>
      ))}
    </div>
  );
}

export default function TiendaDetalle() {
  const { id } = useParams();
  const [tienda, setTienda] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchTienda = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/tiendas/${id}`);
        if (res.status === 404) { setNotFound(true); return; }
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setTienda(data.data);
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    fetchTienda();
  }, [id]);

  if (loading) {
    return <div className="min-h-[calc(100vh-112px)] flex items-center justify-center text-gray-400">Cargando...</div>;
  }

  if (notFound) {
    return (
      <div className="min-h-[calc(100vh-112px)] flex flex-col items-center justify-center text-center px-6">
        <p className="text-gray-400 text-lg mb-4">Tienda no encontrada.</p>
        <Link to="/tiendas" className="text-emerald-400 hover:underline">Ver directorio</Link>
      </div>
    );
  }

  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${tienda.lng - 0.01},${tienda.lat - 0.01},${tienda.lng + 0.01},${tienda.lat + 0.01}&layer=mapnik&marker=${tienda.lat},${tienda.lng}`;

  return (
    <div className="min-h-[calc(100vh-112px)] px-6 py-12 max-w-5xl mx-auto">

      <Link to="/tiendas" className="text-gray-400 hover:text-white text-sm mb-8 inline-block transition-colors">
        ← Volver al directorio
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-neutral-900 border-2 border-neutral-800 rounded-2xl p-8 animate-scale-in">
            <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">{tienda.nombre}</h1>
                <span className="text-emerald-400 text-sm font-medium">{tienda.categoria}</span>
              </div>
              <span className={`shrink-0 text-sm font-semibold px-4 py-2 rounded-full ${tienda.abierto ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-neutral-700 text-gray-500 border border-neutral-600'}`}>
                {tienda.abierto ? '✓ Abierto ahora' : 'Cerrado'}
              </span>
            </div>

            <Estrellas rating={4.5} />

            <div className="mt-6 space-y-4">
              <div>
                <p className="text-emerald-400 font-semibold text-sm mb-1">📍 Dirección:</p>
                <p className="text-gray-300">{tienda.direccion}</p>
              </div>
              <div>
                <p className="text-emerald-400 font-semibold text-sm mb-1">🕐 Horarios:</p>
                <p className="text-gray-300">{tienda.horario}</p>
              </div>
            </div>
          </div>

          {tienda.productos && tienda.productos.length > 0 && (
            <div className="bg-neutral-900 border-2 border-neutral-800 rounded-2xl p-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <h2 className="text-xl font-bold text-white mb-6">Productos registrados</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {tienda.productos.map((p, i) => (
                  <div
                    key={p.id}
                    className="bg-neutral-800 border border-neutral-700 rounded-xl p-4 text-center animate-fade-in-up"
                    style={{ animationDelay: `${0.1 + i * 0.06}s` }}
                  >
                    <p className="text-white text-sm font-medium mb-2">{p.nombre}</p>
                    <p className="text-emerald-400 font-bold">${parseFloat(p.precio).toFixed(2)} MXN</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4 animate-fade-in-up" style={{ animationDelay: '0.07s' }}>
          <div className="bg-neutral-900 border-2 border-neutral-800 rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-neutral-800">
              <h2 className="text-white font-bold">Ubicación</h2>
            </div>
            {tienda.lat && tienda.lng ? (
              <iframe
                title={`Mapa de ${tienda.nombre}`}
                src={mapUrl}
                className="w-full h-64"
                loading="lazy"
              />
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-600 text-sm">Sin ubicación registrada</div>
            )}
            <div className="p-4">
              <a
                href={`https://www.openstreetmap.org/?mlat=${tienda.lat}&mlon=${tienda.lng}#map=16/${tienda.lat}/${tienda.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 border-2 border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10 py-2 rounded-xl transition-all text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              >
                🗺️ Ver en mapa completo
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
