import { NavLink } from 'react-router-dom';

// NUEVO: Recibimos las props isAuth y handleLogout
const Navbar = ({ isAuth, handleLogout }) => {
  const linkBase = "text-xl font-bold tracking-widest transition-all duration-300 px-10 py-5 rounded-2xl flex items-center justify-center outline-none";
  const activeClass = "text-emerald-400 bg-neutral-800/50 border-2 border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.1)]";
  const inactiveClass = "text-gray-400 hover:text-emerald-400 hover:bg-neutral-800/30 border-2 border-transparent";

  return (
    <nav className="w-full bg-[#0a0a0a] border-b border-neutral-800 sticky top-0 z-50 h-28 flex items-center">
      <div className="w-full px-20 flex items-center justify-around">
        
        <NavLink
          to="/"
          className={({ isActive }) => `${linkBase} ${isActive ? activeClass : inactiveClass}`}
        >
          HOME
        </NavLink>

        <NavLink
          to="/buscador"
          className={({ isActive }) => `${linkBase} ${isActive ? activeClass : inactiveClass}`}
        >
          BUSCADOR
        </NavLink>

        <NavLink
          to="/blog"
          className={({ isActive }) => `${linkBase} ${isActive ? activeClass : inactiveClass}`}
        >
          BLOG
        </NavLink>

        {/* NUEVO: Lógica Condicional para el Login/Logout */}
        {isAuth ? (
          <button
            onClick={handleLogout}
            className={`${linkBase} text-gray-400 hover:text-red-400 hover:bg-neutral-800/30 border-2 border-transparent cursor-pointer`}
          >
            LOGOUT
          </button>
        ) : (
          <NavLink
            to="/login"
            className={({ isActive }) => `${linkBase} ${isActive ? activeClass : inactiveClass}`}
          >
            LOGIN
          </NavLink>
        )}

      </div>
    </nav>
  );
};

export default Navbar;