import React, { useState } from "react";
import { Link } from "react-router-dom";

const VentasGanancias = () => {
  const [ventas, setVentas] = useState([
    { fecha: "14/12/2024", ventasTotales: 10000, ganancia: 3000 },
  ]);

  const resumen = {
    totalVentas: 150000,
    gananciaTotal: 45000,
    productosEnStock: 500,
  };

  return (
    <div className="min-h-screen bg-black/50 text-white p-4">
      <h1 className="text-2xl font-bold text-orange-400 mb-4">
        Ventas y Ganancias
      </h1>
      {/* Enlace de navegación */}
      <div className="mb-6">
        <Link
          to="/admin"
          className="bg-orange-400 hover:bg-orange-500 text-white font-bold py-2 px-4 rounded"
        >
          Volver a Administrador
        </Link>
      </div>

      {/* Tabla de Ventas */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <label htmlFor="periodo" className="mr-2">
            Periodo:
          </label>
          <select
            id="periodo"
            className="p-2 border border-orange-400 rounded text-black"
          >
            <option value="diario">Diario</option>
            <option value="semanal">Semanal</option>
            <option value="mensual">Mensual</option>
          </select>
          <button className="ml-4 bg-orange-400 hover:bg-orange-500 text-white font-bold py-2 px-4 rounded">
            Filtrar
          </button>
        </div>
        <table className="w-full bg-white text-black rounded-lg overflow-hidden">
          <thead className="bg-orange-400 text-white">
            <tr>
              <th className="p-2">Fecha</th>
              <th className="p-2">Ventas Totales</th>
              <th className="p-2">Ganancia</th>
            </tr>
          </thead>
          <tbody>
            {ventas.map((venta, index) => (
              <tr
                key={index}
                className={`text-center ${
                  index % 2 === 0 ? "bg-orange-100" : "bg-orange-200"
                }`}
              >
                <td className="p-2">{venta.fecha}</td>
                <td className="p-2">${venta.ventasTotales.toLocaleString()}</td>
                <td className="p-2">${venta.ganancia.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Resumen General */}
      <div>
        <h1 className="text-2xl font-bold text-orange-400 mb-4">
          Resumen General
        </h1>
        <div className="bg-white text-black rounded-lg p-4">
          <p className="text-lg mb-2">
            <span className="font-bold text-orange-500">Total de Ventas:</span>{" "}
            ${resumen.totalVentas.toLocaleString()}
          </p>
          <p className="text-lg mb-2">
            <span className="font-bold text-orange-500">Ganancia Total:</span> $
            {resumen.gananciaTotal.toLocaleString()}
          </p>
          <p className="text-lg">
            <span className="font-bold text-orange-500">
              Productos en Stock:
            </span>{" "}
            {resumen.productosEnStock}
          </p>
        </div>
      </div>
    </div>
  );
};

export default VentasGanancias;
