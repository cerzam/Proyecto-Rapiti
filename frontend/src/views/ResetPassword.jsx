import { useState, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';

  const tokenInvalido = !token;

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [errors, setErrors] = useState({ password: '', confirm: '' });
  const [globalMsg, setGlobalMsg] = useState('');
  const passwordRef = useRef(null);
  const confirmRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({ password: '', confirm: '' });
    setGlobalMsg('');

    let newErrors = { password: '', confirm: '' };
    let isValid = true;

    if (!password) {
      newErrors.password = 'La contraseña es obligatoria.';
      isValid = false;
    } else if (password.length < 8) {
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres.';
      isValid = false;
    } else if (password.length > 128) {
      newErrors.password = 'La contraseña no puede exceder los 128 caracteres.';
      isValid = false;
    }

    if (!confirm) {
      newErrors.confirm = 'Debes confirmar la contraseña.';
      isValid = false;
    } else if (password !== confirm) {
      newErrors.confirm = 'Las contraseñas no coinciden.';
      isValid = false;
    }

    if (!isValid) {
      setErrors(newErrors);
      if (newErrors.password) passwordRef.current.focus();
      else if (newErrors.confirm) confirmRef.current.focus();
      return;
    }

    setStatus('loading');

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus('error');
        setGlobalMsg(data.message || 'El enlace no es válido o ya expiró.');
        return;
      }

      setStatus('success');
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
          NUEVA <span className="text-emerald-400">CONTRASEÑA</span>
        </h2>
        <p className="text-center text-gray-400 text-sm mb-8">
          Elige una contraseña segura de al menos 8 caracteres.
        </p>

        <div aria-live="polite" className="mb-4">
          {(tokenInvalido || globalMsg) && (
            <div
              role="alert"
              className={`border p-4 rounded-xl text-sm ${
                status === 'success'
                  ? 'bg-emerald-900/30 border-emerald-500 text-emerald-400'
                  : 'bg-red-900/30 border-red-500 text-red-400'
              }`}
            >
              {tokenInvalido ? 'El enlace no es válido o ya expiró.' : globalMsg}
            </div>
          )}
        </div>

        {!tokenInvalido && status !== 'success' && status !== 'error' ? (
          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-400 mb-2">
                Nueva contraseña
              </label>
              <input
                ref={passwordRef}
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={status === 'loading'}
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? 'password-error' : undefined}
                className={`w-full bg-neutral-900 border-2 text-white px-4 py-3 rounded-2xl outline-none transition-all duration-300 placeholder:text-gray-600
                  focus:ring-4 focus:ring-emerald-500
                  ${status === 'loading' ? 'opacity-50 cursor-not-allowed' : ''}
                  ${errors.password ? 'border-red-500' : 'border-neutral-800'}`}
                placeholder="••••••••"
              />
              {errors.password && (
                <p id="password-error" className="mt-2 text-sm text-red-400 font-medium" aria-live="polite">
                  {errors.password}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="confirm" className="block text-sm font-medium text-gray-400 mb-2">
                Confirmar contraseña
              </label>
              <input
                ref={confirmRef}
                id="confirm"
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                disabled={status === 'loading'}
                aria-invalid={!!errors.confirm}
                aria-describedby={errors.confirm ? 'confirm-error' : undefined}
                className={`w-full bg-neutral-900 border-2 text-white px-4 py-3 rounded-2xl outline-none transition-all duration-300 placeholder:text-gray-600
                  focus:ring-4 focus:ring-emerald-500
                  ${status === 'loading' ? 'opacity-50 cursor-not-allowed' : ''}
                  ${errors.confirm ? 'border-red-500' : 'border-neutral-800'}`}
                placeholder="••••••••"
              />
              {errors.confirm && (
                <p id="confirm-error" className="mt-2 text-sm text-red-400 font-medium" aria-live="polite">
                  {errors.confirm}
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
                  Actualizando...
                </>
              ) : (
                'Cambiar contraseña'
              )}
            </button>
          </form>
        ) : null}

        {status === 'success' && (
          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="inline-block bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 px-8 rounded-2xl transition-all focus:ring-4 focus:ring-emerald-500 outline-none"
            >
              Ir al inicio de sesión
            </Link>
          </div>
        )}

        {(tokenInvalido || status === 'error') && (
          <div className="mt-6 text-center">
            <Link
              to="/forgot-password"
              className="text-sm text-gray-400 hover:text-emerald-400 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded"
            >
              Solicitar un nuevo enlace
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}
