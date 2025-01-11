import React, { useState } from "react";
import AddCliente from "../../components/AddClientes/AddClientes";
import Modal from "../../components/Modal/Modal"; // Importa el componente Modal
import ClientesList from "../../components/CientesList/ClientesList";

const Clientes = () => {
  const [selectedAction, setSelectedAction] = useState(null);

  const handleActionChange = (action) => {
    setSelectedAction(action);
  };

  const closeModal = () => {
    setSelectedAction(null);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Banner */}
      <div className="bg-blue-600 text-white py-6">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Gestión de Clientes</h1>
          </div>
          <div className="relative">
            <button
              onClick={() => handleActionChange("menu")}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg"
            >
              Seleccionar Acción
            </button>
            {selectedAction === "menu" && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10">
                <button
                  onClick={() => handleActionChange("agregarCliente")}
                  className="block w-full text-left px-4 py-2 text-black hover:bg-gray-200"
                >
                  Agregar Cliente
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {selectedAction && selectedAction !== "menu" && (
        <Modal onClose={closeModal}>
          {selectedAction === "agregarCliente" && (
            <div>
              <AddCliente />
            </div>
          )}
        </Modal>
      )}
      <ClientesList></ClientesList>
    </div>
  );
};

export default Clientes;
