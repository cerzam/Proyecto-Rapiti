import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-112px)] flex flex-col items-center justify-center text-center px-6 animate-fade-in-up">
      <p className="text-8xl font-bold text-emerald-400 mb-4">404</p>
      <h1 className="text-2xl font-bold text-white mb-2">Página no encontrada</h1>
      <p className="text-gray-400 mb-8">La dirección que buscas no existe.</p>
      <Link
        to="/"
        className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-6 py-3 rounded-2xl transition-all focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-500"
      >
        Volver al inicio
      </Link>
    </div>
  );
}
