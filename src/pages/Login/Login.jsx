import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../components/AuthContext/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setIsAuthenticated } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/users/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        // console.log("Inicio de sesión exitoso", data);
        localStorage.setItem("authToken", data.token); // Guarda el token
        setIsAuthenticated(true); // Actualiza el estado de autenticación

        // Redirige según el rol del usuario
        if (data.rol === "admin") {
          navigate("/admin");
        } else if (data.rol === "empleado") {
          navigate("/facturar");
        } else {
          // console.error("Rol desconocido");
        }
      } else {
        // console.error("Error en el inicio de sesión", data.message);
      }
    } catch (error) {
      console.error("Error de red", error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen ">
      <div className="w-full max-w-md p-6 bg-black/50 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">Iniciar Sesión</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-semibold mb-2">
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              placeholder="Ingresa tu correo"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-semibold mb-2"
            >
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              placeholder="Ingresa tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-orange-500 text-white font-bold py-2 rounded-lg hover:bg-orange-600 transition"
          >
            Ingresar
          </button>
        </form>
        <p className="mt-4 text-sm text-gray-400 text-center">
          {/* ¿No tienes una cuenta?{" "}
          <a href="/register" className="text-orange-400 hover:underline">
            Regístrate aquí
          </a> */}
        </p>
      </div>
    </div>
  );
};

export default Login;
