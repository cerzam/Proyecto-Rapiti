import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/useAuth';

export default function Blog() {
  const { isAuth } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/blog`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setPosts(data.data);
      } catch {
        setError('No se pudieron cargar las publicaciones.');
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Eliminar esta publicación?')) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/blog/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      setPosts(prev => prev.filter(p => p.id !== id));
    } catch {
      alert('No se pudo eliminar la publicación.');
    }
  };

  return (
    <div className="min-h-[calc(100vh-112px)] px-6 py-12 max-w-3xl mx-auto">

      {/* ENCABEZADO */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-10 animate-fade-in-up">
        <h1 className="text-3xl sm:text-4xl font-bold text-white">
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

      {/* ESTADOS */}
      {loading && (
        <div className="text-center py-16 text-gray-400">Cargando publicaciones...</div>
      )}

      {error && (
        <div role="alert" className="bg-red-900/30 border border-red-500 text-red-400 p-4 rounded-xl text-sm mb-6">
          {error}
        </div>
      )}

      {/* LISTA */}
      {!loading && !error && (
        <ul className="space-y-6" aria-label="Publicaciones del blog">
          {posts.length === 0 && (
            <li className="text-center py-16 text-gray-500">
              No hay publicaciones aún.{' '}
              {isAuth && <Link to="/blog/crear" className="text-emerald-400 hover:underline">Sé el primero.</Link>}
            </li>
          )}
          {posts.map((post, i) => (
            <li
              key={post.id}
              className="bg-neutral-900 border-2 border-neutral-800 hover:border-emerald-500/40 rounded-2xl p-6 transition-all hover:-translate-y-1 animate-fade-in-up"
              style={{ animationDelay: `${i * 0.07}s` }}
            >
              <h2 className="text-white text-xl font-bold mb-2">{post.title}</h2>
              <p className="text-gray-400 text-sm mb-4 line-clamp-2">{post.content}</p>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>✍️ {post.autor}</span>
                <span>{new Date(post.created_at).toLocaleDateString('es-MX')}</span>
              </div>

              {isAuth && (
                <div className="flex gap-3 mt-4 pt-4 border-t border-neutral-800">
                  <Link
                    to={`/blog/editar/${post.id}`}
                    className="text-sm text-gray-400 hover:text-white border border-neutral-700 hover:border-neutral-500 px-4 py-2 rounded-xl transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                  >
                    Editar
                  </Link>
                  <button
                    onClick={() => handleEliminar(post.id)}
                    className="text-sm text-red-400 hover:text-white hover:bg-red-500 border border-red-500/40 hover:border-red-500 px-4 py-2 rounded-xl transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                  >
                    Eliminar
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

    </div>
  );
}
