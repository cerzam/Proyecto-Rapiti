import { Link } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

export default function AdminPanel() {
  const { rol } = useAuth();

  return (
    <div className="min-h-[calc(100vh-112px)] px-6 py-12 max-w-4xl mx-auto">

      <div className="animate-fade-in-up">
        <h1 className="text-4xl font-bold text-white mb-2">
          Panel de <span className="text-emerald-400">Administración</span>
        </h1>
        <p className="text-gray-400 mb-10">Gestiona los recursos del sistema.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

        <Link
          to="/admin/productos"
          className="bg-neutral-900 border-2 border-neutral-800 hover:border-emerald-500/50 rounded-2xl p-8 transition-all hover:-translate-y-1 focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-500 animate-fade-in-up"
          style={{ animationDelay: '0.07s' }}
        >
          <div className="text-4xl mb-4">📦</div>
          <h2 className="text-white text-xl font-bold mb-1">Productos</h2>
          <p className="text-gray-400 text-sm">Agregar, editar y eliminar productos del catálogo.</p>
        </Link>

        <Link
          to="/blog"
          className="bg-neutral-900 border-2 border-neutral-800 hover:border-emerald-500/50 rounded-2xl p-8 transition-all hover:-translate-y-1 focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-500 animate-fade-in-up"
          style={{ animationDelay: '0.14s' }}
        >
          <div className="text-4xl mb-4">📝</div>
          <h2 className="text-white text-xl font-bold mb-1">Blog</h2>
          <p className="text-gray-400 text-sm">Ver y gestionar publicaciones del blog comunitario.</p>
        </Link>

        {rol === 'admin' && (
          <Link
            to="/admin/tiendas"
            className="bg-neutral-900 border-2 border-neutral-800 hover:border-emerald-500/50 rounded-2xl p-8 transition-all hover:-translate-y-1 focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-500 animate-fade-in-up"
            style={{ animationDelay: '0.21s' }}
          >
            <div className="text-4xl mb-4">🏪</div>
            <h2 className="text-white text-xl font-bold mb-1">Tiendas</h2>
            <p className="text-gray-400 text-sm">Agregar, editar y eliminar tiendas del directorio.</p>
          </Link>
        )}

      </div>
    </div>
  );
}
