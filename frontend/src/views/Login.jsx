import { useEffect, useRef } from 'react'; 

const Login = () => {
  const emailRef = useRef(null); 

  useEffect(() => {
    
    emailRef.current?.focus();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-112px)] px-4">
      <div className="bg-neutral-900/50 border border-neutral-800 p-10 rounded-3xl backdrop-blur-md w-full max-w-md shadow-2xl animate-scale-in">
        <h2 className="text-3xl font-bold text-white mb-8 text-center tracking-tight">
          INICIAR <span className="text-emerald-500">SESIÓN</span>
        </h2>
        
        <form className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-gray-400 mb-2 ml-1 text-sm font-medium">Email</label>
            <input
              id="email"
              ref={emailRef}
              type="email"
              placeholder="tu@correo.com"
              className="w-full bg-black/40 border border-neutral-700 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all" 
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-gray-400 mb-2 ml-1 text-sm font-medium">Contraseña</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              className="w-full bg-black/40 border border-neutral-700 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all" 
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] active:scale-[0.98]"
          >
            ENTRAR
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;