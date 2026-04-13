import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function CreatePost() {
  const [titulo, setTitulo] = useState('');
  const [contenido, setContenido] = useState('');
  const [errors, setErrors] = useState({ titulo: '', contenido: '' });
  const [status, setStatus] = useState('idle'); // idle | loading | success
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = { titulo: '', contenido: '' };
    let isValid = true;

    if (!titulo.trim()) {
      newErrors.titulo = 'El título es obligatorio.';
      isValid = false;
    }
    if (!contenido.trim()) {
      newErrors.contenido = 'El contenido es obligatorio.';
      isValid = false;
    }

    if (!isValid) {
      setErrors(newErrors);
      return;
    }

    setStatus('loading');

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/blog`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: titulo, content: contenido }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setStatus('success');
      setTimeout(() => navigate('/blog'), 1200);
    } catch (err) {
      setStatus('error');
      setErrors({ ...newErrors, contenido: err.message || 'Error al publicar.' });
    }
  };

  return (
    <div className="min-h-[calc(100vh-112px)] px-6 py-12 max-w-2xl mx-auto">
      <div className="bg-neutral-900 border-2 border-neutral-800 rounded-2xl p-8 animate-scale-in">

        <h1 className="text-3xl font-bold text-white mb-8">
          Nueva <span className="text-emerald-400">publicación</span>
        </h1>

        <div aria-live="polite" className="mb-4">
          {status === 'success' && (
            <div role="alert" className="bg-emerald-900/30 border border-emerald-500 text-emerald-400 p-4 rounded-xl text-sm">
              ✅ Publicación creada. Redirigiendo...
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>

          {/* TÍTULO */}
          <div>
            <label htmlFor="titulo" className="block text-sm font-medium text-gray-400 mb-2">
              Título
            </label>
            <input
              id="titulo"
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              disabled={status === 'loading'}
              aria-invalid={!!errors.titulo}
              aria-describedby={errors.titulo ? 'titulo-error' : undefined}
              placeholder="Ej. Mejores precios en Oxxo esta semana"
              className={`w-full bg-neutral-900 border-2 text-white px-4 py-3 rounded-2xl outline-none transition-all placeholder:text-gray-600
                focus:ring-4 focus:ring-emerald-500
                ${errors.titulo ? 'border-red-500' : 'border-neutral-700'}`}
            />
            {errors.titulo && (
              <p id="titulo-error" className="mt-2 text-sm text-red-400" aria-live="polite">
                {errors.titulo}
              </p>
            )}
          </div>

          {/* CONTENIDO */}
          <div>
            <label htmlFor="contenido" className="block text-sm font-medium text-gray-400 mb-2">
              Contenido
            </label>
            <textarea
              id="contenido"
              value={contenido}
              onChange={(e) => setContenido(e.target.value)}
              disabled={status === 'loading'}
              aria-invalid={!!errors.contenido}
              aria-describedby={errors.contenido ? 'contenido-error' : undefined}
              placeholder="Escribe tu publicación aquí..."
              rows={6}
              className={`w-full bg-neutral-900 border-2 text-white px-4 py-3 rounded-2xl outline-none transition-all placeholder:text-gray-600 resize-none
                focus:ring-4 focus:ring-emerald-500
                ${errors.contenido ? 'border-red-500' : 'border-neutral-700'}`}
            />
            {errors.contenido && (
              <p id="contenido-error" className="mt-2 text-sm text-red-400" aria-live="polite">
                {errors.contenido}
              </p>
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
                  Publicando...
                </>
              ) : 'Publicar'}
            </button>

            <Link
              to="/blog"
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
