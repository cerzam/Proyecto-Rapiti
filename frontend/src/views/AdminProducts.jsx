import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function AdminProducts() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${import.meta.env.VITE_API_URL}/productos`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setProductos(data.data);
      } catch {
        setError('No se pudieron cargar los productos.');
      } finally {
        setLoading(false);
      }
    };
    fetchProductos();
  }, []);

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Eliminar este producto?')) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/productos/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      setProductos(prev => prev.filter(p => p.id !== id));
    } catch {
      alert('No se pudo eliminar el producto.');
    }
  };

  return (
    <div className="min-h-[calc(100vh-112px)] px-6 py-12 max-w-5xl mx-auto">

      <div className="flex items-center justify-between mb-10 animate-fade-in-up">
        <div>
          <h1 className="text-4xl font-bold text-white mb-1">
            Gestión de <span className="text-emerald-400">Productos</span>
          </h1>
          <p className="text-gray-400 text-sm">{productos.length} productos en el catálogo</p>
        </div>
        <Link
          to="/admin/productos/nuevo"
          className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-5 py-3 rounded-2xl transition-all focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-500"
        >
          + Nuevo producto
        </Link>
      </div>

      {loading && <div className="text-center py-16 text-gray-400">Cargando productos...</div>}

      {error && (
        <div role="alert" className="bg-red-900/30 border border-red-500 text-red-400 p-4 rounded-xl text-sm mb-6">
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className="bg-neutral-900 border-2 border-neutral-800 rounded-2xl overflow-hidden animate-fade-in-up" style={{ animationDelay: '0.07s' }}>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-800 text-gray-400 text-left">
                <th className="px-6 py-4 font-medium">Producto</th>
                <th className="px-6 py-4 font-medium">Precio</th>
                <th className="px-6 py-4 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((p) => (
                <tr key={p.id} className="border-b border-neutral-800 last:border-0 hover:bg-neutral-800/40 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      {p.image_url && (
                        <img src={p.image_url} alt={p.name} className="w-12 h-12 object-contain rounded-xl bg-neutral-800" />
                      )}
                      <span className="text-white font-medium">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-emerald-400 font-semibold">
                    ${parseFloat(p.price).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        to={`/admin/productos/editar/${p.id}`}
                        className="text-gray-400 hover:text-white border border-neutral-700 hover:border-neutral-500 px-4 py-2 rounded-xl transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                      >
                        Editar
                      </Link>
                      <button
                        onClick={() => handleEliminar(p.id)}
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

          {productos.length === 0 && (
            <div className="text-center py-16 text-gray-500">
              No hay productos. <Link to="/admin/productos/nuevo" className="text-emerald-400 hover:underline">Agrega uno.</Link>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
