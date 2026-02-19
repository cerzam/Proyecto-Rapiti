import { useState, useEffect, useRef } from 'react';  

const Buscador = () => {
  const inputRef = useRef(null); 
  const [busqueda, setBusqueda] = useState("");
  const [indexSeleccionado, setIndexSeleccionado] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [resultados, setResultados] = useState([]);
  const [error, setError] = useState(null);

  const sugerenciasIniciales = [
    "React", "Vite", "Tailwind CSS", "JavaScript", "Accesibilidad", "Componentes"
  ];

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const resultadosFiltrados = sugerenciasIniciales.filter((item) =>
    item.toLowerCase().includes(busqueda.toLowerCase())
  );

  const ejecutarBusqueda = () => {
    if (!busqueda.trim()) return;

    setLoading(true);
    setError(null);
    setResultados([]);

    setTimeout(() => {
      if (busqueda.toLowerCase() === "error") {
        setError("Ocurrió un error en la búsqueda.");
        setLoading(false);
        return;
      }

      const encontrados = sugerenciasIniciales.filter((item) =>
        item.toLowerCase().includes(busqueda.toLowerCase())
      );

      setResultados(encontrados);
      setLoading(false);

    }, 1500);
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      setIndexSeleccionado((prev) => 
        prev < resultadosFiltrados.length - 1 ? prev + 1 : prev
      );
    } 
    else if (e.key === "ArrowUp") {
      setIndexSeleccionado((prev) => (prev > 0 ? prev - 1 : 0));
    } 
    else if (e.key === "Enter") {

      // 🔥 CORRECCIÓN PARA QUE PASE EL TEST
      if (indexSeleccionado >= 0) {
        const seleccion = resultadosFiltrados[indexSeleccionado];
        setBusqueda(seleccion);
        setIndexSeleccionado(-1);
        return;
      }

      ejecutarBusqueda();
    }
  };

  return (
    <div className="flex flex-col items-center pt-20 px-4 min-h-[calc(100vh-112px)]">
      <h2 className="text-4xl font-bold text-white mb-8 tracking-widest">
        BUSCADOR <span className="text-emerald-500">RAPITI</span>
      </h2>
      
      <div className="w-full max-w-2xl relative">
        <input 
          ref={inputRef} 
          type="text" 
          disabled={loading}
          aria-disabled={loading}
          placeholder="Escribe para filtrar (ej: React)..."
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

        {busqueda !== "" && !loading && (
          <div className="absolute w-full mt-2 bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden z-10 shadow-2xl">
            {resultadosFiltrados.map((item, index) => (
              <div
                key={index}
                role="option"
                aria-selected={index === indexSeleccionado}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setBusqueda(item);
                    setIndexSeleccionado(-1);
                  }
                }}
                onClick={() => {
                  setBusqueda(item);
                  setIndexSeleccionado(-1);
                }}
                className={`px-6 py-3 text-white cursor-pointer transition-colors border-b border-neutral-800 last:border-none
                  focus:ring-4 focus:ring-emerald-500 outline-none
                  ${index === indexSeleccionado ? "bg-emerald-500/20 text-emerald-400" : "hover:bg-emerald-500/10"}`}
              >
                {item}
              </div>
            ))}
          </div>
        )}

        {loading && (
          <div aria-busy="true" className="flex justify-center mt-8">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent"></div>
          </div>
        )}

        {!loading && error && (
          <div role="alert" className="text-red-500 mt-6 text-center">
            {error}
          </div>
        )}

        {!loading && !error && resultados.length === 0 && busqueda !== "" && (
          <div className="text-gray-500 mt-6 text-center">
            No se encontraron resultados.
          </div>
        )}

        {!loading && !error && resultados.length > 0 && (
          <div aria-live="polite" className="text-gray-400 mt-6 text-center">
            {resultados.length} resultados encontrados
          </div>
        )}

        {!loading && resultados.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            {resultados.map((item, index) => (
              <div
                key={index}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    alert(`Abriendo detalle de ${item}`);
                  }
                }}
                onClick={() => alert(`Abriendo detalle de ${item}`)}
                className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl cursor-pointer
                           focus:ring-4 focus:ring-emerald-500 outline-none
                           hover:border-emerald-500/50 transition-all"
              >
                <h3 className="text-xl font-semibold text-white">{item}</h3>
                <p className="text-gray-400 mt-2">
                  Este es el detalle del producto {item}.
                </p>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default Buscador;
