import React, { useState } from "react";
import axios from "axios"; // Asegúrate de instalar Axios

const Register = () => {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState("empleado");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nombre || !email || !password) {
      setError("Por favor ingrese todos los campos.");
      return;
    }

    try {
      // Realiza la solicitud de registro al servidor
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/users/register`,
        {
          nombre,
          email,
          password,
          rol,
        }
      );

      setSuccess("Usuario registrado exitosamente.");
      setError(""); // Limpia el mensaje de error
    } catch (err) {
      setError("Hubo un error al registrar el usuario.");
      setSuccess(""); // Limpia el mensaje de éxito
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen ">
      <div className="w-full max-w-md p-6 bg-black/50 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center">Registrar Usuario</h2>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label>Nombre</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Nombre completo"
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label>Correo Electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Correo electrónico"
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label>Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label>Rol</label>
            <select
              value={rol}
              onChange={(e) => setRol(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="empleado">Empleado</option>
              <option value="admin">Administrador</option>
            </select>
          </div>
          {error && <p className="text-red-500">{error}</p>}
          {success && <p className="text-green-500">{success}</p>}
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white rounded"
          >
            Registrar
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
