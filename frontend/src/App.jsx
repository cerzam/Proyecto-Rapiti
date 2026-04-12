import { Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './views/Home';
import Buscador from './views/Buscador';
import Login from './views/Login';
import ForgotPassword from './views/ForgotPassword';
import ResetPassword from './views/ResetPassword';
import Blog from './views/Blog';
import CreatePost from './views/CreatePost';

function App() {
  // Estado para saber si el usuario tiene sesión
  const [isAuth, setIsAuth] = useState(!!localStorage.getItem('token'));
  // Estado para mostrar el mensaje de sesión expirada
  const [showExpiredModal, setShowExpiredModal] = useState(false);

  // Reconexión: verificar si la sesión sigue válida al volver a estar online
  useEffect(() => {
    const handleOnline = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/verify`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          localStorage.removeItem('token');
          setIsAuth(false);
          setShowExpiredModal(true);
        }
      } catch {
        // Sin conexión aún, no hacer nada
      }
    };

    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, []);

  // Checador de pestañas (Storage Event)
  useEffect(() => {
    const handleStorageChange = (e) => {
      // Si otra pestaña borró el token (Logout o Expiración)
      if (e.key === 'token' && e.newValue === null) {
        setIsAuth(false);
        setShowExpiredModal(true); // Mostramos el mensaje de que terminó
      }
      // Si otra pestaña inició sesión
      if (e.key === 'token' && e.newValue !== null) {
        setIsAuth(true);
        setShowExpiredModal(false);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Función para cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem('token'); // Borramos el token
    setIsAuth(false);
    // Se envia un evento manual por si necesitamos que esta misma pestaña reaccione
    window.dispatchEvent(new Event('storage')); 
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Pasamos los props al Navbar */}
      <Navbar isAuth={isAuth} handleLogout={handleLogout} />
      
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/buscador"
            element={isAuth ? <Buscador /> : <Navigate to="/login" replace />}
          />
          {/* Le pasamos setIsAuth al Login para que pueda avisar cuando entre */}
          <Route path="/blog" element={<Blog isAuth={isAuth} />} />
          <Route path="/blog/crear" element={isAuth ? <CreatePost /> : <Navigate to="/login" replace />} />
          <Route path="/login" element={<Login setIsAuth={setIsAuth} />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Routes>
      </main>

      {/* Modal de Sesión Expirada */}
      {showExpiredModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] animate-fade-in">
          <div className="bg-[#0a0a0a] border-2 border-neutral-800 p-8 rounded-2xl max-w-sm w-full text-center shadow-[0_0_30px_rgba(16,185,129,0.15)] animate-scale-in">
            <h3 className="text-emerald-400 text-xl font-bold mb-4 tracking-widest">SESIÓN TERMINADA</h3>
            <p className="text-gray-400 mb-6">Tu sesión ha expirado o fue cerrada en otra pestaña.</p>
            <button 
              onClick={() => setShowExpiredModal(false)}
              className="w-full text-gray-900 bg-emerald-500 hover:bg-emerald-400 font-bold tracking-widest px-6 py-3 rounded-xl transition-all outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a] focus-visible:ring-emerald-500"
            >
              ENTENDIDO
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;