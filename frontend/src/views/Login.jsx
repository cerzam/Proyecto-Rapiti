import { useState, useRef } from 'react';

export default function Login({ setIsAuth }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  
  // Manejo de errores granular para saber exactamente qué falló 
  const [errors, setErrors] = useState({ global: '', email: '', password: '' });

  // Referencias para manejar el foco de teclado cuando hay errores 
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setErrors({ global: '', email: '', password: '' });

    let isValid = true;
    let newErrors = { global: '', email: '', password: '' };

    // VALIDACIONES DEL CORREO 
    if (!email) {
      newErrors.email = 'El correo electrónico es obligatorio.';
      isValid = false;
    } else if (email.length > 255) {
      newErrors.email = 'El correo no puede exceder los 255 caracteres.';
      isValid = false;
    } else if (/\s/.test(email)) {
      newErrors.email = 'El correo no debe contener espacios.';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Debe tener formato válido (ej. usuario@dominio.com).';
      isValid = false;
    }

    // VALIDACIONES DE LA CONTRASEÑA 
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

    // Si fallan las validaciones locales
    if (!isValid) {
      setErrors(newErrors);
      setStatus('error');
      
      // Mantener el foco en el campo con error 
      if (newErrors.email) {
        emailRef.current.focus();
      } else if (newErrors.password) {
        passwordRef.current.focus();
      }
      return;
    }

    try {
      // ESTE ES EL CÓDIGO QUE CONECTA CON EL BACKEND
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus('error');
        setErrors({ ...newErrors, global: data.message || 'Credenciales inválidas.' });
        return;
      }

      // Guardamos la sesión real
      localStorage.setItem('token', data.token);
      localStorage.setItem('rol', data.user.rol);
      setStatus('success');
      
      // pruebas
      setIsAuth(true);
      
      alert(`¡Login exitoso! Bienvenido, ${data.user.rol}.`);
    } catch {
      setStatus('error');
      setErrors({ ...newErrors, global: 'Ocurrió un error de red. Intenta más tarde.' });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-112px)] px-4">
      <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl p-8 animate-scale-in">

        <h2 className="text-3xl font-bold text-center text-white tracking-widest mb-8">
          INICIAR <span className="text-emerald-400">SESIÓN</span>
        </h2>

        {/* ERROR GLOBAL SEGURO */}
        <div aria-live="polite" className="mb-4">
          {errors.global && (
            <div role="alert" className="bg-red-900/30 border border-red-500 text-red-400 p-4 rounded-xl">
              <p className="text-sm flex items-center gap-2">
                <span>⚠</span> {errors.global}
              </p>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>

          {/* CAMPO DE CORREO */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2">
              Email
            </label>
            <input
              ref={emailRef}
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={status === 'loading'}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
              className={`w-full bg-neutral-900 border-2 text-white px-4 py-3 rounded-2xl outline-none transition-all duration-300 placeholder:text-gray-600
                focus:ring-4 focus:ring-emerald-500
                ${status === 'loading' ? 'opacity-50 cursor-not-allowed' : ''}
                ${errors.email ? 'border-red-500' : 'border-neutral-800'}`}
              placeholder="tu@correo.com"
            />
            {errors.email && (
              <p id="email-error" className="mt-2 text-sm text-red-400 font-medium" aria-live="polite">
                {errors.email}
              </p>
            )}
          </div>

          {/* CAMPO DE CONTRASEÑA */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-400 mb-2">
              Contraseña
            </label>
            <input
              ref={passwordRef}
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={status === 'loading'}
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? "password-error" : undefined}
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

          {/* BOTÓN SUBMIT */}
          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 px-4 rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center focus:ring-4 focus:ring-emerald-500 outline-none"
            aria-busy={status === 'loading'}
          >
            {status === 'loading' ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                Iniciando sesión...
              </>
            ) : (
              'Entrar'
            )}
          </button>
        </form>

      </div>
    </div>
  );
}