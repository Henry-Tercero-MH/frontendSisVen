import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "../../components/Modal/Modal"; // Importa el componente Modal

const ClientesList = () => {
  const [clientes, setClientes] = useState([]);
  const [editingCliente, setEditingCliente] = useState(null);
  const [formData, setFormData] = useState({
    nombre: "",
    telefono: "",
    credito: "",
    descripcion_credito: "",
    dpi: "",
    nit: "",
  });

  useEffect(() => {
    fetchClientes();
  }, []);

  const fetchClientes = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/clientes");
      setClientes(response.data);
    } catch (error) {
      console.error("Error al obtener los clientes:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/clientes/${id}`);
      fetchClientes();
    } catch (error) {
      console.error("Error al eliminar el cliente:", error);
    }
  };

  const handleEdit = (cliente) => {
    setEditingCliente(cliente.id_cliente);
    setFormData(cliente);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:3000/api/clientes/${editingCliente}`,
        formData
      );
      setEditingCliente(null);
      fetchClientes();
    } catch (error) {
      console.error("Error al actualizar el cliente:", error);
    }
  };

  const closeModal = () => {
    setEditingCliente(null);
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-gray-900 text-white p-6 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-5">Lista de Clientes</h1>
      <table className="min-w-full bg-gray-800 text-white">
        <thead>
          <tr>
            <th className="py-2">Nombre</th>
            <th className="py-2">Teléfono</th>
            <th className="py-2">Crédito</th>
            <th className="py-2">DPI</th>
            <th className="py-2">NIT</th>
            <th className="py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map((cliente) => (
            <tr
              key={cliente.id_cliente}
              className="bg-gray-700 hover:bg-gray-600"
            >
              <td className="border px-4 py-2">{cliente.nombre}</td>
              <td className="border px-4 py-2">{cliente.telefono}</td>
              <td className="border px-4 py-2">{cliente.credito}</td>
              <td className="border px-4 py-2">{cliente.dpi}</td>
              <td className="border px-4 py-2">{cliente.nit}</td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => handleEdit(cliente)}
                  className="bg-yellow-500 text-black px-2 py-1 rounded mr-2"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(cliente.id_cliente)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editingCliente && (
        <Modal onClose={closeModal}>
          <h2 className="text-xl font-bold mb-5">Editar Cliente</h2>
          <form
            onSubmit={handleUpdate}
            className="bg-gray-800 p-6 rounded-lg shadow-md"
          >
            <div className="mb-4">
              <label className="block text-gray-300">Nombre</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg bg-gray-700 text-white"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-300">Teléfono</label>
              <input
                type="text"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg bg-gray-700 text-white"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-300">Crédito</label>
              <input
                type="number"
                name="credito"
                value={formData.credito}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg bg-gray-700 text-white"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-300">
                Descripción del Crédito
              </label>
              <textarea
                name="descripcion_credito"
                value={formData.descripcion_credito}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg bg-gray-700 text-white"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-300">DPI</label>
              <input
                type="text"
                name="dpi"
                value={formData.dpi}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg bg-gray-700 text-white"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-300">NIT</label>
              <input
                type="text"
                name="nit"
                value={formData.nit}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg bg-gray-700 text-white"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
            >
              Actualizar Cliente
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default ClientesList;
