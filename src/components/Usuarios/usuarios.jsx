import React, { useState, useEffect } from "react";

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [nuevoUsuario, setNuevoUsuario] = useState({
    nombre: "",
    correo: "",
    rol: "",
  });
  const [modoEdicion, setModoEdicion] = useState(null);

  useEffect(() => {
    // Simula una llamada a una API para obtener la lista de usuarios
    const usuariosIniciales = [
      {
        id: 1,
        nombre: "Juan Pérez",
        correo: "juanperez@gmail.com",
        rol: "Admin",
      },
      {
        id: 2,
        nombre: "Ana Gómez",
        correo: "anagomez@gmail.com",
        rol: "Usuario",
      },
    ];
    setUsuarios(usuariosIniciales);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevoUsuario({ ...nuevoUsuario, [name]: value });
  };

  const agregarUsuario = () => {
    if (nuevoUsuario.nombre && nuevoUsuario.correo && nuevoUsuario.rol) {
      setUsuarios([
        ...usuarios,
        { ...nuevoUsuario, id: Date.now() }, // Genera un ID único basado en la fecha actual
      ]);
      setNuevoUsuario({ nombre: "", correo: "", rol: "" });
    } else {
      alert("Por favor, completa todos los campos.");
    }
  };

  const editarUsuario = (id) => {
    const usuarioEditado = usuarios.find((u) => u.id === id);
    setNuevoUsuario(usuarioEditado);
    setModoEdicion(id);
  };

  const guardarEdicion = () => {
    setUsuarios(
      usuarios.map((u) =>
        u.id === modoEdicion ? { ...u, ...nuevoUsuario } : u
      )
    );
    setNuevoUsuario({ nombre: "", correo: "", rol: "" });
    setModoEdicion(null);
  };

  const eliminarUsuario = (id) => {
    setUsuarios(usuarios.filter((u) => u.id !== id));
  };

  return (
    <div className="bg-white text-black p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Gestión de Usuarios</h2>

      {/* Formulario para agregar o editar usuarios */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">
          {modoEdicion ? "Editar Usuario" : "Agregar Nuevo Usuario"}
        </h3>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <input
            type="text"
            name="nombre"
            placeholder="Nombre"
            value={nuevoUsuario.nombre}
            onChange={handleInputChange}
            className="border rounded-lg px-4 py-2"
          />
          <input
            type="email"
            name="correo"
            placeholder="Correo Electrónico"
            value={nuevoUsuario.correo}
            onChange={handleInputChange}
            className="border rounded-lg px-4 py-2"
          />
          <select
            name="rol"
            value={nuevoUsuario.rol}
            onChange={handleInputChange}
            className="border rounded-lg px-4 py-2"
          >
            <option value="">Seleccionar Rol</option>
            <option value="Admin">Admin</option>
            <option value="Usuario">Usuario</option>
          </select>
        </div>
        <button
          onClick={modoEdicion ? guardarEdicion : agregarUsuario}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          {modoEdicion ? "Guardar Cambios" : "Agregar Usuario"}
        </button>
      </div>

      {/* Tabla de usuarios */}
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2">Nombre</th>
            <th className="border border-gray-300 px-4 py-2">
              Correo Electrónico
            </th>
            <th className="border border-gray-300 px-4 py-2">Rol</th>
            <th className="border border-gray-300 px-4 py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((usuario) => (
            <tr key={usuario.id}>
              <td className="border border-gray-300 px-4 py-2">
                {usuario.nombre}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {usuario.correo}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {usuario.rol}
              </td>
              <td className="border border-gray-300 px-4 py-2 space-x-2">
                <button
                  onClick={() => editarUsuario(usuario.id)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600"
                >
                  ✂️
                </button>
                <button
                  onClick={() => eliminarUsuario(usuario.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
                >
                  ❌
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Usuarios;
