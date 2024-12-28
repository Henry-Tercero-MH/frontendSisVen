import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Header from "./components/Header/Header";
import Contenedor from "./components/Container/Container.jsx";
import Facturar from "./pages/Facturacion/Facturacion.jsx";
import styles from "./App.module.css";
import VentasGanancias from "./components/Ventas_Ganancias/VentasGanancias.jsx";
import AdminPanel from "./pages/Productos/Productos.jsx";
import AgregarProductos from "./components/AddProducto/AgregarProducto.jsx";

function App() {
  return (
    <Contenedor>
      <Router>
        <Header />
        <Routes>
          <Route
            path="/"
            element={
              <h1 className={styles.titulo}>¡Hola, bienvenido al Sistema! </h1>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/facturar" element={<Facturar />} />
          <Route path="/ganancias" element={<VentasGanancias />} />
          <Route path="/add" element={<AgregarProductos />} />
        </Routes>
      </Router>
    </Contenedor>
  );
}

export default App;
