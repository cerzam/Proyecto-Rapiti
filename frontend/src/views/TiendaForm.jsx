import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';

const TIENDAS_MOCK = [
  { id: 1, nombre: 'Abarrotes Don José', categoria: 'Abarrotes', direccion: 'Calle 5 de Mayo #123, Centro', horario: 'Lun-Sáb 8:00–20:00', abierto: true,
    productos: [{ id: 1, nombre: 'Leche Lala 1L', precio: '28.50' }, { id: 2, nombre: 'Pan Bimbo Grande', precio: '45.00' }] },
  { id: 2, nombre: 'Farmacia San Rafael', categoria: 'Farmacia', direccion: 'Av. Independencia #456', horario: 'Lun-Dom 7:00–22:00', abierto: true, productos: [] },
  { id: 3, nombre: 'Papelería El Estudiante', categoria: 'Papelería', direccion: 'Blvd. Las Torres #78', horario: 'Lun-Vie 9:00–18:00', abierto: false, productos: [] },
  { id: 4, nombre: 'Mini Super La Esquina', categoria: 'Abarrotes', direccion: 'Calle Morelos #34', horario: 'Lun-Dom 6:00–23:00', abierto: true, productos: [] },
  { id: 5, nombre: 'Ferretería El Tornillo', categoria: 'Ferretería', direccion: 'Av. Reforma #210', horario: 'Lun-Sáb 8:00–18:00', abierto: false, productos: [] },
  { id: 6, nombre: 'Verduras y Frutas Lupita', categoria: 'Verdulería', direccion: 'Mercado Municipal Local 12', horario: 'Lun-Dom 6:00–15:00', abierto: true, productos: [] },
];

const CATEGORIAS = ['Abarrotes', 'Farmacia', 'Papelería', 'Ferretería', 'Verdulería', 'Otro'];

export default function TiendaForm() {
  const { id } = useParams();
  const esEdicion = !!id;
  const navigate = useNavigate();

  const tiendaExistente = esEdicion ? TIENDAS_MOCK.find(t => t.id === parseInt(id)) : null;

  const [nombre, setNombre] = useState(tiendaExistente?.nombre || '');
  const [categoria, setCategoria] = useState(tiendaExistente?.categoria || '');
  const [direccion, setDireccion] = useState(tiendaExistente?.direccion || '');
  const [horario, setHorario] = useState(tiendaExistente?.horario || '');
  const [abierto, setAbierto] = useState(tiendaExistente?.abierto ?? true);
  const [productos, setProductos] = useState(tiendaExistente?.productos || []);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');

  const agregarProducto = () => {
    setProductos(prev => [...prev, { id: Date.now(), nombre: '', precio: '' }]);
  };

  const actualizarProducto = (id, campo, valor) => {
    setProductos(prev => prev.map(p => p.id === id ? { ...p, [campo]: valor } : p));
  };

  const eliminarProducto = (id) => {
    setProductos(prev => prev.filter(p => p.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!nombre.trim()) newErrors.nombre = 'El nombre es obligatorio.';
    if (!categoria) newErrors.categoria = 'Selecciona una categoría.';
    if (!direccion.trim()) newErrors.direccion = 'La dirección es obligatoria.';

    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }

    setStatus('loading');
    await new Promise(r => setTimeout(r, 800));
    setStatus('success');
    setTimeout(() => navigate('/admin/tiendas'), 1000);
  };

  if (esEdicion && !tiendaExistente) {
    return (
      <div className="min-h-[calc(100vh-112px)] flex flex-col items-center justify-center text-center px-6">
        <p className="text-gray-400 text-lg mb-4">Tienda no encontrada.</p>
        <Link to="/admin/tiendas" className="text-emerald-400 hover:underline">Volver</Link>
      </div>
    );
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
              placeholder="Ej. Lun-Sáb 8:00–20:00"
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

          {/* Productos de la tienda */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium text-gray-400">Productos de la tienda</label>
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
