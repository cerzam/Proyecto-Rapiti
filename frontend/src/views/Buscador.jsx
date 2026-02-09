import { useState, useEffect, useRef } from 'react'; 

const Buscador = () => {
  const inputRef = useRef(null); 
  const [busqueda, setBusqueda] = useState("");
  const [indexSeleccionado, setIndexSeleccionado] = useState(-1);

  const sugerenciasIniciales = [
    "React", "Vite", "Tailwind CSS", "JavaScript", "Accesibilidad", "Componentes"
  ];

  // poner el foco automáticamente al cargar
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const resultadosFiltrados = sugerenciasIniciales.filter((item) =>
    item.toLowerCase().includes(busqueda.toLowerCase())
  );

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      setIndexSeleccionado((prev) => 
        prev < resultadosFiltrados.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      setIndexSeleccionado((prev) => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === "Enter") {
      if (indexSeleccionado >= 0 && indexSeleccionado < resultadosFiltrados.length) {
        setBusqueda(resultadosFiltrados[indexSeleccionado]);
        setIndexSeleccionado(-1);
      }
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
          placeholder="Escribe para filtrar (ej: React)..." 
          value={busqueda}
          onChange={(e) => {
            setBusqueda(e.target.value);
            setIndexSeleccionado(-1);
          }}
          onKeyDown={handleKeyDown}
          className="w-full bg-neutral-900 border-2 border-neutral-800 text-white px-6 py-4 rounded-2xl outline-none focus:border-emerald-500/50 focus:shadow-[0_0_20px_rgba(16,185,129,0.1)] transition-all duration-300 placeholder:text-gray-600"
        />

        {busqueda !== "" && (
          <div className="absolute w-full mt-2 bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden z-10 shadow-2xl">
            {resultadosFiltrados.map((item, index) => (
              <div 
                key={index}
                className={`px-6 py-3 text-white cursor-pointer transition-colors border-b border-neutral-800 last:border-none
                  ${index === indexSeleccionado ? "bg-emerald-500/20 text-emerald-400" : "hover:bg-emerald-500/10"}
                `}
                onClick={() => {
                  setBusqueda(item);
                  setIndexSeleccionado(-1);
                }}
              >
                {item}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Buscador;