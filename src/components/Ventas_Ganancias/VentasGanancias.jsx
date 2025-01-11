import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import dayjs from "dayjs";

const VentasGanancias = () => {
  const [ventas, setVentas] = useState([
    { fecha: "2024-12-14", ventasTotales: 10000, ganancia: 3000 },
    { fecha: "2024-12-15", ventasTotales: 12000, ganancia: 3500 },
    { fecha: "2024-12-16", ventasTotales: 8000, ganancia: 2000 },
  ]);

  const [periodo, setPeriodo] = useState("diario");

  const productosMasVendidos = [
    { nombre: "Producto A", ventas: 150 },
    { nombre: "Producto B", ventas: 120 },
    { nombre: "Producto C", ventas: 100 },
  ];

  const ingresosPorCategoria = [
    { categoria: "Bebidas", ingresos: 50000 },
    { categoria: "Lácteos", ingresos: 30000 },
    { categoria: "Golosinas", ingresos: 20000 },
  ];

  const resumen = {
    totalVentas: 150000,
    gananciaTotal: 45000,
    productosEnStock: 500,
  };

  const filtrarVentas = (ventas, periodo) => {
    const hoy = dayjs();
    switch (periodo) {
      case "diario":
        return ventas.filter((venta) => dayjs(venta.fecha).isSame(hoy, "day"));
      case "semanal":
        return ventas.filter((venta) => dayjs(venta.fecha).isSame(hoy, "week"));
      case "mensual":
        return ventas.filter((venta) =>
          dayjs(venta.fecha).isSame(hoy, "month")
        );
      default:
        return ventas;
    }
  };

  const ventasFiltradas = filtrarVentas(ventas, periodo);

  const data = ventasFiltradas.map((venta) => ({
    fecha: dayjs(venta.fecha).format("DD/MM/YYYY"),
    ventasTotales: venta.ventasTotales,
    ganancia: venta.ganancia,
  }));

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <div className="min-h-screen  bg-black/50text-white p-6">
      <h1 className="text-3xl font-bold text-orange-400 mb-6">
        Ventas y Ganancias
      </h1>
      {/* Enlace de navegación */}
      <div className="mb-8">
        <Link
          to="/admin"
          className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-6 rounded transition duration-300"
        >
          Volver a Administrador
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Filtro de Período */}
        <div className="mb-12">
          <div className="flex items-center mb-6">
            <label htmlFor="periodo" className="mr-4 text-lg">
              Periodo:
            </label>
            <select
              id="periodo"
              value={periodo}
              onChange={(e) => setPeriodo(e.target.value)}
              className="p-2 border border-orange-500 rounded text-black"
            >
              <option value="diario">Diario</option>
              <option value="semanal">Semanal</option>
              <option value="mensual">Mensual</option>
            </select>
          </div>
        </div>

        {/* Gráfico de Ventas y Ganancias */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-orange-400 mb-4">
            Gráfico de Ventas y Ganancias
          </h2>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="fecha" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="ventasTotales"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
              />
              <Line type="monotone" dataKey="ganancia" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Productos Más Vendidos */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-orange-400 mb-4">
            Productos Más Vendidos
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={productosMasVendidos}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="nombre" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="ventas" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Ingresos por Categoría */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-orange-400 mb-4">
            Ingresos por Categoría
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={ingresosPorCategoria}
                dataKey="ingresos"
                nameKey="categoria"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {ingresosPorCategoria.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Resumen General */}
        <div>
          <h2 className="text-2xl font-bold text-orange-400 mb-4">
            Resumen General
          </h2>
          <div className="bg-gray-800 text-white rounded-lg p-6">
            <p className="text-lg mb-4">
              <span className="font-bold text-orange-500">
                Total de Ventas:
              </span>{" "}
              ${resumen.totalVentas.toLocaleString()}
            </p>
            <p className="text-lg mb-4">
              <span className="font-bold text-orange-500">Ganancia Total:</span>{" "}
              ${resumen.gananciaTotal.toLocaleString()}
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
    </div>
  );
};

export default VentasGanancias;
