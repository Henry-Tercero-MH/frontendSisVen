import React, { useState, useEffect } from "react";
import styles from "./Facturar.module.css"; // Importa el módulo CSS

const Facturar = () => {
  const [search, setSearch] = useState(""); // Campo de búsqueda
  const [selectedCategory, setSelectedCategory] = useState(""); // Filtro de categoría
  const [cartItems, setCartItems] = useState([]); // Carrito de compras
  const [cash, setCash] = useState(""); // Efectivo dado por el cliente
  const [notification, setNotification] = useState(""); // Notificaciones
  const [products, setProducts] = useState([]); // Lista de productos
  const [isSearchActive, setIsSearchActive] = useState(false); // Estado para saber si la búsqueda está activa
  const [isBarcodeSearch, setIsBarcodeSearch] = useState(false); // Para determinar si es una búsqueda por código de barras
  const [debounceTimer, setDebounceTimer] = useState(null); // Temporizador para debounce

  const categories = [
    "Bebidas",
    "Granos Básicos",
    "Golosinas",
    "Lácteos",
    "Pastas",
  ];

  // Cargar los productos de la API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/products");
        const data = await response.json();
        setProducts(data); // Actualizar el estado con los productos obtenidos
      } catch (error) {
        console.error("Error al obtener los productos:", error);
      }
    };

    fetchProducts();
  }, []);

  const total = cartItems.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );

  // Calcular el cambio
  const change = cash ? (parseFloat(cash) - total).toFixed(2) : "0.00";

  const addToCart = (product) => {
    const existingItem = cartItems.find((item) => item.id === product.id);
    if (existingItem) {
      setCartItems(
        cartItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productName) => {
    setCartItems(cartItems.filter((item) => item.name !== productName));
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

  const handlePayment = async () => {
    if (!cartItems.length) {
      setNotification("El carrito está vacío.");
      return;
    }

    if (!cash || parseFloat(cash) < total) {
      setNotification("El efectivo es insuficiente.");
      return;
    }

    const detalles = cartItems.map((item) => ({
      id_producto: parseInt(item.id),
      cantidad: parseInt(item.quantity),
      precio_unitario: parseFloat(item.price),
      subtotal: parseFloat((item.quantity * item.price).toFixed(2)),
    }));

    const invoiceData = {
      id_usuario: 1, // Reemplaza con el ID real del usuario
      detalles,
      total: parseFloat(total.toFixed(2)),
      efectivo: parseFloat(cash),
      cambio: parseFloat(change),
    };

    try {
      // Establecer el estado de la notificación a "Procesando..." antes de hacer la solicitud
      setNotification("Procesando factura...");

      const response = await fetch("http://localhost:3000/api/facturas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(invoiceData),
      });

      if (!response.ok) {
        throw new Error("Error al procesar la solicitud");
      }

      const data = await response.json();

      if (data.success) {
        setNotification("Factura procesada con éxito.");
        setCartItems([]); // Limpiar carrito
        setCash(""); // Limpiar efectivo ingresado
      } else {
        setNotification("Error al procesar la factura.");
      }
    } catch (error) {
      console.error("Error al hacer la solicitud:", error);
      setNotification("Hubo un error al procesar la factura.");
    }
  };

  const filteredProducts = products.filter(
    (product) =>
      (product.nombre_producto.toLowerCase().includes(search.toLowerCase()) ||
        product.codigo_barras.toLowerCase().includes(search.toLowerCase())) &&
      (selectedCategory
        ? product.categoria.toLowerCase() === selectedCategory.toLowerCase()
        : true)
  );

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    setIsSearchActive(value.trim() !== "");
    if (/^\d+$/.test(value)) {
      setIsBarcodeSearch(true);
    } else {
      setIsBarcodeSearch(false);
    }
    setSelectedCategory("");
  };

  useEffect(() => {
    if (isSearchActive && isBarcodeSearch && filteredProducts.length > 0) {
      const product = filteredProducts[0];
      if (debounceTimer) clearTimeout(debounceTimer);
      setDebounceTimer(
        setTimeout(() => {
          addToCart({
            id: product.id_producto,
            name: product.nombre_producto,
            price: parseFloat(product.precio_venta),
            category: product.categoria,
          });
          setSearch("");
          setIsSearchActive(false);
          setIsBarcodeSearch(false);
        }, 500)
      );
    }
  }, [isSearchActive, isBarcodeSearch, filteredProducts]);

  return (
    <div className="max-h-screen bg-black/50 text-white p-4">
      <div className="flex items-center bg-gray-200 text-black p-2 rounded-md w-full">
        <input
          type="text"
          value={search}
          onChange={handleSearchChange}
          placeholder="Buscar producto por nombre o código de barras..."
          className="flex-grow bg-transparent outline-none px-2"
        />
        <button className="text-gray-600" alt="buscar">
          🔍
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

      <div className="flex flex-col sm:flex-row gap-4 mt-4 w-full sm:w-[600px] mx-auto">
        <div className="bg-gray-800 p-4 rounded-lg overflow-y-auto max-h-80 sm:w-2/4">
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
                    <button
                      onClick={() =>
                        addToCart({
                          id: product.id_producto,
                          name: product.nombre_producto,
                          price: parseFloat(product.precio_venta),
                          category: product.categoria,
                        })
                      }
                      className="bg-green-600 text-white py-1 px-2 rounded-md"
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

        <div className="bg-gray-800 p-4 rounded-lg sm:w-3/4">
          <h3 className="text-lg font-semibold">Carrito</h3>
          <div className="overflow-y-auto max-h-40 mt-2">
            <ul className="space-y-2">
              {cartItems.map((item, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center bg-gray-700 p-2 rounded-md hover:bg-gray-600"
                >
                  <span>{item.name}</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={item.quantity}
                      min="1"
                      onChange={(e) =>
                        updateQuantity(item.name, parseInt(e.target.value))
                      }
                      className="w-12 bg-gray-800 text-white text-center rounded-md"
                    />
                    <span>
                      Q {parseFloat(item.price * item.quantity).toFixed(2)}
                    </span>
                    <button
                      onClick={() => removeFromCart(item.name)}
                      className="bg-red-600 text-white py-1 px-2 rounded-md"
                    >
                      Eliminar
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-4">
            <h4 className="text-md font-semibold">
              Total: Q {parseFloat(total).toFixed(2)}
            </h4>
            <div className="flex items-center gap-2 mt-2">
              <label htmlFor="cash" className="text-sm">
                Efectivo:
              </label>
              <input
                id="cash"
                type="number"
                value={cash}
                onChange={(e) => setCash(e.target.value)}
                placeholder="Efectivo recibido"
                className="bg-gray-700 text-white py-1 px-2 rounded-md"
              />
            </div>
            <div className="mt-2">
              <h4 className="text-md font-semibold">
                Cambio: Q {parseFloat(change).toFixed(2)}
              </h4>
            </div>
            <button
              onClick={handlePayment}
              disabled={total === 0 || parseFloat(change) < 0}
              className="w-full bg-green-600 text-white py-2 rounded-md mt-4"
            >
              Procesar Factura
            </button>
          </div>
          {notification && (
            <div className="mt-4 bg-gray-900 p-2 text-green-400">
              {notification}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Facturar;
