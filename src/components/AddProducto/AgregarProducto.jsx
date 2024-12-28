import React, { useState } from "react";
import { Link } from "react-router-dom";

const AgregarProductos = () => {
  const [productos, setProductos] = useState([]);
  const [nuevoProducto, setNuevoProducto] = useState({
    producto: "",
    codigoBarras: "",
    cantidad: "",
    precioUnitario: "",
    precioVenta: "",
    fechaVencimiento: "",
  });

  const handleChange = (e) => {
    setNuevoProducto({ ...nuevoProducto, [e.target.name]: e.target.value });
  };

  const handleAgregarProducto = (e) => {
    e.preventDefault();
    const {
      producto,
      codigoBarras,
      cantidad,
      precioUnitario,
      precioVenta,
      fechaVencimiento,
    } = nuevoProducto;

    if (
      producto &&
      codigoBarras &&
      cantidad &&
      precioUnitario &&
      precioVenta &&
      fechaVencimiento
    ) {
      setProductos([...productos, nuevoProducto]);
      setNuevoProducto({
        producto: "",
        codigoBarras: "",
        cantidad: "",
        precioUnitario: "",
        precioVenta: "",
        fechaVencimiento: "",
      });
    } else {
      alert("Por favor, completa todos los campos.");
    }
  };

  return (
    <div className="min-h-screen bg-black/50 text-white p-4">
      <div className="mb-6">
        <Link
          to="/admin"
          className="bg-orange-400 hover:bg-orange-500 text-white font-bold py-2 px-4 rounded"
        >
          Volver a Administrador
        </Link>
      </div>
      <div className="text-2xl font-bold mb-4 text-orange-400">
        <h1 className="text-3xl font-semibold text-gray-700 mb-8">
          Agregar Productos
        </h1>
        <form onSubmit={handleAgregarProducto}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/** Formulario */}
            {[
              { label: "Producto", name: "producto", type: "text" },
              { label: "Código de Barras", name: "codigoBarras", type: "text" },
              { label: "Cantidad", name: "cantidad", type: "number" },
              {
                label: "Precio Unitario",
                name: "precioUnitario",
                type: "number",
              },
              { label: "Precio Venta", name: "precioVenta", type: "number" },
            ].map(({ label, name, type }) => (
              <div key={name}>
                <label
                  htmlFor={name}
                  className="block text-gray-600 font-medium mb-2"
                >
                  {label}:
                </label>
                <input
                  type={type}
                  id={name}
                  name={name}
                  value={nuevoProducto[name]}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-400"
                  placeholder={`Ej. ${
                    name === "producto"
                      ? "Galletas Oreo"
                      : name === "cantidad"
                      ? "20"
                      : "750XXXX"
                  }`}
                />
              </div>
            ))}
            <div>
              <label
                htmlFor="fechaVencimiento"
                className="block text-gray-600 font-medium mb-2"
              >
                Fecha de Vencimiento:
              </label>
              <input
                type="date"
                id="fechaVencimiento"
                name="fechaVencimiento"
                value={nuevoProducto.fechaVencimiento}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-400"
              />
            </div>
          </div>
          <button
            type="submit"
            className="mt-6 w-full bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 transition duration-300"
          >
            Agregar Producto
          </button>
        </form>
      </div>

      {/* Lista de productos */}
      <div className="max-w-7xl mx-auto mt-8 bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Productos Agregados
        </h2>
        <div className="overflow-auto">
          <table className="w-full table-auto border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                {[
                  "Producto",
                  "Código de Barras",
                  "Cantidad",
                  "Precio Unitario",
                  "Precio Venta",
                  "Fecha de Vencimiento",
                ].map((header) => (
                  <th
                    key={header}
                    className="p-3 border border-gray-300 text-left"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {productos.map((producto, index) => (
                <tr
                  key={index}
                  className={`text-center ${
                    index % 2 === 0 ? "bg-gray-50" : "bg-gray-100"
                  }`}
                >
                  <td className="p-3 border border-gray-300">
                    {producto.producto}
                  </td>
                  <td className="p-3 border border-gray-300">
                    {producto.codigoBarras}
                  </td>
                  <td className="p-3 border border-gray-300">
                    {producto.cantidad}
                  </td>
                  <td className="p-3 border border-gray-300">
                    ${producto.precioUnitario}
                  </td>
                  <td className="p-3 border border-gray-300">
                    ${producto.precioVenta}
                  </td>
                  <td className="p-3 border border-gray-300">
                    {producto.fechaVencimiento}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AgregarProductos;
