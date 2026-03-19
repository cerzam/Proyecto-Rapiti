import { useState, useRef } from 'react';

export default function Login() {
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

    // VALIDACIONES DEL CORREO (Reglas del TL)
    
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

    // VALIDACIONES DE LA CONTRASEÑA (Reglas del TL)

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
      // Simulación de petición al Backend (espera 1.5s)
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Simulación de respuesta del servidor
      if (email === 'tienda@rapiti.com' && password === '12345678') {
        setStatus('success');
        // El TL indicó que el Payload trae el rol. Aquí guardaríamos el JWT real.
        localStorage.setItem('token', 'simulacion-jwt-tienda'); 
        alert('¡Login exitoso! Bienvenido a tu panel de Tienda.');
      } else {
        setStatus('error');
        // Mensaje genérico y seguro (Requisito TL)
        setErrors({ ...newErrors, global: 'Credenciales inválidas.' });
        // Importante: No limpiamos el password (Requisito TL)
      }
    } catch {
      setStatus('error');
      setErrors({ ...newErrors, global: 'Ocurrió un error de red. Intenta más tarde.' });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          INICIAR SESIÓN
        </h2>

        {/* ERROR GLOBAL SEGURO */}
        <div aria-live="polite" className="mb-4">
          {errors.global && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 rounded">
              <p className="text-sm flex items-center">
                <span className="mr-2">⚠️</span> {errors.global}
              </p>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          
          {/* CAMPO DE CORREO */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              ref={emailRef}
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={status === 'loading'}
              // Atributos de accesibilidad exigidos por el TL
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
              className={`w-full px-4 py-2 text-gray-900 border rounded-md outline-none transition-colors focus:ring-2 
                ${errors.email 
                  ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                  : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'}`}
              placeholder="tu@correo.com"
            />
            {/* Mensaje de error específico del campo */}
            {errors.email && (
              <p id="email-error" className="mt-1 text-sm text-red-600 font-medium" aria-live="polite">
                {errors.email}
              </p>
            )}
          </div>

          {/* CAMPO DE CONTRASEÑA */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña
            </label>
            <input
              ref={passwordRef}
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={status === 'loading'}
              // Atributos de accesibilidad exigidos por el TL
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? "password-error" : undefined}
              className={`w-full px-4 py-2 text-gray-900 border rounded-md outline-none transition-colors focus:ring-2 
                ${errors.password 
                  ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                  : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'}`}
              placeholder="••••••••"
            />
            {/* Mensaje de error específico del campo */}
            {errors.password && (
              <p id="password-error" className="mt-1 text-sm text-red-600 font-medium" aria-live="polite">
                {errors.password}
              </p>
            )}
          </div>

          {/* BOTÓN SUBMIT */}
          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition-all duration-200 disabled:bg-blue-400 flex justify-center items-center"
            aria-busy={status === 'loading'}
          >
            {status === 'loading' ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
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