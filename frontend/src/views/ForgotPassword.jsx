import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | sent | error
  const [emailError, setEmailError] = useState('');
  const [globalMsg, setGlobalMsg] = useState('');
  const emailRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmailError('');
    setGlobalMsg('');

    if (!email) {
      setEmailError('El correo electrónico es obligatorio.');
      emailRef.current.focus();
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Debe tener formato válido (ej. usuario@dominio.com).');
      emailRef.current.focus();
      return;
    }

    setStatus('loading');

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus('error');
        setGlobalMsg('Ocurrió un error. Intenta más tarde.');
        return;
      }

      // En dev mostramos el token en consola para poder demostrar el flujo
      if (data._devToken) {
        console.info('[DEV] Token de recuperación:', data._devToken);
        console.info('[DEV] URL de reset:', `${window.location.origin}/reset-password?token=${data._devToken}`);
      }

      setStatus('sent');
      setGlobalMsg(data.message);
    } catch {
      setStatus('error');
      setGlobalMsg('Ocurrió un error de red. Intenta más tarde.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-112px)] px-4">
      <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl p-8 animate-scale-in">

        <h2 className="text-3xl font-bold text-center text-white tracking-widest mb-2">
          RECUPERAR <span className="text-emerald-400">ACCESO</span>
        </h2>
        <p className="text-center text-gray-400 text-sm mb-8">
          Ingresa tu correo y te enviaremos las instrucciones.
        </p>

        <div aria-live="polite" className="mb-4">
          {globalMsg && (
            <div
              role="alert"
              className={`border p-4 rounded-xl text-sm ${
                status === 'sent'
                  ? 'bg-emerald-900/30 border-emerald-500 text-emerald-400'
                  : 'bg-red-900/30 border-red-500 text-red-400'
              }`}
            >
              {globalMsg}
            </div>
          )}
        </div>

        {status !== 'sent' && (
          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2">
                Correo electrónico
              </label>
              <input
                ref={emailRef}
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={status === 'loading'}
                aria-invalid={!!emailError}
                aria-describedby={emailError ? 'email-error' : undefined}
                className={`w-full bg-neutral-900 border-2 text-white px-4 py-3 rounded-2xl outline-none transition-all duration-300 placeholder:text-gray-600
                  focus:ring-4 focus:ring-emerald-500
                  ${status === 'loading' ? 'opacity-50 cursor-not-allowed' : ''}
                  ${emailError ? 'border-red-500' : 'border-neutral-800'}`}
                placeholder="tu@correo.com"
              />
              {emailError && (
                <p id="email-error" className="mt-2 text-sm text-red-400 font-medium" aria-live="polite">
                  {emailError}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={status === 'loading'}
              aria-busy={status === 'loading'}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 px-4 rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center focus:ring-4 focus:ring-emerald-500 outline-none"
            >
              {status === 'loading' ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                  Enviando...
                </>
              ) : (
                'Enviar instrucciones'
              )}
            </button>
          </form>
        )}

        <div className="mt-6 text-center">
          <Link
            to="/login"
            className="text-sm text-gray-400 hover:text-emerald-400 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded"
          >
            Volver al inicio de sesión
          </Link>
        </div>

      </div>
    </div>
  );
}
