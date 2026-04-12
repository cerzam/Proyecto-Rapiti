import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';

const productosMock = {
  1: { nombre: 'Leche Lala 1L', precio: '28.50', imagen: 'https://arteli.vtexassets.com/arquivos/ids/258200/7501020526066_02.jpg?v=638635810988400000' },
  2: { nombre: 'Pan Bimbo Grande', precio: '45.00', imagen: 'https://www.mayoreototal.mx/cdn/shop/files/Capturadepantalla2024-11-04ala_s_6.29.48a.m._1024x1024@2x.png?v=1730723418' },
};

export default function ProductForm() {
  const { id } = useParams();
  const esEdicion = !!id;
  const productoExistente = esEdicion ? productosMock[id] : null;

  const [nombre, setNombre] = useState(productoExistente?.nombre || '');
  const [precio, setPrecio] = useState(productoExistente?.precio || '');
  const [imagen, setImagen] = useState(productoExistente?.imagen || '');
  const [errors, setErrors] = useState({ nombre: '', precio: '', imagen: '' });
  const [status, setStatus] = useState('idle');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = { nombre: '', precio: '', imagen: '' };
    let isValid = true;

    if (!nombre.trim()) {
      newErrors.nombre = 'El nombre es obligatorio.';
      isValid = false;
    }
    if (!precio || isNaN(precio) || parseFloat(precio) <= 0) {
      newErrors.precio = 'El precio debe ser mayor a 0.';
      isValid = false;
    }

    if (!isValid) {
      setErrors(newErrors);
      return;
    }

    setStatus('loading');

    // Simulamos guardado (mock)
    setTimeout(() => {
      setStatus('success');
      setTimeout(() => navigate('/admin/productos'), 1000);
    }, 800);
  };

  return (
    <div className="min-h-[calc(100vh-112px)] px-6 py-12 max-w-2xl mx-auto">
      <div className="bg-neutral-900 border-2 border-neutral-800 rounded-2xl p-8 animate-scale-in">

        <h1 className="text-3xl font-bold text-white mb-8">
          {esEdicion ? 'Editar' : 'Nuevo'} <span className="text-emerald-400">producto</span>
        </h1>

        <div aria-live="polite" className="mb-4">
          {status === 'success' && (
            <div role="alert" className="bg-emerald-900/30 border border-emerald-500 text-emerald-400 p-4 rounded-xl text-sm">
              ✅ Producto {esEdicion ? 'actualizado' : 'creado'}. Redirigiendo...
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>

          {/* NOMBRE */}
          <div>
            <label htmlFor="nombre" className="block text-sm font-medium text-gray-400 mb-2">
              Nombre del producto
            </label>
            <input
              id="nombre"
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              disabled={status === 'loading'}
              aria-invalid={!!errors.nombre}
              aria-describedby={errors.nombre ? 'nombre-error' : undefined}
              placeholder="Ej. Leche Lala 1L"
              className={`w-full bg-neutral-900 border-2 text-white px-4 py-3 rounded-2xl outline-none transition-all placeholder:text-gray-600
                focus:ring-4 focus:ring-emerald-500
                ${errors.nombre ? 'border-red-500' : 'border-neutral-700'}`}
            />
            {errors.nombre && (
              <p id="nombre-error" className="mt-2 text-sm text-red-400" aria-live="polite">{errors.nombre}</p>
            )}
          </div>

          {/* PRECIO */}
          <div>
            <label htmlFor="precio" className="block text-sm font-medium text-gray-400 mb-2">
              Precio (MXN)
            </label>
            <input
              id="precio"
              type="number"
              min="0.01"
              step="0.01"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
              disabled={status === 'loading'}
              aria-invalid={!!errors.precio}
              aria-describedby={errors.precio ? 'precio-error' : undefined}
              placeholder="0.00"
              className={`w-full bg-neutral-900 border-2 text-white px-4 py-3 rounded-2xl outline-none transition-all placeholder:text-gray-600
                focus:ring-4 focus:ring-emerald-500
                ${errors.precio ? 'border-red-500' : 'border-neutral-700'}`}
            />
            {errors.precio && (
              <p id="precio-error" className="mt-2 text-sm text-red-400" aria-live="polite">{errors.precio}</p>
            )}
          </div>

          {/* URL DE IMAGEN */}
          <div>
            <label htmlFor="imagen" className="block text-sm font-medium text-gray-400 mb-2">
              URL de imagen <span className="text-gray-600">(opcional)</span>
            </label>
            <input
              id="imagen"
              type="url"
              value={imagen}
              onChange={(e) => setImagen(e.target.value)}
              disabled={status === 'loading'}
              placeholder="https://..."
              className="w-full bg-neutral-900 border-2 border-neutral-700 text-white px-4 py-3 rounded-2xl outline-none transition-all placeholder:text-gray-600 focus:ring-4 focus:ring-emerald-500"
            />
            {imagen && (
              <img
                src={imagen}
                alt="Vista previa"
                className="mt-3 w-24 h-24 object-contain rounded-xl bg-neutral-800"
              />
            )}
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={status === 'loading'}
              aria-busy={status === 'loading'}
              className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 rounded-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center focus:ring-4 focus:ring-emerald-500 outline-none"
            >
              {status === 'loading' ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                  Guardando...
                </>
              ) : esEdicion ? 'Guardar cambios' : 'Crear producto'}
            </button>

            <Link
              to="/admin/productos"
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
