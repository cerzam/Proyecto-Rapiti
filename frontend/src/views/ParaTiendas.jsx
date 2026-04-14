import { useState } from 'react';
import { Link } from 'react-router-dom';

const BENEFICIOS = [
  { icon: '📈', titulo: 'Incrementa tus Ventas', desc: 'Acceso a una amplia base de clientes que buscan activamente productos como los tuyos.' },
  { icon: '🛎️', titulo: 'Soporte 24/7', desc: 'Equipo de soporte dedicado listo para ayudarte a tener éxito en cualquier momento.' },
  { icon: '👥', titulo: 'Alcanza Más Clientes', desc: 'Conéctate con miles de compradores potenciales en tu zona y más allá.' },
  { icon: '⚡', titulo: 'Gestión Fácil', desc: 'Panel de control intuitivo para administrar inventario, pedidos e interacciones con clientes.' },
];

export default function ParaTiendas() {
  const [form, setForm] = useState({ nombreTienda: '', categoria: '', descripcion: '', nombrePropietario: '', email: '', telefono: '', ciudad: '', codigoPostal: '' });
  const [status, setStatus] = useState('idle');
  const [errors, setErrors] = useState({});

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!form.nombreTienda.trim()) newErrors.nombreTienda = 'Requerido';
    if (!form.categoria) newErrors.categoria = 'Requerido';
    if (!form.nombrePropietario.trim()) newErrors.nombrePropietario = 'Requerido';
    if (!form.email.trim()) newErrors.email = 'Requerido';

    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }

    setStatus('loading');
    await new Promise(r => setTimeout(r, 1000));
    setStatus('success');
  };

  return (
    <div className="min-h-[calc(100vh-112px)]">

      {/* Hero */}
      <section className="bg-[#0a0a0a] px-6 py-20 text-center border-b border-neutral-800">
        <div className="max-w-3xl mx-auto animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Únete a <span className="text-emerald-400">Rapiti</span> y conecta con miles de clientes
          </h1>
          <p className="text-gray-400 text-lg mb-8">Haz crecer tu negocio con herramientas poderosas para tiendas locales de Tehuacán.</p>
          <a href="#registro" className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-8 py-4 rounded-2xl transition-all inline-block focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-500">
            Comenzar a vender ahora
          </a>
        </div>
      </section>

      {/* Beneficios */}
      <section className="px-6 py-16 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-white text-center mb-4">Beneficios de unirte</h2>
        <p className="text-gray-400 text-center mb-12">Descubre por qué miles de tiendas confían en Rapiti para hacer crecer su negocio</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {BENEFICIOS.map((b, i) => (
            <div key={i} className="bg-neutral-900 border-2 border-neutral-800 rounded-2xl p-6 animate-fade-in-up" style={{ animationDelay: `${i * 0.07}s` }}>
              <div className="text-3xl mb-3">{b.icon}</div>
              <h3 className="text-white font-bold text-lg mb-2">{b.titulo}</h3>
              <p className="text-gray-400 text-sm">{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Formulario */}
      <section id="registro" className="px-6 py-16 bg-neutral-900/50 border-t border-neutral-800">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-2">Solicitar Registro</h2>
          <p className="text-gray-400 text-center mb-10">Completa el formulario para unirte a Rapiti. Los campos marcados con * son obligatorios.</p>

          {status === 'success' ? (
            <div className="bg-emerald-900/30 border border-emerald-500 text-emerald-400 p-8 rounded-2xl text-center animate-scale-in">
              <p className="text-2xl font-bold mb-2">¡Solicitud enviada!</p>
              <p className="text-sm mb-6">Nos pondremos en contacto contigo pronto para completar tu registro.</p>
              <Link to="/" className="text-emerald-400 hover:underline">Volver al inicio</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="grid grid-cols-1 md:grid-cols-3 gap-6">

              {/* Información de la Tienda */}
              <div className="bg-neutral-900 border-2 border-neutral-800 rounded-2xl p-6 space-y-4">
                <h3 className="text-white font-bold mb-2">Información de la Tienda</h3>
                <div>
                  <label className="text-gray-400 text-sm block mb-1">Nombre de la Tienda *</label>
                  <input name="nombreTienda" value={form.nombreTienda} onChange={handleChange}
                    placeholder="Ingresa el nombre de tu tienda"
                    className={`w-full bg-neutral-800 border-2 text-white px-3 py-2 rounded-xl outline-none text-sm focus:ring-2 focus:ring-emerald-500 ${errors.nombreTienda ? 'border-red-500' : 'border-neutral-700'}`} />
                  {errors.nombreTienda && <p className="text-red-400 text-xs mt-1">{errors.nombreTienda}</p>}
                </div>
                <div>
                  <label className="text-gray-400 text-sm block mb-1">Categoría de la Tienda *</label>
                  <select name="categoria" value={form.categoria} onChange={handleChange}
                    className={`w-full bg-neutral-800 border-2 text-white px-3 py-2 rounded-xl outline-none text-sm focus:ring-2 focus:ring-emerald-500 ${errors.categoria ? 'border-red-500' : 'border-neutral-700'}`}>
                    <option value="">Selecciona una categoría</option>
                    <option>Abarrotes</option>
                    <option>Farmacia</option>
                    <option>Papelería</option>
                    <option>Ferretería</option>
                    <option>Verdulería</option>
                    <option>Otro</option>
                  </select>
                  {errors.categoria && <p className="text-red-400 text-xs mt-1">{errors.categoria}</p>}
                </div>
                <div>
                  <label className="text-gray-400 text-sm block mb-1">Descripción de la Tienda</label>
                  <textarea name="descripcion" value={form.descripcion} onChange={handleChange}
                    placeholder="Describe tu tienda y lo que vendes (mínimo 20 caracteres)"
                    rows={3}
                    className="w-full bg-neutral-800 border-2 border-neutral-700 text-white px-3 py-2 rounded-xl outline-none text-sm focus:ring-2 focus:ring-emerald-500 resize-none" />
                </div>
              </div>

              {/* Información del Propietario */}
              <div className="bg-neutral-900 border-2 border-neutral-800 rounded-2xl p-6 space-y-4">
                <h3 className="text-white font-bold mb-2">Información del Propietario</h3>
                <div>
                  <label className="text-gray-400 text-sm block mb-1">Nombre Completo *</label>
                  <input name="nombrePropietario" value={form.nombrePropietario} onChange={handleChange}
                    placeholder="Ingresa tu nombre completo"
                    className={`w-full bg-neutral-800 border-2 text-white px-3 py-2 rounded-xl outline-none text-sm focus:ring-2 focus:ring-emerald-500 ${errors.nombrePropietario ? 'border-red-500' : 'border-neutral-700'}`} />
                  {errors.nombrePropietario && <p className="text-red-400 text-xs mt-1">{errors.nombrePropietario}</p>}
                </div>
                <div>
                  <label className="text-gray-400 text-sm block mb-1">Dirección de Correo Electrónico *</label>
                  <input name="email" type="email" value={form.email} onChange={handleChange}
                    placeholder="tu@correo.com"
                    className={`w-full bg-neutral-800 border-2 text-white px-3 py-2 rounded-xl outline-none text-sm focus:ring-2 focus:ring-emerald-500 ${errors.email ? 'border-red-500' : 'border-neutral-700'}`} />
                  {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                </div>
                <div>
                  <label className="text-gray-400 text-sm block mb-1">Número de Teléfono</label>
                  <input name="telefono" value={form.telefono} onChange={handleChange}
                    placeholder="+1 (555) 123-4567"
                    className="w-full bg-neutral-800 border-2 border-neutral-700 text-white px-3 py-2 rounded-xl outline-none text-sm focus:ring-2 focus:ring-emerald-500" />
                </div>
              </div>

              {/* Ubicación */}
              <div className="bg-neutral-900 border-2 border-neutral-800 rounded-2xl p-6 space-y-4">
                <h3 className="text-white font-bold mb-2">Ubicación de la Tienda</h3>
                <div>
                  <label className="text-gray-400 text-sm block mb-1">Calle y Número</label>
                  <input name="calle" onChange={handleChange}
                    placeholder="Ej. 123 Calle Principal"
                    className="w-full bg-neutral-800 border-2 border-neutral-700 text-white px-3 py-2 rounded-xl outline-none text-sm focus:ring-2 focus:ring-emerald-500" />
                </div>
                <div>
                  <label className="text-gray-400 text-sm block mb-1">Ciudad</label>
                  <input name="ciudad" value={form.ciudad} onChange={handleChange}
                    placeholder="Tehuacán"
                    className="w-full bg-neutral-800 border-2 border-neutral-700 text-white px-3 py-2 rounded-xl outline-none text-sm focus:ring-2 focus:ring-emerald-500" />
                </div>
                <div>
                  <label className="text-gray-400 text-sm block mb-1">Código Postal</label>
                  <input name="codigoPostal" value={form.codigoPostal} onChange={handleChange}
                    placeholder="75700"
                    className="w-full bg-neutral-800 border-2 border-neutral-700 text-white px-3 py-2 rounded-xl outline-none text-sm focus:ring-2 focus:ring-emerald-500" />
                </div>
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-xl transition-all mt-4 disabled:opacity-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-500"
                >
                  {status === 'loading' ? 'Enviando...' : 'Enviar registro'}
                </button>
              </div>

            </form>
          )}
        </div>
      </section>

    </div>
  );
}
