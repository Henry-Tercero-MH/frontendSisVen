import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

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
  const [products, setProducts] = useState([
    {
      name: "Coca-Cola",
      barcode: "123456789",
      quantity: 50,
      unitPrice: 10,
      salePrice: 15,
      expiryDate: "16/12/2024",
    },
    {
      name: "Galletas Oreo",
      barcode: "987654321",
      quantity: 30,
      unitPrice: 8,
      salePrice: 12,
      expiryDate: "20/01/2025",
    },
  ]);

  const removeProduct = (barcode) => {
    setProducts(products.filter((product) => product.barcode !== barcode));
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 text-orange-400">
        Stock de Productos
      </h1>
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
          {products.map((product, index) => (
            <tr
              key={index}
              className={`text-center ${
                index % 2 === 0 ? "bg-orange-100" : "bg-orange-200"
              }`}
            >
              <td className="p-2">{product.name}</td>
              <td className="p-2">{product.barcode}</td>
              <td className="p-2">{product.quantity}</td>
              <td className="p-2">${product.unitPrice}</td>
              <td className="p-2">${product.salePrice}</td>
              <td className="p-2">{product.expiryDate}</td>
              <td className="p-2">
                <button
                  onClick={() => removeProduct(product.barcode)}
                  className="text-red-500 hover:text-red-700 font-bold"
                >
                  X
                </button>
              </td>
            </tr>
          ))}
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
