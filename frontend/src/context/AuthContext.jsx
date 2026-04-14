import { createContext, useState, useEffect } from 'react';

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAuth, setIsAuth] = useState(!!localStorage.getItem('token'));
  const [rol, setRol] = useState(localStorage.getItem('rol') || '');
  const [showExpiredModal, setShowExpiredModal] = useState(false);

  const isAdmin = isAuth && (rol === 'tienda' || rol === 'admin');

  const login = (token, userRol) => {
    localStorage.setItem('token', token);
    localStorage.setItem('rol', userRol);
    setIsAuth(true);
    setRol(userRol);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    setIsAuth(false);
    setRol('');
    window.dispatchEvent(new Event('storage'));
  };

  useEffect(() => {
    const handleOnline = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/verify`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          logout();
          setShowExpiredModal(true);
        }
      } catch {
        // Sin conexión aún
      }
    };
    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, []);

  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === 'token' && e.newValue === null) {
        setIsAuth(false);
        setRol('');
        setShowExpiredModal(true);
      }
      if (e.key === 'token' && e.newValue !== null) {
        setIsAuth(true);
        setShowExpiredModal(false);
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuth, isAdmin, rol, login, logout, showExpiredModal, setShowExpiredModal }}>
      {children}
    </AuthContext.Provider>
  );
}
