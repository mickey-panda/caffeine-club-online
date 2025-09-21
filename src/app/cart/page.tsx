"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type CartItem = {
  id: number;
  name: string;
  category: string;
  price: number;
  isAvailable: boolean;
  quantity: number;
};

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const MIN_ORDER = 500;

  useEffect(() => {
    const saved = localStorage.getItem("cart");
    if (saved) {
      try {
        setCart(JSON.parse(saved));
      } catch {}
    }
  }, []);

  const save = (next: CartItem[]) => {
    setCart(next);
    localStorage.setItem("cart", JSON.stringify(next));
  };

  const updateQuantity = (id: number, delta: number) => {
    save(
      cart
        .map((c) => (c.id === id ? { ...c, quantity: Math.max(0, c.quantity + delta) } : c))
        .filter((c) => c.quantity > 0)
    );
  };

  const removeItem = (id: number) => {
    save(cart.filter((c) => c.id !== id));
  };

  const total = cart.reduce((s, it) => s + it.price * it.quantity, 0);
  const itemsCount = cart.reduce((s, it) => s + it.quantity, 0);
  const remaining = Math.max(0, MIN_ORDER - total);

  return (
    <main className="min-h-screen bg-white text-gray-800">
      <section className="py-8 px-6 text-center bg-gray-100">
        <h1 className="text-4xl font-bold text-amber-500">Your Cart</h1>
        <p className="mt-2 text-gray-600">Review and adjust your order before confirming.</p>
      </section>

      <section className="py-8 px-6 max-w-6xl mx-auto pb-28">
        {cart.length === 0 ? (
          <div className="text-center">
            <p className="text-lg text-gray-600">Your cart is empty.</p>
            <button onClick={() => router.push("/menu")} className="mt-4 bg-yellow-500 text-black px-6 py-3 rounded-xl font-semibold hover:bg-yellow-400">
              Go to Menu
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow p-4">
              {cart.map((it, idx) => (
                <div key={it.id} className={`flex items-center justify-between gap-4 py-3 ${idx !== cart.length - 1 ? "border-b" : ""}`}>
                  <div>
                    <div className="font-semibold">{it.name}</div>
                    <div className="text-sm text-gray-500">{it.category}</div>
                    <div className="text-sm text-gray-700 mt-1">₹{it.price} each</div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center border rounded-md overflow-hidden">
                      <button onClick={() => updateQuantity(it.id, -1)} className="px-3 py-1 bg-gray-100" disabled={it.quantity <= 1}>-</button>
                      <div className="px-4">{it.quantity}</div>
                      <button onClick={() => updateQuantity(it.id, 1)} className="px-3 py-1 bg-gray-100">+</button>
                    </div>

                    <div className="text-sm text-gray-700">₹{it.price * it.quantity}</div>
                    <button onClick={() => removeItem(it.id)} className="text-red-500 text-sm">Remove</button>
                  </div>
                </div>
              ))}
            </div>

            {/* Upsell */}
            {/* <div className="bg-yellow-50 p-4 rounded-lg shadow">
              <h3 className="font-semibold">Need a small add-on?</h3>
              <p className="text-sm text-gray-700 mt-2">Add a cold beverage or dessert to complete the feast.</p>
              <div className="mt-3 flex gap-3">
                <button onClick={() => { const newItem = { id: 99991, name: "Cold Drink", category: "Cold Drinks", price: 49, isAvailable: true, quantity: 1}; localStorage.setItem("cart", JSON.stringify([...cart, newItem])); setCart(prev => [...prev, newItem]); }} className="px-3 py-2 bg-yellow-500 rounded-lg font-semibold">+ Cold Drink ₹49</button>
                <button onClick={() => { const newItem = { id: 99992, name: "Brownie", category: "Dessert", price: 79, isAvailable: true, quantity: 1}; localStorage.setItem("cart", JSON.stringify([...cart, newItem])); setCart(prev => [...prev, newItem]); }} className="px-3 py-2 border rounded-lg">+ Brownie ₹79</button>
              </div>
            </div> */}
          </div>
        )}
      </section>

      {/* Fixed footer */}
      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-30">
          <div className="max-w-6xl mx-auto p-3 bg-amber-100 rounded-t-xl border-t border-amber-300 shadow-xl">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-4">
                <div className="text-sm font-semibold">Items: {itemsCount}</div>
                <div className="text-sm font-semibold">Total: ₹{total}</div>
              </div>

              <div className="text-sm font-medium">
                {total >= MIN_ORDER ? (
                  <span className="text-green-700">You are eligible for delivery 🎉</span>
                ) : (
                  <span className="text-red-600">₹{remaining} away from minimum order ₹{MIN_ORDER}</span>
                )}
              </div>

              <div className="flex gap-3 w-full sm:w-auto">
                <button onClick={() => router.push("/menu")} className="w-full sm:w-auto px-4 py-2 rounded-xl border">Add more</button>
                <button onClick={() => router.push("/checkout")} disabled={total < MIN_ORDER} className={`w-full sm:w-auto px-4 py-2 rounded-xl font-semibold ${total < MIN_ORDER ? "bg-gray-300 text-gray-600 cursor-not-allowed" : "bg-yellow-500 text-black hover:bg-yellow-400"}`}>
                  Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
