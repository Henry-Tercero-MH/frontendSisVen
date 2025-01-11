import React, { useState } from "react";
import axios from "axios";

const AddCliente = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    telefono: "",
    credito: "",
    descripcion_credito: "",
    dpi: "",
    nit: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3000/api/clientes",
        formData
      );
      console.log(response.data);
      alert("Cliente agregado exitosamente");
    } catch (error) {
      console.error("Error al agregar cliente:", error);
      alert("Error al agregar cliente");
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-4">
      <h1 className="text-xl font-bold mb-4 text-center ">Agregar Cliente</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 rounded-lg shadow-md"
      >
        <div className="mb-3">
          <label className="block text-gray-700">Nombre</label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            className="w-full px-2 py-1 border rounded-lg"
            required
          />
        </div>
        <div className="mb-3">
          <label className="block text-gray-700">Teléfono</label>
          <input
            type="text"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            className="w-full px-2 py-1 border rounded-lg"
          />
        </div>
        <div className="mb-3">
          <label className="block text-gray-700">Crédito</label>
          <input
            type="number"
            name="credito"
            value={formData.credito}
            onChange={handleChange}
            className="w-full px-2 py-1 border rounded-lg"
          />
        </div>
        <div className="mb-3">
          <label className="block text-gray-700">Descripción del Crédito</label>
          <textarea
            name="descripcion_credito"
            value={formData.descripcion_credito}
            onChange={handleChange}
            className="w-full px-2 py-1 border rounded-lg"
          />
        </div>
        <div className="mb-3">
          <label className="block text-gray-700">DPI</label>
          <input
            type="text"
            name="dpi"
            value={formData.dpi}
            onChange={handleChange}
            className="w-full px-2 py-1 border rounded-lg"
          />
        </div>
        <div className="mb-3">
          <label className="block text-gray-700">NIT</label>
          <input
            type="text"
            name="nit"
            value={formData.nit}
            onChange={handleChange}
            className="w-full px-2 py-1 border rounded-lg"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
        >
          Agregar Cliente
        </button>
      </form>
    </div>
  );
};

export default AddCliente;
