import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Stock from "../../components/Stock/stock.jsx"; // Importamos el nuevo componente Stock
import Usuarios from "../../components/Usuarios/usuarios.jsx"; // Si tienes otros componentes, asegúrate de importarlos

// Componente de navegación
const Navigation = ({ selectedFunction, handleFunctionChange }) => (
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
);

// Componente AdminPanel
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
      <Navigation
        selectedFunction={selectedFunction}
        handleFunctionChange={handleFunctionChange}
      />

      {/* Contenido dinámico */}
      <div>
        {selectedFunction === "stock" && <Stock />}
        {selectedFunction === "usuarios" && <Usuarios />}
        {/* Aquí puedes añadir más secciones según sea necesario */}
      </div>
    </div>
  );
};

export default AdminPanel;
