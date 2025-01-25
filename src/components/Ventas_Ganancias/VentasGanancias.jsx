import React, { useState, useEffect } from "react";
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
  PieChart,
  Pie,
  Cell,
} from "recharts";
import dayjs from "dayjs";
import axios from "axios";

const VentasGanancias = () => {
  const [ventas, setVentas] = useState([]);
  const [periodo, setPeriodo] = useState("diario");
  const [fechaInicio, setFechaInicio] = useState(dayjs().format("YYYY-MM-DD"));
  const [fechaFin, setFechaFin] = useState(dayjs().format("YYYY-MM-DD"));
  const [totalVentas, setTotalVentas] = useState(0);
  const [totalGanancias, setTotalGanancias] = useState(0);
  const [productosMasVendidos, setProductosMasVendidos] = useState([]);

  useEffect(() => {
    const obtenerVentas = async () => {
      try {
        let url = "";
        if (periodo === "diario") {
          url = `${
            import.meta.env.VITE_API_URL
          }/ventas/totales/dia?fechaInicio=${fechaInicio}`;
        } else if (periodo === "rango") {
          url = `http://localhost:3000/api/ventas/totales/rango?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`;
        }

        const response = await axios.get(url);
        setVentas(response.data);

        // Calcular la suma total de ventas y ganancias
        const totalVentas = response.data.reduce(
          (sum, venta) => sum + parseFloat(venta.ventas_totales),
          0
        );
        const totalGanancias = response.data.reduce(
          (sum, venta) => sum + parseFloat(venta.ganancia_total),
          0
        );
        setTotalVentas(totalVentas);
        setTotalGanancias(totalGanancias);
      } catch (error) {
        console.error("Error al obtener las ventas:", error);
      }
    };

    const obtenerProductosMasVendidos = async () => {
      try {
        const url = `${
          import.meta.env.VITE_API_URL
        }/ventas/productos-mas-vendidos?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`;
        const response = await axios.get(url);
        setProductosMasVendidos(response.data);
      } catch (error) {
        console.error("Error al obtener los productos más vendidos:", error);
      }
    };

    obtenerVentas();
    obtenerProductosMasVendidos();
  }, [periodo, fechaInicio, fechaFin]);

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

  const data = ventas.map((venta) => ({
    fecha: dayjs(venta.fecha).format("DD/MM/YYYY"),
    ventasTotales: parseFloat(venta.ventas_totales),
    ganancia: parseFloat(venta.ganancia_total),
  }));

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <div className="min-h-screen bg-black/50 text-white p-6">
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
              <option value="rango">Rango</option>
            </select>
          </div>
          {periodo === "diario" && (
            <div className="flex items-center mb-6">
              <label htmlFor="fechaInicio" className="mr-4 text-lg">
                Fecha:
              </label>
              <input
                type="date"
                id="fechaInicio"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
                className="p-2 border border-orange-500 rounded text-black"
              />
            </div>
          )}
          {periodo === "rango" && (
            <div className="flex items-center mb-6">
              <label htmlFor="fechaInicio" className="mr-4 text-lg">
                Fecha Inicio:
              </label>
              <input
                type="date"
                id="fechaInicio"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
                className="p-2 border border-orange-500 rounded text-black"
              />
              <label htmlFor="fechaFin" className="mr-4 text-lg ml-4">
                Fecha Fin:
              </label>
              <input
                type="date"
                id="fechaFin"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
                className="p-2 border border-orange-500 rounded text-black"
              />
            </div>
          )}
        </div>

        {/* Mostrar Totales para el Rango Seleccionado */}
        {periodo === "rango" && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-orange-400 mb-4">
              Totales para el Rango Seleccionado
            </h2>
            <div className="bg-gray-800 text-white rounded-lg p-6">
              <p className="text-lg mb-4">
                <span className="font-bold text-orange-500">
                  Total de Ventas:
                </span>{" "}
                Q{totalVentas.toFixed(2).toLocaleString()}
              </p>
              <p className="text-lg">
                <span className="font-bold text-orange-500">
                  Ganancia Total:
                </span>{" "}
                Q{totalGanancias.toFixed(2).toLocaleString()}
              </p>
            </div>
          </div>
        )}

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
          <div className="bg-gray-800 text-white rounded-lg p-6">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Producto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Ventas
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-700 divide-y divide-gray-600">
                {productosMasVendidos.map((producto) => (
                  <tr key={producto.nombre_producto}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                      {producto.nombre_producto}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      {producto.ventas}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
              Q{resumen.totalVentas.toFixed(2).toLocaleString()}
            </p>
            <p className="text-lg mb-4">
              <span className="font-bold text-orange-500">Ganancia Total:</span>{" "}
              Q{resumen.gananciaTotal.toFixed(2).toLocaleString()}
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
