import { useState } from 'react';
import { Link } from 'react-router-dom';

const productosMock = [
  { id: 1, nombre: 'Leche Lala 1L', precio: 28.50, imagen: 'https://arteli.vtexassets.com/arquivos/ids/258200/7501020526066_02.jpg?v=638635810988400000' },
  { id: 2, nombre: 'Pan Bimbo Grande', precio: 45.00, imagen: 'https://www.mayoreototal.mx/cdn/shop/files/Capturadepantalla2024-11-04ala_s_6.29.48a.m._1024x1024@2x.png?v=1730723418' },
  { id: 3, nombre: 'Huevo San Juan 12pz', precio: 52.90, imagen: 'https://res.cloudinary.com/riqra/image/upload/v1668469336/sellers/7/ackv0tvbffgnzzres4pw.jpg' },
  { id: 4, nombre: 'Aceite 123 1L', precio: 38.00, imagen: 'https://carritolatino.com/cdn/shop/files/1_25cb48a4-380d-4a40-9a01-d81b0b13d4ee.png?v=1756873015' },
  { id: 5, nombre: 'Arroz Verde Valle 1kg', precio: 29.50, imagen: 'https://superlavioleta.com/cdn/shop/files/PrecoMexicana140g.png?v=1753108914' },
  { id: 6, nombre: 'Frijoles La Costeña 560g', precio: 22.00, imagen: 'https://www.pidefacilraul.com/cms/wp-content/uploads/2022/09/12-098.jpg' },
];

export default function AdminProducts() {
  const [productos, setProductos] = useState(productosMock);

  const handleEliminar = (id) => {
    if (window.confirm('¿Eliminar este producto?')) {
      setProductos(prev => prev.filter(p => p.id !== id));
    }
  };

  return (
    <div className="min-h-[calc(100vh-112px)] px-6 py-12 max-w-5xl mx-auto">

      {/* ENCABEZADO */}
      <div className="flex items-center justify-between mb-10 animate-fade-in-up">
        <div>
          <h1 className="text-4xl font-bold text-white mb-1">
            Gestión de <span className="text-emerald-400">Productos</span>
          </h1>
          <p className="text-gray-400 text-sm">{productos.length} productos en el catálogo</p>
        </div>
        <Link
          to="/admin/productos/nuevo"
          className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-5 py-3 rounded-2xl transition-all focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-500"
        >
          + Nuevo producto
        </Link>
      </div>

      {/* TABLA */}
      <div className="bg-neutral-900 border-2 border-neutral-800 rounded-2xl overflow-hidden animate-fade-in-up" style={{ animationDelay: '0.07s' }}>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-800 text-gray-400 text-left">
              <th className="px-6 py-4 font-medium">Producto</th>
              <th className="px-6 py-4 font-medium">Precio</th>
              <th className="px-6 py-4 font-medium text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((p, i) => (
              <tr
                key={p.id}
                className="border-b border-neutral-800 last:border-0 hover:bg-neutral-800/40 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={p.imagen}
                      alt={p.nombre}
                      className="w-12 h-12 object-contain rounded-xl bg-neutral-800"
                    />
                    <span className="text-white font-medium">{p.nombre}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-emerald-400 font-semibold">
                  ${p.precio.toFixed(2)}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-3">
                    <Link
                      to={`/admin/productos/editar/${p.id}`}
                      className="text-gray-400 hover:text-white border border-neutral-700 hover:border-neutral-500 px-4 py-2 rounded-xl transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                    >
                      Editar
                    </Link>
                    <button
                      onClick={() => handleEliminar(p.id)}
                      className="text-red-400 hover:text-white hover:bg-red-500 border border-red-500/40 hover:border-red-500 px-4 py-2 rounded-xl transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {productos.length === 0 && (
          <div className="text-center py-16 text-gray-500">
            No hay productos. <Link to="/admin/productos/nuevo" className="text-emerald-400 hover:underline">Agrega uno.</Link>
          </div>
        )}
      </div>

    </div>
  );
}
