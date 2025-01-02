import React, { useState, useEffect } from "react";

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
    // Verificar si el producto ya está en el carrito
    const existingItem = cartItems.find((item) => item.name === product.name);
    if (existingItem) {
      // Si ya está, actualizar la cantidad
      setCartItems(
        cartItems.map((item) =>
          item.name === product.name
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      // Si no está, agregarlo al carrito en primer lugar
      setCartItems([{ ...product, quantity: 1 }, ...cartItems]);
    }
  };

  const removeFromCart = (productName) => {
    setCartItems(cartItems.filter((item) => item.name !== productName));
  };

  const updateQuantity = (productName, newQuantity) => {
    setCartItems(
      cartItems.map((item) =>
        item.name === productName
          ? { ...item, quantity: Math.max(1, newQuantity) }
          : item
      )
    );
  };

  const handlePayment = async () => {
    const invoiceData = {
      cartItems,
      total,
      cash,
      change,
    };

    console.log("Datos a enviar al backend:", invoiceData);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/facturas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(invoiceData),
      });

      const data = await response.json();

      if (data.success) {
        setNotification("Factura procesada con éxito.");
      } else {
        setNotification("Error al procesar la factura.");
      }
    } catch (error) {
      console.error("Error al hacer la solicitud:", error);
      setNotification("Hubo un error al procesar la factura.");
    }
  };

  // Filtrar productos por búsqueda y categoría seleccionada
  const filteredProducts = products.filter(
    (product) =>
      (product.nombre_producto.toLowerCase().includes(search.toLowerCase()) ||
        product.codigo_barras.toLowerCase().includes(search.toLowerCase())) && // Búsqueda por nombre o código
      (selectedCategory
        ? product.categoria.toLowerCase() === selectedCategory.toLowerCase()
        : true)
  );

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    setIsSearchActive(value.trim() !== ""); // Activar búsqueda solo si hay texto

    // Detectar si el valor ingresado es un código de barras
    if (/^\d+$/.test(value)) {
      // Si el valor es numérico (código de barras)
      setIsBarcodeSearch(true); // Activar búsqueda por código de barras
    } else {
      setIsBarcodeSearch(false); // Si no es código de barras, desactivar
    }

    setSelectedCategory(""); // Limpiar la categoría seleccionada
  };

  // Agregar automáticamente 1 cantidad cuando se hace una búsqueda por código de barras
  useEffect(() => {
    if (isSearchActive && isBarcodeSearch && filteredProducts.length > 0) {
      const product = filteredProducts[0]; // Solo agregamos el primero que coincida

      // Limitar la ejecución del addToCart usando debounce
      if (debounceTimer) clearTimeout(debounceTimer);
      setDebounceTimer(
        setTimeout(() => {
          addToCart({
            name: product.nombre_producto,
            price: parseFloat(product.precio_venta),
            category: product.categoria,
          });

          // Limpiar el estado después de agregar el producto
          setSearch(""); // Limpiar campo de búsqueda
          setIsSearchActive(false); // Desactivar búsqueda
          setIsBarcodeSearch(false); // Desactivar búsqueda por código de barras
        }, 500) // Esperar 500 ms antes de agregar el producto
      );
    }
  }, [isSearchActive, isBarcodeSearch, filteredProducts]); // Reaccionar a los cambios en la búsqueda y los productos filtrados

  return (
    <div className="max-h-screen bg-black/50 text-white p-4">
      {/* Barra de Búsqueda */}
      <div className="flex items-center bg-gray-200 text-black p-2 rounded-md">
        <input
          type="text"
          value={search}
          onChange={handleSearchChange} // Actualizar el valor de búsqueda
          placeholder="Buscar producto por nombre o código de barras..."
          className="flex-grow bg-transparent outline-none px-2"
        />
        <button className="text-gray-600" alt="buscar">
          🔍
        </button>
      </div>

      {/* Categorías */}
      <div className="flex gap-2 overflow-x-auto border-b border-gray-600 mt-4">
        {categories.map((category, index) => (
          <button
            key={index}
            className={`px-4 py-2 text-sm whitespace-nowrap hover:bg-green-700 transition ${
              selectedCategory === category ? "bg-green-500" : ""
            }`}
            onClick={() => {
              setSelectedCategory(category);
              setSearch(""); // Limpiar búsqueda cuando se selecciona categoría
              setIsSearchActive(false); // Desactivar búsqueda al seleccionar una categoría
            }}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Productos y Carrito */}
      <div className="flex flex-col md:flex-row mt-4 gap-4">
        {/* Lista de Productos */}
        <div className="flex-1 bg-gray-800 p-4 rounded-lg overflow-y-auto max-h-80">
          {(isSearchActive || selectedCategory) && (
            <ul className="space-y-2">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center bg-gray-700 p-2 rounded-md hover:bg-gray-600"
                  >
                    <span>{product.nombre_producto}</span>
                    <span>
                      Q {parseFloat(product.precio_venta).toFixed(2)}
                    </span>{" "}
                    {/* Precio en Q */}
                    <button
                      onClick={() =>
                        addToCart({
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

        {/* Carrito */}
        <div className="flex-1 bg-gray-800 p-4 rounded-lg flex flex-col">
          <h3 className="text-lg font-semibold">Carrito</h3>

          {/* Lista de productos en el carrito con scroll */}
          <div className="flex-1 overflow-y-auto max-h-40 mt-2">
            <ul className="space-y-2">
              {cartItems.slice().map((item, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center bg-gray-700 p-2 rounded-md hover:bg-gray-600"
                >
                  <span>{item.name}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        updateQuantity(item.name, item.quantity - 1)
                      }
                      className="bg-red-600 text-white py-1 px-2 rounded-md"
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() =>
                        updateQuantity(item.name, item.quantity + 1)
                      }
                      className="bg-blue-600 text-white py-1 px-2 rounded-md"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.name)}
                    className="bg-gray-500 text-white py-1 px-2 rounded-md"
                  >
                    Eliminar
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Información de pago */}
          <div className="mt-4">
            <div className="flex justify-between">
              <span>Total:</span>
              <span>Q {total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Efectivo:</span>
              <input
                type="number"
                value={cash}
                onChange={(e) => setCash(e.target.value)}
                placeholder="Cantidad recibida"
                className="bg-gray-700 p-1 rounded-md text-white"
              />
            </div>
            <div className="flex justify-between">
              <span>Cambio:</span>
              <span>Q {change}</span>
            </div>
          </div>

          {/* Botón de pago */}
          <button
            onClick={handlePayment}
            className="bg-green-600 text-white py-2 mt-4 rounded-md"
          >
            Pagar
          </button>
        </div>
      </div>

      {/* Notificación */}
      {notification && (
        <div className="mt-4 p-2 bg-gray-700 text-center rounded-md">
          {notification}
        </div>
      )}
    </div>
  );
};

export default Facturar;
