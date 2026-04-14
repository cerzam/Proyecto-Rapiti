import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';

const CATEGORIAS = ['Abarrotes', 'Farmacia', 'Papelería', 'Ferretería', 'Verdulería', 'Carnicería', 'Tortillería', 'Dulcería', 'Otro'];

export default function TiendaForm() {
  const { id } = useParams();
  const esEdicion = !!id;
  const navigate = useNavigate();

  const [nombre, setNombre] = useState('');
  const [categoria, setCategoria] = useState('');
  const [direccion, setDireccion] = useState('');
  const [horario, setHorario] = useState('');
  const [abierto, setAbierto] = useState(true);
  const [productos, setProductos] = useState([]);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');
  const [loading, setLoading] = useState(esEdicion);

  useEffect(() => {
    if (!esEdicion) return;
    const fetchTienda = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${import.meta.env.VITE_API_URL}/tiendas/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) { navigate('/admin/tiendas'); return; }
        const data = await res.json();
        const t = data.data;
        setNombre(t.nombre);
        setCategoria(t.categoria);
        setDireccion(t.direccion);
        setHorario(t.horario || '');
        setAbierto(!!t.abierto);
        setProductos(t.productos || []);
      } catch {
        navigate('/admin/tiendas');
      } finally {
        setLoading(false);
      }
    };
    fetchTienda();
  }, [id, esEdicion, navigate]);

  const agregarProducto = () => {
    setProductos(prev => [...prev, { id: Date.now(), nombre: '', precio: '' }]);
  };

  const actualizarProducto = (pid, campo, valor) => {
    setProductos(prev => prev.map(p => p.id === pid ? { ...p, [campo]: valor } : p));
  };

  const eliminarProducto = (pid) => {
    setProductos(prev => prev.filter(p => p.id !== pid));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!nombre.trim()) newErrors.nombre = 'El nombre es obligatorio.';
    if (!categoria) newErrors.categoria = 'Selecciona una categoría.';
    if (!direccion.trim()) newErrors.direccion = 'La dirección es obligatoria.';

    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }

    setStatus('loading');

    try {
      const token = localStorage.getItem('token');
      const url = esEdicion
        ? `${import.meta.env.VITE_API_URL}/tiendas/${id}`
        : `${import.meta.env.VITE_API_URL}/tiendas`;

      const res = await fetch(url, {
        method: esEdicion ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          nombre, categoria, direccion, horario, abierto,
          productos: productos.filter(p => p.nombre.trim() && p.precio).map(p => ({ nombre: p.nombre, precio: parseFloat(p.precio) })),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setStatus('success');
      setTimeout(() => navigate('/admin/tiendas'), 1000);
    } catch (err) {
      setStatus('error');
      setErrors({ ...errors, nombre: err.message || 'Error al guardar.' });
    }
  };

  if (loading) {
    return <div className="min-h-[calc(100vh-112px)] flex items-center justify-center text-gray-400">Cargando...</div>;
  }

  return (
    <div className="min-h-[calc(100vh-112px)] px-6 py-12 max-w-3xl mx-auto">
      <div className="bg-neutral-900 border-2 border-neutral-800 rounded-2xl p-8 animate-scale-in">

        <h1 className="text-3xl font-bold text-white mb-8">
          {esEdicion ? 'Editar' : 'Nueva'} <span className="text-emerald-400">tienda</span>
        </h1>

        {status === 'success' && (
          <div role="alert" className="bg-emerald-900/30 border border-emerald-500 text-emerald-400 p-4 rounded-xl text-sm mb-6">
            ✅ Tienda {esEdicion ? 'actualizada' : 'creada'}. Redirigiendo...
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>

          <div>
            <label htmlFor="nombre" className="block text-sm font-medium text-gray-400 mb-2">Nombre de la tienda</label>
            <input
              id="nombre" type="text" value={nombre}
              onChange={e => setNombre(e.target.value)}
              disabled={status === 'loading'}
              placeholder="Ej. Abarrotes Don José"
              className={`w-full bg-neutral-900 border-2 text-white px-4 py-3 rounded-2xl outline-none transition-all placeholder:text-gray-600 focus:ring-4 focus:ring-emerald-500 ${errors.nombre ? 'border-red-500' : 'border-neutral-700'}`}
            />
            {errors.nombre && <p className="mt-2 text-sm text-red-400">{errors.nombre}</p>}
          </div>

          <div>
            <label htmlFor="categoria" className="block text-sm font-medium text-gray-400 mb-2">Categoría</label>
            <select
              id="categoria" value={categoria}
              onChange={e => setCategoria(e.target.value)}
              disabled={status === 'loading'}
              className={`w-full bg-neutral-900 border-2 text-white px-4 py-3 rounded-2xl outline-none transition-all focus:ring-4 focus:ring-emerald-500 ${errors.categoria ? 'border-red-500' : 'border-neutral-700'}`}
            >
              <option value="">Selecciona una categoría</option>
              {CATEGORIAS.map(c => <option key={c}>{c}</option>)}
            </select>
            {errors.categoria && <p className="mt-2 text-sm text-red-400">{errors.categoria}</p>}
          </div>

          <div>
            <label htmlFor="direccion" className="block text-sm font-medium text-gray-400 mb-2">Dirección</label>
            <input
              id="direccion" type="text" value={direccion}
              onChange={e => setDireccion(e.target.value)}
              disabled={status === 'loading'}
              placeholder="Ej. Calle 5 de Mayo #123, Centro"
              className={`w-full bg-neutral-900 border-2 text-white px-4 py-3 rounded-2xl outline-none transition-all placeholder:text-gray-600 focus:ring-4 focus:ring-emerald-500 ${errors.direccion ? 'border-red-500' : 'border-neutral-700'}`}
            />
            {errors.direccion && <p className="mt-2 text-sm text-red-400">{errors.direccion}</p>}
          </div>

          <div>
            <label htmlFor="horario" className="block text-sm font-medium text-gray-400 mb-2">Horario</label>
            <input
              id="horario" type="text" value={horario}
              onChange={e => setHorario(e.target.value)}
              disabled={status === 'loading'}
              placeholder="Ej. Lun-Sab 8:00-20:00"
              className="w-full bg-neutral-900 border-2 border-neutral-700 text-white px-4 py-3 rounded-2xl outline-none transition-all placeholder:text-gray-600 focus:ring-4 focus:ring-emerald-500"
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              id="abierto" type="checkbox" checked={abierto}
              onChange={e => setAbierto(e.target.checked)}
              className="w-5 h-5 accent-emerald-500"
            />
            <label htmlFor="abierto" className="text-gray-400 text-sm">Abierto actualmente</label>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="block text-sm font-medium text-gray-400">Productos de la tienda</span>
              <button
                type="button"
                onClick={agregarProducto}
                className="text-emerald-400 hover:text-emerald-300 text-sm border border-emerald-500/40 hover:border-emerald-500 px-3 py-1 rounded-xl transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              >
                + Agregar producto
              </button>
            </div>

            {productos.length === 0 && (
              <p className="text-gray-600 text-sm">No hay productos. Agrega uno con el botón de arriba.</p>
            )}

            <div className="space-y-3">
              {productos.map(p => (
                <div key={p.id} className="flex gap-3 items-center">
                  <input
                    type="text" value={p.nombre} placeholder="Nombre del producto"
                    onChange={e => actualizarProducto(p.id, 'nombre', e.target.value)}
                    className="flex-1 bg-neutral-900 border-2 border-neutral-700 text-white px-3 py-2 rounded-xl outline-none text-sm focus:ring-2 focus:ring-emerald-500 placeholder:text-gray-600"
                  />
                  <input
                    type="number" value={p.precio} placeholder="Precio"
                    onChange={e => actualizarProducto(p.id, 'precio', e.target.value)}
                    className="w-28 bg-neutral-900 border-2 border-neutral-700 text-white px-3 py-2 rounded-xl outline-none text-sm focus:ring-2 focus:ring-emerald-500 placeholder:text-gray-600"
                  />
                  <button
                    type="button"
                    onClick={() => eliminarProducto(p.id)}
                    className="text-red-400 hover:text-white hover:bg-red-500 border border-red-500/40 hover:border-red-500 px-3 py-2 rounded-xl transition-all text-sm focus:outline-none"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-4 pt-2">
            <button
              type="submit"
              disabled={status === 'loading'}
              aria-busy={status === 'loading'}
              className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 rounded-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center focus:ring-4 focus:ring-emerald-500 outline-none"
            >
              {status === 'loading'
                ? <><div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>Guardando...</>
                : esEdicion ? 'Guardar cambios' : 'Crear tienda'}
            </button>
            <Link
              to="/admin/tiendas"
              className="px-6 py-3 border-2 border-neutral-700 text-gray-400 hover:border-neutral-500 hover:text-white rounded-2xl transition-all text-center focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-500"
            >
              Cancelar
            </Link>
          </div>

        </form>
      </div>
    </div>
  );
}
