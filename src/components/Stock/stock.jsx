import React, { useState, useEffect } from "react";
import axios from "axios";

const Stock = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [newValues, setNewValues] = useState({
    nombre_producto: "",
    cantidad: "",
    precio_unitario: "",
    precio_venta: "",
    categoria: "",
  });
  const [filter, setFilter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/products/");
        setProducts(response.data);
        setLoading(false);
      } catch (err) {
        setError("Hubo un error al obtener los productos.");
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const removeProduct = async (barcode) => {
    try {
      await axios.delete(`http://localhost:3000/api/products/${barcode}`);
      setProducts(
        products.filter((product) => product.codigo_barras !== barcode)
      );
    } catch (err) {
      setError("Hubo un error al eliminar el producto.");
    }
  };

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setNewValues({
      nombre_producto: product.nombre_producto,
      cantidad: product.cantidad,
      precio_unitario: product.precio_unitario,
      precio_venta: product.precio_venta,
      categoria: product.categoria,
    });
    setIsModalOpen(true);
  };

  const handleSaveClick = async () => {
    try {
      // Formatear la fecha antes de enviarla
      const formatDateForDb = (date) => {
        const d = new Date(date);
        return d.toISOString().split("T")[0]; // Devuelve solo la fecha en formato YYYY-MM-DD
      };

      // Asegurarse de que la fecha que se enviará al backend esté en el formato correcto
      const updatedProduct = {
        ...newValues,
        fecha_vencimiento: formatDateForDb(editingProduct.fecha_vencimiento), // Convertir la fecha al formato correcto
      };

      await axios.put(
        `http://localhost:3000/api/products/${editingProduct.codigo_barras}`,
        updatedProduct
      );

      setProducts(
        products.map((product) =>
          product.codigo_barras === editingProduct.codigo_barras
            ? { ...product, ...newValues }
            : product
        )
      );
      setIsModalOpen(false);
      setEditingProduct(null);
    } catch (err) {
      setError("Hubo un error al actualizar el producto.");
    }
  };

  const filteredProducts = products.filter(
    (product) =>
      product.categoria.toLowerCase().includes(filter.toLowerCase()) ||
      product.nombre_producto.toLowerCase().includes(filter.toLowerCase()) ||
      product.codigo_barras.includes(filter)
  );

  const formatDate = (date) => {
    const d = new Date(date);
    const day = ("0" + d.getDate()).slice(-2);
    const month = ("0" + (d.getMonth() + 1)).slice(-2); // Los meses en JavaScript comienzan en 0
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const checkExpiration = (expirationDate) => {
    const today = new Date();
    const expiration = new Date(expirationDate);
    const timeDifference = expiration - today;
    const daysDifference = timeDifference / (1000 * 3600 * 24);
    return daysDifference <= 10; // Si el producto vence en 10 días o menos
  };

  if (loading) return <p>Cargando productos...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 text-orange-400">
        Stock de Productos
      </h1>
      {error && <p className="text-red-500">{error}</p>}

      <input
        type="text"
        placeholder="Filtrar por código, nombre o categoría"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="mb-4 p-2 border rounded"
      />

      <table className="w-full bg-white text-black rounded-lg overflow-hidden">
        <thead className="bg-orange-400 text-white">
          <tr>
            <th className="p-2">Producto</th>
            <th className="p-2">Código de Barras</th>
            <th className="p-2">Cantidad</th>
            <th className="p-2">Precio Unitario</th>
            <th className="p-2">Precio de Venta</th>
            <th className="p-2">Ganancia/Unidad</th>
            <th className="p-2">Categoría</th>
            <th className="p-2">Fecha de Vencimiento</th>
            <th className="p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product, index) => {
              const ganancia = product.precio_venta - product.precio_unitario;
              const isExpiring = checkExpiration(product.fecha_vencimiento);

              return (
                <tr
                  key={index}
                  className={`text-center ${
                    index % 2 === 0 ? "bg-orange-100" : "bg-orange-200"
                  }`}
                >
                  <td className="p-2">{product.nombre_producto}</td>
                  <td className="p-2">{product.codigo_barras}</td>
                  <td className="p-2">{product.cantidad}</td>
                  <td className="p-2">Q.{product.precio_unitario}</td>
                  <td className="p-2">Q.{product.precio_venta}</td>
                  <td className="p-2">Q.{ganancia.toFixed(2)}</td>
                  <td className="p-2">{product.categoria}</td>
                  <td className={`p-2 ${isExpiring ? "bg-yellow-400" : ""}`}>
                    {formatDate(product.fecha_vencimiento)}
                  </td>
                  <td className="p-2">
                    <button
                      onClick={() => removeProduct(product.codigo_barras)}
                      className="text-red-500"
                    >
                      ❌
                    </button>
                    <button
                      onClick={() => handleEditClick(product)}
                      className="text-blue-500"
                    >
                      ✂️
                    </button>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="9" className="text-center p-4">
                No hay productos disponibles.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modal para edición */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-black p-6 rounded-lg w-1/2">
            <h2 className="text-xl font-bold mb-4">Editar Producto</h2>
            <div className="mb-4">
              <label className="block mb-2">Nombre Producto</label>
              <input
                type="text"
                value={newValues.nombre_producto}
                onChange={(e) =>
                  setNewValues({
                    ...newValues,
                    nombre_producto: e.target.value,
                  })
                }
                className="p-2 w-full border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">Cantidad</label>
              <input
                type="number"
                value={newValues.cantidad}
                onChange={(e) =>
                  setNewValues({
                    ...newValues,
                    cantidad: e.target.value,
                  })
                }
                className="p-2 w-full border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">Precio Unitario</label>
              <input
                type="number"
                value={newValues.precio_unitario}
                onChange={(e) =>
                  setNewValues({
                    ...newValues,
                    precio_unitario: e.target.value,
                  })
                }
                className="p-2 w-full border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">Precio de Venta</label>
              <input
                type="number"
                value={newValues.precio_venta}
                onChange={(e) =>
                  setNewValues({
                    ...newValues,
                    precio_venta: e.target.value,
                  })
                }
                className="p-2 w-full border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">Categoría</label>
              <input
                type="text"
                value={newValues.categoria}
                onChange={(e) =>
                  setNewValues({
                    ...newValues,
                    categoria: e.target.value,
                  })
                }
                className="p-2 w-full border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">Fecha de Vencimiento</label>
              <p className="p-2">
                {formatDate(editingProduct.fecha_vencimiento)}
              </p>
            </div>
            <div className="flex justify-between">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-400 text-white p-2 rounded"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveClick}
                className="bg-blue-500 text-white p-2 rounded"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Stock;
