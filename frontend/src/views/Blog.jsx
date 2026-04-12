import { Link } from 'react-router-dom';

const postsMock = [
  {
    id: 1,
    titulo: 'Mejores precios en Oxxo esta semana',
    contenido: 'Encontré que el Oxxo del centro tiene la leche Lala al precio más bajo de la zona, 27.50 pesos el litro...',
    autor: 'Juan Pérez',
    fecha: '2026-04-10',
  },
  {
    id: 2,
    titulo: 'Ofertas de temporada en Chedraui',
    contenido: 'Esta semana Chedraui tiene descuentos en frutas y verduras. El kilogramo de jitomate a 18 pesos...',
    autor: 'María López',
    fecha: '2026-04-09',
  },
  {
    id: 3,
    titulo: 'Comparativa: Walmart vs Bodega Aurrera',
    contenido: 'Hice un recorrido por ambas tiendas comparando los precios de la canasta básica. Los resultados...',
    autor: 'Carlos Ruiz',
    fecha: '2026-04-07',
  },
];

export default function Blog({ isAuth }) {
  return (
    <div className="min-h-[calc(100vh-112px)] px-6 py-12 max-w-3xl mx-auto">

      {/* ENCABEZADO */}
      <div className="flex items-center justify-between mb-10 animate-fade-in-up">
        <h1 className="text-4xl font-bold text-white">
          <span className="text-emerald-400">Blog</span> comunitario
        </h1>

        {isAuth ? (
          <Link
            to="/blog/crear"
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-5 py-3 rounded-2xl transition-all focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-500"
          >
            + Nueva publicación
          </Link>
        ) : (
          <Link
            to="/login"
            className="border-2 border-emerald-500 text-emerald-400 hover:bg-emerald-500 hover:text-white font-semibold px-5 py-3 rounded-2xl transition-all focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-500"
          >
            Inicia sesión para publicar
          </Link>
        )}
      </div>

      {/* LISTA DE POSTS */}
      <ul className="space-y-6" aria-label="Publicaciones del blog">
        {postsMock.map((post, i) => (
          <li
            key={post.id}
            className="bg-neutral-900 border-2 border-neutral-800 hover:border-emerald-500/40 rounded-2xl p-6 transition-all hover:-translate-y-1 animate-fade-in-up"
            style={{ animationDelay: `${i * 0.07}s` }}
          >
            <h2 className="text-white text-xl font-bold mb-2">{post.titulo}</h2>
            <p className="text-gray-400 text-sm mb-4 line-clamp-2">{post.contenido}</p>
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>✍️ {post.autor}</span>
              <span>{post.fecha}</span>
            </div>
          </li>
        ))}
      </ul>

    </div>
  );
}
