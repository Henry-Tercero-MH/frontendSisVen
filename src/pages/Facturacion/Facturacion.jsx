import React, { useState } from "react";

const Facturar = () => {
  const [search, setSearch] = useState("");
  const [cartItems, setCartItems] = useState([
    { name: "Leche Australia 1L", quantity: 1, price: 10 },
    { name: "Coca Cola 355 ml", quantity: 2, price: 10 },
  ]);

  const [cash, setCash] = useState(100);

  const categories = [
    "Bebidas",
    "Granos Básicos",
    "Golosinas",
    "Lácteos",
    "Pastas",
  ];
  const products = [
    { name: "Leche Entera 1/2 L", price: 10 },
    { name: "Leche en Polvo 1L", price: 10 },
    { name: "Leche Australia 1L", price: 10 },
  ];

  const total = cartItems.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );
  const change = cash - total;

  const addToCart = (product) => {
    const existingItem = cartItems.find((item) => item.name === product.name);
    if (existingItem) {
      setCartItems(
        cartItems.map((item) =>
          item.name === product.name
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

  const updateQuantity = (productName, delta) => {
    setCartItems(
      cartItems.map((item) =>
        item.name === productName
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  return (
    <div className="max-h-screen bg-black/50text-white p-4">
      {/* Barra de Búsqueda */}
      <div className="flex items-center bg-gray-200 text-black p-2 rounded-md">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar producto..."
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
            className="px-4 py-2 text-sm whitespace-nowrap hover:bg-green-700 transition"
          >
            {category}
          </button>
        ))}
      </div>

      {/* Productos y Carrito */}
      <div className="flex flex-col md:flex-row mt-4 gap-4">
        {/* Lista de Productos */}
        <div className="flex-1 bg-gray-800 p-4 rounded-lg">
          <ul className="space-y-2">
            {products.map((product, index) => (
              <li
                key={index}
                className="flex justify-between items-center bg-gray-700 p-2 rounded-md hover:bg-gray-600"
              >
                <span>{product.name}</span>
                <span>Q. {product.price.toFixed(2)}</span>
                <button
                  onClick={() => addToCart(product)}
                  className="bg-green-600 px-2 py-1 rounded-md hover:bg-green-700"
                >
                  Agregar
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Carrito de Compras */}
        <div className="flex-1 bg-gray-800 p-4 rounded-lg">
          <h2 className="text-lg font-bold mb-4">Carrito de Compras</h2>
          <ul className="space-y-2">
            {cartItems.map((item, index) => (
              <li
                key={index}
                className="flex justify-between items-center bg-gray-700 p-2 rounded-md"
              >
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.name, -1)}
                    className="px-2 py-1 bg-gray-600 rounded-md"
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.name, 1)}
                    className="px-2 py-1 bg-gray-600 rounded-md"
                  >
                    +
                  </button>
                </div>
                <span>{item.name}</span>
                <span>Q. {(item.quantity * item.price).toFixed(2)}</span>
                <button
                  onClick={() => removeFromCart(item.name)}
                  className="text-red-500 hover:text-red-700"
                >
                  🗑️
                </button>
              </li>
            ))}
          </ul>

          {/* Resumen de Pago */}
          <div className="mt-4 space-y-2">
            <div className="flex justify-between">
              <span>Total</span>
              <span>Q. {total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Efectivo</span>
              <input
                type="number"
                value={cash}
                onChange={(e) => setCash(Number(e.target.value))}
                className="bg-gray-700 rounded-md px-2 w-20 text-right"
              />
            </div>
            <div className="flex justify-between">
              <span>Cambio</span>
              <span>Q. {change.toFixed(2)}</span>
            </div>
          </div>
          <button
            className="mt-4 w-full bg-green-600 p-2 rounded-md hover:bg-green-700"
            disabled={total > cash}
          >
            Procesar el Pago Q. {total.toFixed(2)}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Facturar;
