import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const AdminPanel = () => {
  const [selectedFunction, setSelectedFunction] = useState("stock");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const handleFunctionChange = (func) => {
    setSelectedFunction(func);
  };

  return (
    <div className="min-h-screen bg-black/50 text-white p-4">
      {/* Barra de navegación */}
      <nav className="flex space-x-4 mb-8 bg-orange-500 p-4 rounded-lg">
        <button
          onClick={() => handleFunctionChange("stock")}
          className={`font-bold px-4 py-2 rounded-lg ${
            selectedFunction === "stock"
              ? "bg-orange-700 text-white"
              : "bg-orange-300 text-black hover:bg-orange-400"
          }`}
        >
          Stock de Productos
        </button>
        <Link
          to="/add"
          className="font-bold px-4 py-2 rounded-lg bg-orange-300 text-black hover:bg-orange-400"
        >
          Agregar Producto
        </Link>
        <Link
          to="/ganancias"
          className="font-bold px-4 py-2 rounded-lg bg-orange-300 text-black hover:bg-orange-400"
        >
          Ver Ganancias
        </Link>
        <button
          onClick={() => handleFunctionChange("usuarios")}
          className={`font-bold px-4 py-2 rounded-lg ${
            selectedFunction === "usuarios"
              ? "bg-orange-700 text-white"
              : "bg-orange-300 text-black hover:bg-orange-400"
          }`}
        >
          Gestión de Usuarios
        </button>
      </nav>

      {/* Contenido dinámico */}
      <div>
        {selectedFunction === "stock" && <Stock />}
        {selectedFunction === "usuarios" && <Usuarios />}
      </div>
    </div>
  );
};

const Stock = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Hacer la petición para obtener los productos desde la API
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/products/");
        setProducts(response.data); // Guardar los productos en el estado
      } catch (err) {
        setError("Hubo un error al obtener los productos.");
      }
    };

    fetchProducts();
  }, []);

  const removeProduct = (barcode) => {
    setProducts(
      products.filter((product) => product.codigo_barras !== barcode)
    );
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 text-orange-400">
        Stock de Productos
      </h1>
      {error && <p className="text-red-500">{error}</p>}
      <table className="w-full bg-white text-black rounded-lg overflow-hidden">
        <thead className="bg-orange-400 text-white">
          <tr>
            <th className="p-2">Producto</th>
            <th className="p-2">Código de Barras</th>
            <th className="p-2">Cantidad</th>
            <th className="p-2">Precio Unitario</th>
            <th className="p-2">Precio de Venta</th>
            <th className="p-2">Fecha de Vencimiento</th>
            <th className="p-2">Eliminar</th>
          </tr>
        </thead>
        <tbody>
          {products.length > 0 ? (
            products.map((product, index) => (
              <tr
                key={index}
                className={`text-center ${
                  index % 2 === 0 ? "bg-orange-100" : "bg-orange-200"
                }`}
              >
                <td className="p-2">{product.nombre_producto}</td>
                <td className="p-2">{product.codigo_barras}</td>
                <td className="p-2">{product.cantidad}</td>
                <td className="p-2">${product.precio_unitario}</td>
                <td className="p-2">${product.precio_venta}</td>
                <td className="p-2">{product.fecha_vencimiento}</td>
                <td className="p-2">
                  <button
                    onClick={() => removeProduct(product.codigo_barras)}
                    className="text-red-500 hover:text-red-700 font-bold"
                  >
                    X
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="p-2 text-center">
                No hay productos en el stock.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

const Usuarios = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold text-orange-400 mb-4">
        Gestión de Usuarios
      </h1>
      <p>Aquí puedes agregar la funcionalidad para gestionar usuarios.</p>
    </div>
  );
};

export default AdminPanel;
