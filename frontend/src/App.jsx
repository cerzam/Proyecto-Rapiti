import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/useAuth';
import Navbar from './components/Navbar';
import Home from './views/Home';
import Buscador from './views/Buscador';
import Login from './views/Login';
import ForgotPassword from './views/ForgotPassword';
import ResetPassword from './views/ResetPassword';
import Blog from './views/Blog';
import CreatePost from './views/CreatePost';
import EditPost from './views/EditPost';
import AdminPanel from './views/AdminPanel';
import AdminProducts from './views/AdminProducts';
import ProductForm from './views/ProductForm';

function AppRoutes() {
  const { isAuth, isAdmin, setShowExpiredModal, showExpiredModal } = useAuth();

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navbar />

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/buscador" element={isAuth ? <Buscador /> : <Navigate to="/login" replace />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/crear" element={isAuth ? <CreatePost /> : <Navigate to="/login" replace />} />
          <Route path="/blog/editar/:id" element={isAuth ? <EditPost /> : <Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/admin" element={isAdmin ? <AdminPanel /> : <Navigate to="/" replace />} />
          <Route path="/admin/productos" element={isAdmin ? <AdminProducts /> : <Navigate to="/" replace />} />
          <Route path="/admin/productos/nuevo" element={isAdmin ? <ProductForm /> : <Navigate to="/" replace />} />
          <Route path="/admin/productos/editar/:id" element={isAdmin ? <ProductForm /> : <Navigate to="/" replace />} />
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

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
