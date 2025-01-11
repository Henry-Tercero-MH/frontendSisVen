import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useContext,
} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../components/AuthContext/AuthContext";
import styles from "./Facturar.module.css";

const Facturar = () => {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [cash, setCash] = useState("");
  const [notification, setNotification] = useState("");
  const [products, setProducts] = useState([]);
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(""); // Valor inicial vacío
  const [paymentType, setPaymentType] = useState("contado");
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isBarcodeSearch, setIsBarcodeSearch] = useState(false);
  const [debounceTimer, setDebounceTimer] = useState(null);
  const cartRef = useRef(null); // Referencia al contenedor del carrito
  const { setIsAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const categories = [
    "Bebidas",
    "Granos Básicos",
    "Golosinas",
    "Lácteos",
    "Pastas",
  ];

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/products");
      setProducts(response.data);
    } catch (error) {
      console.error("Error al obtener los productos:", error);
    }
  };

  const fetchClients = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/clientes");
      setClients(response.data);
    } catch (error) {
      console.error("Error al obtener los clientes:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchClients();
  }, []);

  const total = cartItems.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );
  const change = cash ? (parseFloat(cash) - total).toFixed(2) : "0.00";

  const handleNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(""), 3000);
  };

  const addToCart = (product) => {
    const { id_producto, nombre_producto, precio_venta, categoria, cantidad } =
      product;
    const existingItem = cartItems.find((item) => item.id === id_producto);

    if (cantidad <= 0) {
      handleNotification("Ups, parece que este producto se agoto.");
      return;
    }

    if (existingItem) {
      if (existingItem.quantity >= cantidad) {
        handleNotification("Ups, parece que los productos son insuficientes.");
        return;
      }
      setCartItems(
        cartItems.map((item) =>
          item.id === id_producto
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCartItems([
        ...cartItems,
        {
          id: id_producto,
          name: nombre_producto,
          price: precio_venta,
          category: categoria,
          quantity: 1,
        },
      ]);
    }

    const updatedProducts = [...products];
    const productIndex = updatedProducts.findIndex(
      (item) => item.id_producto === id_producto
    );

    if (productIndex !== -1 && updatedProducts[productIndex].cantidad > 0) {
      updatedProducts[productIndex].cantidad -= 1;
      setProducts(updatedProducts);
    }

    // Desplazar el scroll hacia el último elemento agregado
    setTimeout(() => {
      if (cartRef.current) {
        cartRef.current.scrollTop = cartRef.current.scrollHeight;
      }
    }, 100);
  };

  const removeFromCart = (productName) => {
    setCartItems((prevCartItems) => {
      const updatedCartItems = prevCartItems.filter(
        (item) => item.name !== productName
      );

      const updatedProducts = [...products];
      const productIndex = updatedProducts.findIndex(
        (item) => item.nombre_producto === productName
      );
      if (productIndex !== -1) {
        updatedProducts[productIndex].cantidad += 1;
        setProducts(updatedProducts);
      }
      return updatedCartItems;
    });
  };

  const updateQuantity = (productId, newQuantity) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === productId
          ? { ...item, quantity: Math.max(1, newQuantity) }
          : item
      )
    );
  };

  const updateClientCredit = async (clientId, newCredit) => {
    try {
      await axios.put(`http://localhost:3000/api/clientes/${clientId}`, {
        credito: newCredit,
      });
    } catch (error) {
      console.error("Error al actualizar el crédito del cliente:", error);
    }
  };

  const handlePayment = async () => {
    if (!cartItems.length) {
      handleNotification("El carrito está vacío.");
      return;
    }

    if (paymentType === "contado" && (!cash || parseFloat(cash) < total)) {
      handleNotification("El efectivo es insuficiente.");
      return;
    }

    const detalles = cartItems.map((item) => ({
      id_producto: parseInt(item.id),
      cantidad: parseInt(item.quantity),
      precio_unitario: parseFloat(item.price),
      subtotal: parseFloat((item.quantity * item.price).toFixed(2)),
    }));

    const invoiceData = {
      id_usuario: 1,
      detalles,
      total: parseFloat(total.toFixed(2)),
      efectivo: paymentType === "contado" ? parseFloat(cash) : 0,
      cambio: paymentType === "contado" ? parseFloat(change) : 0,
      tipo_pago: paymentType,
      id_cliente: paymentType === "contado" ? 1 : parseInt(selectedClient),
    };

    try {
      const response = await axios.post(
        "http://localhost:3000/api/facturas",
        invoiceData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        handleNotification("Factura realizada con éxito.");
        setCartItems([]);
        setCash("");
        setSelectedClient(""); // Valor inicial vacío
        setPaymentType("contado");

        if (paymentType === "credito") {
          const client = clients.find(
            (client) => client.id_cliente === parseInt(selectedClient)
          );
          if (client) {
            const newCredit = client.credito - total;
            updateClientCredit(client.id_cliente, newCredit);
          }
        }
      } else {
        handleNotification("Error al procesar la factura.");
      }
    } catch (error) {
      console.error("Error al hacer la solicitud:", error);
      handleNotification("Hubo un error al procesar la factura.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setIsAuthenticated(false);
    navigate("/login");
  };

  const filteredProducts = products.filter(
    (product) =>
      (product.nombre_producto.toLowerCase().includes(search.toLowerCase()) ||
        product.codigo_barras.toLowerCase().includes(search.toLowerCase())) &&
      (selectedCategory
        ? product.categoria.toLowerCase() === selectedCategory.toLowerCase()
        : true)
  );

  const handleSearchChange = useCallback(
    (e) => {
      const value = e.target.value;
      setSearch(value);
      setIsSearchActive(value.trim() !== "");
      setIsBarcodeSearch(/^\d+$/.test(value));
      setSelectedCategory("");

      if (debounceTimer) clearTimeout(debounceTimer);
      setDebounceTimer(
        setTimeout(() => {
          setIsSearchActive(true);
        }, 500)
      );
    },
    [debounceTimer]
  );

  const handleSearchKeyPress = (e) => {
    if (e.key === "Enter" && isBarcodeSearch && filteredProducts.length > 0) {
      const product = filteredProducts[0];
      addToCart({
        id_producto: product.id_producto,
        nombre_producto: product.nombre_producto,
        precio_venta: parseFloat(product.precio_venta),
        categoria: product.categoria,
        cantidad: product.cantidad,
      });
      setSearch("");
      setIsSearchActive(false);
      setIsBarcodeSearch(false);
    }
  };

  useEffect(() => {
    if (isSearchActive && isBarcodeSearch && filteredProducts.length > 0) {
      const product = filteredProducts[0];
      const existingItem = cartItems.find(
        (item) => item.id === product.id_producto
      );

      if (!existingItem) {
        addToCart({
          id_producto: product.id_producto,
          nombre_producto: product.nombre_producto,
          precio_venta: parseFloat(product.precio_venta),
          categoria: product.categoria,
          cantidad: product.cantidad,
        });
      }

      setSearch("");
      setIsSearchActive(false);
      setIsBarcodeSearch(false);
    }
  }, [isSearchActive, isBarcodeSearch, filteredProducts, cartItems]);

  return (
    <div className="max-h-screen bg-black/50 text-white p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center bg-gray-200 text-black p-2 rounded-md w-full">
          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            onKeyPress={handleSearchKeyPress}
            placeholder="Buscar producto por nombre o código de barras..."
            className="flex-grow bg-transparent outline-none px-2"
          />
          <button className="text-gray-600" alt="buscar">
            🔍
          </button>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Salir
        </button>
        <button
          onClick={fetchProducts}
          className="bg-blue-500 text-white px-4 py-2 rounded ml-2"
        >
          Actualizar Productos
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto border-b border-gray-600 mt-4">
        {categories.map((category, index) => (
          <button
            key={index}
            className={`px-4 py-2 text-sm whitespace-nowrap hover:bg-green-700 transition ${
              selectedCategory === category ? "bg-green-500" : ""
            }`}
            onClick={() => {
              setSelectedCategory(category);
              setSearch("");
              setIsSearchActive(false);
            }}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mt-4 w-full sm:w-[900px] mx-auto">
        <div className="bg-gray-800 p-4 rounded-lg overflow-y-auto max-h-80 sm:w-3/4">
          {(isSearchActive || selectedCategory) && (
            <ul className="space-y-2">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center bg-gray-700 p-2 rounded-md hover:bg-gray-600"
                  >
                    <span>{product.nombre_producto}</span>
                    <span>Q {parseFloat(product.precio_venta).toFixed(2)}</span>
                    <span>Disp. {product.cantidad}</span>
                    <button
                      onClick={() =>
                        addToCart({
                          id_producto: product.id_producto,
                          nombre_producto: product.nombre_producto,
                          precio_venta: parseFloat(product.precio_venta),
                          categoria: product.categoria,
                          cantidad: product.cantidad,
                        })
                      }
                      disabled={product.cantidad === 0}
                      className={`${
                        product.cantidad === 0
                          ? "bg-red-600 cursor-not-allowed"
                          : "bg-green-600"
                      } text-white py-1 px-2 rounded-md`}
                    >
                      Agregar
                    </button>
                  </li>
                ))
              ) : (
                <li className="text-gray-500">No se encontraron productos</li>
              )}
            </ul>
          )}
        </div>

        <div
          className="bg-gray-800 p-4 rounded-lg sm:w-3/4 mt-4 sm:mt-0"
          ref={cartRef}
          style={{ maxHeight: "300px", overflowY: "auto" }}
        >
          {notification && (
            <div className="bg-blue-600 text-white p-2 rounded-md mb-4">
              {notification}
            </div>
          )}

          <ul className="space-y-2">
            {cartItems.map((item) => {
              const product = products.find((p) => p.id_producto === item.id);
              const isInsufficient =
                product && product.cantidad < item.quantity;
              return (
                <li
                  key={item.id}
                  className={`flex justify-between items-center p-2 rounded-md hover:bg-gray-600 ${
                    isInsufficient ? "bg-red-600" : "bg-gray-700"
                  }`}
                >
                  <span>{item.name}</span>
                  <span>Q {item.price.toFixed(2)}</span>
                  <div className="flex gap-2 items-center">
                    <input
                      type="number"
                      value={item.quantity}
                      min="1"
                      onChange={(e) =>
                        updateQuantity(item.id, parseInt(e.target.value))
                      }
                      className="w-16 text-center bg-gray-600 text-white rounded-md"
                    />
                    <button
                      onClick={() => removeFromCart(item.name)}
                      className="bg-red-600 text-white px-2 py-1 rounded-md"
                    >
                      Eliminar
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="flex justify-between mt-4">
            <span>Total:</span>
            <span>Q {total.toFixed(2)}</span>
          </div>

          {paymentType === "contado" && (
            <div className="mt-4">
              <label htmlFor="cash" className="block text-center mb-2">
                Efectivo:
              </label>
              <input
                type="number"
                id="cash"
                value={cash}
                onChange={(e) => setCash(e.target.value)}
                className="w-full text-center bg-gray-600 text-white p-2 rounded-md"
                min="0"
              />
            </div>
          )}

          <div className="mt-4">
            <span>Cambio:</span>
            <span>Q {change}</span>
          </div>

          <div className="mt-4">
            <label htmlFor="paymentType" className="block text-center mb-2">
              Tipo de Pago:
            </label>
            <select
              id="paymentType"
              value={paymentType}
              onChange={(e) => {
                setPaymentType(e.target.value);
                if (e.target.value === "contado") {
                  setSelectedClient("1"); // ID del cliente C/F
                }
              }}
              className="w-full text-center bg-gray-600 text-white p-2 rounded-md"
            >
              <option value="contado">Contado</option>
              <option value="credito">Crédito</option>
            </select>
          </div>

          {paymentType === "credito" && (
            <div className="mt-4">
              <label htmlFor="client" className="block text-center mb-2">
                Cliente:
              </label>
              <select
                id="client"
                value={selectedClient}
                onChange={(e) => setSelectedClient(e.target.value)}
                className="w-full text-center bg-gray-600 text-white p-2 rounded-md"
              >
                <option value="">Elije un cliente</option>
                {clients
                  .filter((client) => client.nombre !== "Consumidor Final")
                  .map((client, index) => (
                    <option
                      key={`${client.id_cliente}-${index}`}
                      value={client.id_cliente}
                    >
                      {client.nombre}
                    </option>
                  ))}
              </select>
            </div>
          )}

          <button
            onClick={handlePayment}
            className="mt-4 bg-green-600 w-full text-white py-2 rounded-md"
          >
            Pagar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Facturar;
