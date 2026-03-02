import { useState, useEffect, useRef } from "react";

const Buscador = () => {
  const inputRef = useRef(null);

  const [busqueda, setBusqueda] = useState("");
  const [indexSeleccionado, setIndexSeleccionado] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [resultados, setResultados] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const ejecutarBusqueda = async () => {
    if (!busqueda.trim()) return;

    if (!navigator.onLine) {
      setError("No hay conexión a internet.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setResultados([]);

      await new Promise((resolve) => setTimeout(resolve, 1500));

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/productos`
      );

      if (!response.ok) {
        throw new Error("Error en la respuesta del servidor");
      }

      const result = await response.json();
      const productos = result.data || result;

      const filtrados = productos.filter((producto) =>
        producto.title
          .toLowerCase()
          .includes(busqueda.toLowerCase())
      );

      setResultados(filtrados);
    } catch {
      setError("Ocurrió un error al obtener los productos.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      setIndexSeleccionado((prev) =>
        prev < resultados.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      setIndexSeleccionado((prev) => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === "Enter") {
      if (indexSeleccionado >= 0) {
        const seleccion = resultados[indexSeleccionado];
        setBusqueda(seleccion.title);
        setIndexSeleccionado(-1);
        return;
      }

      ejecutarBusqueda();
    }
  };

  return (
    <div className="flex flex-col items-center pt-20 px-4 min-h-[calc(100vh-112px)]">
      <h2 className="text-4xl font-bold text-white mb-8 tracking-widest animate-fade-in-up">
        BUSCADOR <span className="text-emerald-500">RAPITI</span>
      </h2>

      <div className="w-full max-w-2xl relative">
        <input
          ref={inputRef}
          type="text"
          disabled={loading}
          aria-disabled={loading}
          placeholder="Buscar producto..."
          value={busqueda}
          aria-label="Buscador de productos"
          onChange={(e) => {
            setBusqueda(e.target.value);
            setIndexSeleccionado(-1);
          }}
          onKeyDown={handleKeyDown}
          className={`w-full bg-neutral-900 border-2 border-neutral-800 text-white px-6 py-4 rounded-2xl outline-none transition-all duration-300 placeholder:text-gray-600
            focus:ring-4 focus:ring-emerald-500
            ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
        />

        {loading && (
          <div
            aria-live="polite"
            className="flex flex-col items-center mt-8"
          >
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent mb-4"></div>
            <p className="text-white font-medium">
              Cargando productos...
            </p>
          </div>
        )}

        {!loading && error && (
          <div
            role="alert"
            className="mt-6 text-center bg-red-900/30 p-6 rounded-xl border border-red-500 animate-scale-in"
          >
            <p className="text-red-400 text-lg mb-4">
              ⚠ {error}
            </p>
            <button
              onClick={ejecutarBusqueda}
              className="bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600 transition focus:ring-4 focus:ring-red-400"
            >
              Reintentar
            </button>
          </div>
        )}

        {!loading && !error && resultados.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            {resultados.map((producto, index) => (
              <div
                key={producto.id}
                tabIndex={0}
                className={`bg-neutral-900 border p-6 rounded-2xl cursor-pointer
                  focus:ring-4 focus:ring-emerald-500 outline-none
                  hover:border-emerald-500/50 hover:-translate-y-1
                  hover:shadow-[0_4px_24px_rgba(16,185,129,0.12)]
                  transition-all duration-300 animate-fade-in-up
                  ${
                    index === indexSeleccionado
                      ? "border-emerald-500"
                      : "border-neutral-800"
                  }`}
                style={{ animationDelay: `${index * 0.07}s` }}
              >
                <img
                  src={producto.image}
                  alt={producto.title}
                  className="h-32 mx-auto object-contain mb-4"
                />
                <h3 className="text-xl font-semibold text-white">
                  {producto.title}
                </h3>
                <p className="text-emerald-400 mt-2">
                  ${producto.price}
                </p>
              </div>
            ))}
          </div>
        )}

        {!loading && !error && resultados.length === 0 && busqueda !== "" && (
          <div className="text-gray-500 mt-6 text-center animate-fade-in">
            No se encontraron resultados.
          </div>
        )}
      </div>
    </div>
  );
};

export default Buscador;