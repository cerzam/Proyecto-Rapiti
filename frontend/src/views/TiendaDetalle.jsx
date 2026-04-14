import { useParams, Link } from 'react-router-dom';

const TIENDAS_MOCK = [
  {
    id: 1,
    nombre: 'Abarrotes Don José',
    categoria: 'Abarrotes',
    direccion: 'Calle 5 de Mayo #123, Centro, Tehuacán, Puebla',
    horario: 'Lunes - Sábado: 8:00 AM - 8:00 PM\nDomingo: 9:00 AM - 2:00 PM',
    abierto: true,
    rating: 4.5,
    productos: [
      { id: 1, nombre: 'Leche Lala 1L', precio: 28.50 },
      { id: 2, nombre: 'Pan Bimbo Grande', precio: 45.00 },
      { id: 3, nombre: 'Arroz Verde Valle 1kg', precio: 29.50 },
      { id: 4, nombre: 'Frijoles La Costeña 560g', precio: 22.00 },
      { id: 5, nombre: 'Aceite 123 1L', precio: 38.00 },
      { id: 6, nombre: 'Huevo San Juan 12pz', precio: 52.90 },
    ],
    lat: 18.4653,
    lng: -97.3925,
  },
  {
    id: 2,
    nombre: 'Farmacia San Rafael',
    categoria: 'Farmacia',
    direccion: 'Av. Independencia #456, Tehuacán, Puebla',
    horario: 'Lunes - Domingo: 7:00 AM - 10:00 PM',
    abierto: true,
    rating: 4.2,
    productos: [
      { id: 1, nombre: 'Paracetamol 500mg', precio: 25.00 },
      { id: 2, nombre: 'Ibuprofeno 400mg', precio: 30.00 },
    ],
    lat: 18.4660,
    lng: -97.3930,
  },
  {
    id: 3, nombre: 'Papelería El Estudiante', categoria: 'Papelería',
    direccion: 'Blvd. Las Torres #78, Tehuacán, Puebla',
    horario: 'Lunes - Viernes: 9:00 AM - 6:00 PM', abierto: false, rating: 3.8,
    productos: [], lat: 18.4640, lng: -97.3910,
  },
  {
    id: 4, nombre: 'Mini Super La Esquina', categoria: 'Abarrotes',
    direccion: 'Calle Morelos #34, Tehuacán, Puebla',
    horario: 'Lunes - Domingo: 6:00 AM - 11:00 PM', abierto: true, rating: 4.0,
    productos: [{ id: 1, nombre: 'Coca Cola 600ml', precio: 18.00 }],
    lat: 18.4670, lng: -97.3940,
  },
  {
    id: 5, nombre: 'Ferretería El Tornillo', categoria: 'Ferretería',
    direccion: 'Av. Reforma #210, Tehuacán, Puebla',
    horario: 'Lunes - Sábado: 8:00 AM - 6:00 PM', abierto: false, rating: 4.1,
    productos: [], lat: 18.4650, lng: -97.3950,
  },
  {
    id: 6, nombre: 'Verduras y Frutas Lupita', categoria: 'Verdulería',
    direccion: 'Mercado Municipal Local 12, Tehuacán, Puebla',
    horario: 'Lunes - Domingo: 6:00 AM - 3:00 PM', abierto: true, rating: 4.7,
    productos: [{ id: 1, nombre: 'Jitomate por kg', precio: 18.00 }, { id: 2, nombre: 'Aguacate pz', precio: 12.00 }],
    lat: 18.4655, lng: -97.3920,
  },
];

function Estrellas({ rating }) {
  return (
    <div className="flex items-center gap-1" aria-label={`Rating: ${rating} de 5`}>
      {[1, 2, 3, 4, 5].map(n => (
        <span key={n} className={n <= Math.round(rating) ? 'text-emerald-400' : 'text-neutral-600'}>★</span>
      ))}
      <span className="text-gray-400 text-sm ml-1">({rating})</span>
    </div>
  );
}

export default function TiendaDetalle() {
  const { id } = useParams();
  const tienda = TIENDAS_MOCK.find(t => t.id === parseInt(id));

  if (!tienda) {
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

        {/* Info principal */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-neutral-900 border-2 border-neutral-800 rounded-2xl p-8 animate-scale-in">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-white mb-1">{tienda.nombre}</h1>
                <span className="text-emerald-400 text-sm font-medium">{tienda.categoria}</span>
              </div>
              <span className={`text-sm font-semibold px-4 py-2 rounded-full ${tienda.abierto ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-neutral-700 text-gray-500 border border-neutral-600'}`}>
                {tienda.abierto ? '✓ Abierto ahora' : 'Cerrado'}
              </span>
            </div>

            <Estrellas rating={tienda.rating} />

            <div className="mt-6 space-y-4">
              <div>
                <p className="text-emerald-400 font-semibold text-sm mb-1">📍 Dirección:</p>
                <p className="text-gray-300">{tienda.direccion}</p>
              </div>
              <div>
                <p className="text-emerald-400 font-semibold text-sm mb-1">🕐 Horarios:</p>
                {tienda.horario.split('\n').map((h, i) => (
                  <p key={i} className="text-gray-300">{h}</p>
                ))}
              </div>
            </div>
          </div>

          {/* Productos */}
          {tienda.productos.length > 0 && (
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

        {/* Mapa */}
        <div className="space-y-4 animate-fade-in-up" style={{ animationDelay: '0.07s' }}>
          <div className="bg-neutral-900 border-2 border-neutral-800 rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-neutral-800">
              <h2 className="text-white font-bold">Ubicación</h2>
            </div>
            <iframe
              title={`Mapa de ${tienda.nombre}`}
              src={mapUrl}
              className="w-full h-64"
              loading="lazy"
            />
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
