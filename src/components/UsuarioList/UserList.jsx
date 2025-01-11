import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "../../components/Modal/Modal"; // Importa el componente Modal

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    password: "",
    rol: "empleado",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error al obtener los usuarios:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/users/${id}`);
      fetchUsers();
    } catch (error) {
      console.error("Error al eliminar el usuario:", error);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user.id_usuario);
    setFormData(user);
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
        `http://localhost:3000/api/users/${editingUser}`,
        formData
      );
      setEditingUser(null);
      fetchUsers();
    } catch (error) {
      console.error("Error al actualizar el usuario:", error);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3000/api/users/register", formData);
      setFormData({ nombre: "", email: "", password: "", rol: "empleado" });
      setShowRegisterModal(false);
      fetchUsers();
    } catch (error) {
      console.error("Error al agregar el usuario:", error);
    }
  };

  const closeModal = () => {
    setEditingUser(null);
    setShowRegisterModal(false);
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-gray-900 text-white p-6 rounded-lg shadow-lg relative">
      <h1 className="text-2xl font-bold mb-5">Lista de Usuarios</h1>
      <button
        onClick={() => setShowRegisterModal(true)}
        className="absolute top-0 right-0 mt-2 mr-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
      >
        Registrar Usuario
      </button>
      <table className="min-w-full bg-gray-800 text-white">
        <thead>
          <tr>
            <th className="py-2">Nombre</th>
            <th className="py-2">Email</th>
            <th className="py-2">Rol</th>
            <th className="py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id_usuario} className="bg-gray-700 hover:bg-gray-600">
              <td className="border px-4 py-2">{user.nombre}</td>
              <td className="border px-4 py-2">{user.email}</td>
              <td className="border px-4 py-2">{user.rol}</td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => handleEdit(user)}
                  className="bg-yellow-500 text-black px-2 py-1 rounded mr-2"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(user.id_usuario)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editingUser && (
        <Modal onClose={closeModal}>
          <h2 className="text-xl font-bold mb-5">Editar Usuario</h2>
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
              <label className="block text-gray-300">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg bg-gray-700 text-white"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-300">Contraseña</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg bg-gray-700 text-white"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-300">Rol</label>
              <select
                name="rol"
                value={formData.rol}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg bg-gray-700 text-white"
              >
                <option value="empleado">Empleado</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
            >
              Actualizar Usuario
            </button>
          </form>
        </Modal>
      )}

      {showRegisterModal && (
        <Modal onClose={closeModal}>
          <h2 className="text-xl font-bold mb-5">Registrar Usuario</h2>
          <form
            onSubmit={handleAdd}
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
              <label className="block text-gray-300">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg bg-gray-700 text-white"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-300">Contraseña</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg bg-gray-700 text-white"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-300">Rol</label>
              <select
                name="rol"
                value={formData.rol}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg bg-gray-700 text-white"
              >
                <option value="empleado">Empleado</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
            >
              Registrar Usuario
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default UsersList;
