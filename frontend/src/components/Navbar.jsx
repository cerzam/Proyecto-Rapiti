import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

const Navbar = () => {
  const { isAuth, isAdmin, logout } = useAuth();
  const [menuAbierto, setMenuAbierto] = useState(false);

  const linkBase = "font-bold tracking-widest transition-all duration-300 rounded-2xl flex items-center justify-center outline-none";
  const desktopLink = `${linkBase} text-xl px-10 py-5`;
  const mobileLink = `${linkBase} text-lg px-6 py-4 w-full`;
  const activeClass = "text-emerald-400 bg-neutral-800/50 border-2 border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.1)]";
  const inactiveClass = "text-gray-400 hover:text-emerald-400 hover:bg-neutral-800/30 border-2 border-transparent";

  const cerrarMenu = () => setMenuAbierto(false);

  return (
    <nav className="w-full bg-[#0a0a0a] border-b border-neutral-800 sticky top-0 z-50">

      {/* Desktop */}
      <div className="hidden md:flex w-full px-10 h-28 items-center justify-around">
        <NavLink to="/" className={({ isActive }) => `${desktopLink} ${isActive ? activeClass : inactiveClass}`}>HOME</NavLink>
        <NavLink to="/buscador" className={({ isActive }) => `${desktopLink} ${isActive ? activeClass : inactiveClass}`}>BUSCADOR</NavLink>
        <NavLink to="/blog" className={({ isActive }) => `${desktopLink} ${isActive ? activeClass : inactiveClass}`}>BLOG</NavLink>
        <NavLink to="/tiendas" className={({ isActive }) => `${desktopLink} ${isActive ? activeClass : inactiveClass}`}>TIENDAS</NavLink>
        {isAdmin && (
          <NavLink to="/admin" className={({ isActive }) => `${desktopLink} ${isActive ? activeClass : inactiveClass}`}>ADMIN</NavLink>
        )}
        {isAuth ? (
          <button onClick={logout} className={`${desktopLink} text-gray-400 hover:text-red-400 hover:bg-neutral-800/30 border-2 border-transparent cursor-pointer`}>LOGOUT</button>
        ) : (
          <NavLink to="/login" className={({ isActive }) => `${desktopLink} ${isActive ? activeClass : inactiveClass}`}>LOGIN</NavLink>
        )}
      </div>

      {/* Mobile header */}
      <div className="flex md:hidden w-full px-6 h-20 items-center justify-between">
        <NavLink to="/" onClick={cerrarMenu} className="text-white font-bold text-xl tracking-widest">
          RAPITI
        </NavLink>
        <button
          onClick={() => setMenuAbierto(prev => !prev)}
          aria-label={menuAbierto ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={menuAbierto}
          className="text-gray-400 hover:text-emerald-400 transition-colors p-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-xl"
        >
          {menuAbierto ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {menuAbierto && (
        <div className="md:hidden border-t border-neutral-800 bg-[#0a0a0a] px-4 py-4 flex flex-col gap-2 animate-fade-in-up">
          <NavLink to="/" onClick={cerrarMenu} className={({ isActive }) => `${mobileLink} ${isActive ? activeClass : inactiveClass}`}>HOME</NavLink>
          <NavLink to="/buscador" onClick={cerrarMenu} className={({ isActive }) => `${mobileLink} ${isActive ? activeClass : inactiveClass}`}>BUSCADOR</NavLink>
          <NavLink to="/blog" onClick={cerrarMenu} className={({ isActive }) => `${mobileLink} ${isActive ? activeClass : inactiveClass}`}>BLOG</NavLink>
          <NavLink to="/tiendas" onClick={cerrarMenu} className={({ isActive }) => `${mobileLink} ${isActive ? activeClass : inactiveClass}`}>TIENDAS</NavLink>
          {isAdmin && (
            <NavLink to="/admin" onClick={cerrarMenu} className={({ isActive }) => `${mobileLink} ${isActive ? activeClass : inactiveClass}`}>ADMIN</NavLink>
          )}
          {isAuth ? (
            <button onClick={() => { logout(); cerrarMenu(); }} className={`${mobileLink} text-gray-400 hover:text-red-400 hover:bg-neutral-800/30 border-2 border-transparent cursor-pointer`}>LOGOUT</button>
          ) : (
            <NavLink to="/login" onClick={cerrarMenu} className={({ isActive }) => `${mobileLink} ${isActive ? activeClass : inactiveClass}`}>LOGIN</NavLink>
          )}
        </div>
      )}

    </nav>
  );
};

export default Navbar;
