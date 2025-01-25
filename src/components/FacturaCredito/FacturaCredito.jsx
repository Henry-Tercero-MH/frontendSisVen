import React, { useState, useEffect } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";

const FacturaCredito = () => {
  const [clientId, setClientId] = useState("");
  const [factura, setFactura] = useState(null);
  const [clients, setClients] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [abono, setAbono] = useState(""); // Nuevo estado para el abono

  const fetchClients = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/clientes`
      );
      setClients(response.data);
      console.log("Clientes:", response.data);
    } catch (error) {
      console.error("Error al obtener los clientes:", error);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchFactura = async () => {
    try {
      console.log("Fetching factura for client ID:", clientId);
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/clientes/${clientId}/factura-credito`
      );
      setFactura(response.data);
      setError(""); // Clear any previous error
      console.log("Factura data:", response.data);
    } catch (error) {
      console.error("Error fetching factura:", error);
      setError("El cliente no existe o no tiene facturas disponibles.");
      setFactura(null); // Clear any previous factura
    }
  };

  const handleClientChange = (e) => {
    const selectedClientId = e.target.value ? parseInt(e.target.value, 10) : "";
    console.log("Selected client ID:", selectedClientId);
    setClientId(selectedClientId);
    setFactura(null); // Clear any previous factura
    setError(""); // Clear any previous error
    setSuccess(""); // Clear any previous success message
  };

  const handleAbonoChange = (e) => {
    setAbono(e.target.value);
  };

  const handleAbono = async () => {
    try {
      const abonoAmount = parseFloat(abono);
      if (isNaN(abonoAmount) || abonoAmount <= 0) {
        setError("Por favor, ingrese un monto de abono válido.");
        return;
      }

      const cliente = clients.find((client) => client.id_cliente === clientId);
      const nuevoAbono = parseFloat(cliente.abonos) + abonoAmount;

      await axios.put(`${import.meta.env.VITE_API_URL}/clientes/${clientId}`, {
        abonos: nuevoAbono,
      });

      console.log("Cliente actualizado con nuevo abono:", nuevoAbono);
      fetchClients(); // Actualiza la lista de clientes
      setSuccess("El abono fue exitoso."); // Set success message
      setAbono(""); // Clear abono input
    } catch (error) {
      console.error("Error al realizar el abono:", error);
      setError("Hubo un error al realizar el abono.");
    }
  };

  const deleteFacturas = async () => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/facturas/cliente/${clientId}`
      );
      console.log(`Facturas del cliente ${clientId} eliminadas`);
    } catch (error) {
      console.error("Error al eliminar las facturas del cliente:", error);
    }
  };

  const handleUpdate = async () => {
    try {
      await deleteFacturas(); // Eliminar las facturas del cliente
      const cliente = clients.find((client) => client.id_cliente === clientId);
      const nuevoCredito =
        parseFloat(cliente.credito) + parseFloat(factura.totalFactura);
      await axios.put(`${import.meta.env.VITE_API_URL}/clientes/${clientId}`, {
        credito: nuevoCredito,
      });
      console.log("Cliente actualizado con nuevo crédito:", nuevoCredito);
      fetchClients(); // Actualiza la lista de clientes
      setSuccess("La facturación fue exitosa."); // Set success message
    } catch (error) {
      console.error("Error al actualizar el cliente:", error);
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Factura de Cliente", 20, 10);
    doc.autoTable({
      head: [["Producto", "Cantidad", "Precio Unitario", "Precio Total"]],
      body: factura.detalles.map((item) => [
        item.nombre_producto,
        item.cantidad,
        item.precio_venta,
        item.precio_total,
      ]),
    });
    doc.text(
      `Total Factura: Q${factura.totalFactura}`,
      20,
      doc.autoTable.previous.finalY + 10
    );
    doc.text(
      `Total con Interés: Q${factura.totalConInteres}`,
      20,
      doc.autoTable.previous.finalY + 20
    );
    doc.text(
      `Total con Abono: Q${factura.totalConAbono}`,
      20,
      doc.autoTable.previous.finalY + 30
    );
    doc.save("factura.pdf");
  };

  return (
    <div className="bg-gray-900 text-white p-6 rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Factura de Cliente</h1>
      <div className="mb-4">
        <label
          htmlFor="clientId"
          className="block text-sm font-medium text-gray-300"
        >
          Seleccionar Cliente
        </label>
        <select
          id="clientId"
          value={clientId}
          onChange={handleClientChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-800 text-white"
        >
          <option value="">Seleccione un cliente</option>
          {clients.map((client) => (
            <option key={client.id_cliente} value={client.id_cliente}>
              {client.nombre}
            </option>
          ))}
        </select>
      </div>
      <button
        onClick={fetchFactura}
        className="bg-blue-500 text-white px-4 py-2 rounded-md"
      >
        Obtener Factura
      </button>
      {error && (
        <div className="mt-4 bg-red-500 text-white p-2 rounded">{error}</div>
      )}
      {success && (
        <div className="mt-4 bg-green-500 text-white p-2 rounded">
          {success}
        </div>
      )}
      {factura && (
        <div id="facturaDetails" className="mt-6 overflow-y-auto max-h-96">
          <h2 className="text-xl font-bold mb-2">Detalles de la Factura</h2>
          <table className="min-w-full bg-gray-800 text-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b border-gray-700">Producto</th>
                <th className="py-2 px-4 border-b border-gray-700">Cantidad</th>
                <th className="py-2 px-4 border-b border-gray-700">
                  Precio Unitario
                </th>
                <th className="py-2 px-4 border-b border-gray-700">
                  Precio Total
                </th>
              </tr>
            </thead>
            <tbody>
              {factura.detalles.map((item, index) => (
                <tr key={index}>
                  <td className="py-2 px-4 border-b border-gray-700">
                    {item.nombre_producto}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-700">
                    {item.cantidad}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-700">
                    {item.precio_venta}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-700">
                    {item.precio_total}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-4">
            <p className="text-lg font-bold">
              Total Factura: <span>Q{factura.totalFactura}</span>
            </p>
            <p className="text-lg font-bold">
              Total con Interés: <span>Q{factura.totalConInteres}</span>
            </p>
            <p className="text-lg font-bold">
              Total con Abono: <span>Q{factura.totalConAbono}</span>
            </p>
          </div>
          <div className="flex space-x-4 mt-4">
            <button
              onClick={downloadPDF}
              className="bg-green-500 text-white px-4 py-2 rounded-md"
            >
              Descargar PDF
            </button>
            <button
              onClick={handleUpdate}
              className="bg-yellow-500 text-white px-4 py-2 rounded-md"
            >
              Facturar
            </button>
          </div>
          <div className="mt-4">
            <label
              htmlFor="abono"
              className="block text-sm font-medium text-gray-300"
            >
              Monto del Abono
            </label>
            <input
              type="number"
              id="abono"
              value={abono}
              onChange={handleAbonoChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-800 text-white"
            />
            <button
              onClick={handleAbono}
              className="bg-blue-500 text-white px-4 py-2 rounded-md mt-2"
            >
              Realizar Abono
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacturaCredito;
