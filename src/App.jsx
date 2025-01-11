import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Header from "./components/Header/Header";
import Contenedor from "./components/Container/Container.jsx";
import Facturar from "./pages/Facturacion/Facturacion.jsx";
import VentasGanancias from "./components/Ventas_Ganancias/VentasGanancias.jsx";
import AdminPanel from "./pages/Productos/Productos.jsx";
import AgregarProductos from "./components/AddProducto/AgregarProducto.jsx";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute.jsx";
import { AuthProvider } from "./components/AuthContext/AuthContext.jsx";

function App() {
  return (
    <AuthProvider>
      <Contenedor>
        <Router>
          <Header />
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/admin"
              element={<ProtectedRoute element={AdminPanel} />}
            />
            <Route
              path="/facturar"
              element={<ProtectedRoute element={Facturar} />}
            />
            <Route
              path="/ganancias"
              element={<ProtectedRoute element={VentasGanancias} />}
            />
            <Route
              path="/add"
              element={<ProtectedRoute element={AgregarProductos} />}
            />
          </Routes>
        </Router>
      </Contenedor>
    </AuthProvider>
  );  
}

export default App;
