"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Define CartItem interface to match menu/page.tsx
interface CartItem {
  id: number;
  name: string;
  category: string;
  price: number;
  isAvailable: boolean;
  quantity: number;
}

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const router = useRouter();

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (err) {
        console.error("Error parsing cart from localStorage:", err);
      }
    }
  }, []);

  // Update quantity of an item in the cart
  const updateQuantity = (id: number, delta: number) => {
    setCart((prevCart) => {
      const updatedCart = prevCart
        .map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity + delta }
            : item
        )
        .filter((item) => item.quantity > 0); // Remove items with quantity 0
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  // Remove item from cart
  const removeItem = (id: number) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.filter((item) => item.id !== id);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  // Calculate total cart price
  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // Handle checkout
  const handleCheckout = () => {
    console.log("Proceeding to checkout with cart:", cart);
    router.push("/checkout");
  };

  return (
    <main className="min-h-screen bg-white text-gray-800">
      {/* Header */}
      <section className="py-8 px-6 text-center bg-gray-100">
        <h1 className="text-4xl font-bold text-amber-500">Your Cart</h1>
        <p className="mt-2 text-lg text-gray-600">
          Review your selected items and proceed to checkout.
        </p>
      </section>

      {/* Cart Items */}
      <section className="py-8 px-6 max-w-6xl mx-auto pb-28 sm:pb-24">
        {cart.length === 0 ? (
          <div className="text-center">
            <p className="text-lg text-gray-600">Your cart is empty.</p>
            <button
              onClick={() => router.push("/menu")}
              className="mt-4 bg-yellow-500 text-black px-6 py-3 rounded-xl font-semibold hover:bg-yellow-400 transition"
            >
              Go to Menu
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Cart Items List */}
            <div className="flex flex-col">
              {cart.map((item, index) => (
                <div
                  key={item.id}
                  className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } border-b border-gray-200 hover:bg-gray-100 transition`}
                >
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-gray-800">{item.name}</h3>
                    <p className="text-sm text-gray-600">Category: {item.category}</p>
                    <p className="text-sm text-gray-600">Price: ₹{item.price}</p>
                  </div>
                  <div className="flex items-center gap-4 mt-2 sm:mt-0">
                    <div className="flex items-center">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="text-gray-800 bg-gray-200 px-3 py-1 rounded-l-md hover:bg-gray-300 transition"
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span className="px-4 py-1 bg-gray-100 text-gray-800 text-sm">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="text-gray-800 bg-gray-200 px-3 py-1 rounded-r-md hover:bg-gray-300 transition"
                      >
                        +
                      </button>
                    </div>
                    <p className="text-sm text-gray-600">
                      Total: ₹{item.price * item.quantity}
                    </p>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-500 hover:text-red-600 text-sm font-medium transition"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Fixed Cart Summary */}
      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-amber-100 p-3 sm:p-4 max-w-6xl mx-auto rounded-t-xl shadow-xl border-t border-amber-300 z-20">
          <div className="flex flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <p className="text-sm sm:text-base text-gray-700 font-semibold">
                Items: {cart.reduce((total, item) => total + item.quantity, 0)}
              </p>
              <p className="text-sm sm:text-base text-gray-700 font-semibold">
                Total: ₹{totalPrice}
              </p>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full sm:w-auto bg-yellow-500 text-black px-4 sm:px-6 py-2 rounded-xl font-semibold hover:bg-yellow-400 transition"
            >
              Checkout
            </button>
          </div>
        </div>
      )}
    </main>
  );
}