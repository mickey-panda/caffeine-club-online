"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Define CartItem interface to match menu/page.tsx and cart/page.tsx
interface CartItem {
  id: number;
  name: string;
  category: string;
  price: number;
  isAvailable: boolean;
  quantity: number;
}

export default function CheckoutPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string>("");
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
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

  // Generate available time slots
  useEffect(() => {
    const generateSlots = () => {
      const slots: string[] = [];
      const now = new Date(); // Current time: Sep 15, 2025, 12:40 AM IST
      const minTime = new Date(now.getTime() + 3 * 60 * 60 * 1000); // 3 hrs later
      const maxTime = new Date(now.getTime() + 72 * 60 * 60 * 1000); // 72 hrs later

      const currentSlot = new Date(minTime);

      // Round to next 30 min interval
      const minutes = currentSlot.getMinutes();
      currentSlot.setMinutes(minutes >= 30 ? 60 : 30);
      currentSlot.setSeconds(0, 0);

      // Adjust to valid range (1 PM – 12 AM)
      if (currentSlot.getHours() < 13) {
        currentSlot.setHours(13, 0, 0, 0);
      } else if (currentSlot.getHours() >= 24) {
        currentSlot.setDate(currentSlot.getDate() + 1);
        currentSlot.setHours(13, 0, 0, 0);
      }

      while (currentSlot <= maxTime) {
        const hours = currentSlot.getHours();

        if (hours >= 13 && hours < 24) {
          const formattedSlot = currentSlot.toLocaleString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          });
          slots.push(formattedSlot);
        }

        // Move ahead 30 mins
        currentSlot.setMinutes(currentSlot.getMinutes() + 30);

        // If past 11:30 PM → jump to next day 1 PM
        if (currentSlot.getHours() === 0) {
          currentSlot.setDate(currentSlot.getDate() + 1);
          currentSlot.setHours(13, 0, 0, 0);
        }
      }

      setAvailableSlots(slots);
      setSelectedSlot(slots[0] || "");
    };

    generateSlots();
  }, []);

  // Calculate total cart price
  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // Handle confirm order
  const handleConfirmOrder = () => {
    // Collect item details as a list
    const itemDetails = cart
      .map(item => `${item.name} (${item.category}) x ${item.quantity}`)
      .join('\n');
    
    // Create bill-like string
    const message = `**Order Details**\n---\n${itemDetails}\n\n**Slot Selected**\n${selectedSlot}`;

    // Encode message for URL
    const encodedMessage = encodeURIComponent(message);

    // WhatsApp URL
    const whatsappUrl = `https://wa.me/7381400960?text=${encodedMessage}`;

    // Navigate to WhatsApp
    window.open(whatsappUrl, '_blank');

    // Clear local storage and cart state
    localStorage.removeItem("cart");
    setCart([]);

    // Optional: Navigate to order confirmation if needed
    // router.push("/order-confirmation");
  };

  return (
    <main className="min-h-screen bg-white text-gray-800">
      {/* Header */}
      <section className="py-8 px-6 text-center bg-gray-100">
        <h1 className="text-4xl font-bold text-amber-500">Checkout</h1>
        <p className="mt-2 text-lg text-gray-600">
          Review your items and select a delivery time slot.
        </p>
      </section>

      {/* Checkout Content */}
      <section className="py-8 px-6 max-w-6xl mx-auto">
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
          <div className="space-y-8">
            {/* Cart Items List */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Items</h2>
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
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      <p className="text-sm text-gray-600">
                        Total: ₹{item.price * item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Time Slot Selection */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Select Delivery Time Slot
              </h2>
              {availableSlots.length === 0 ? (
                <p className="text-sm text-gray-600">No available slots</p>
              ) : (
                <div className="relative w-full sm:w-1/2">
                  <select
                    value={selectedSlot}
                    onChange={(e) => setSelectedSlot(e.target.value)}
                    className="block w-full appearance-none bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-800 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                  >
                    {availableSlots.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>

                  {/* Custom dropdown arrow */}
                  <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                    <svg
                      className="h-5 w-5 text-gray-500"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.08 1.04l-4.25 4.25a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="bg-gray-50 p-4 rounded-xl">
              <h2 className="text-xl font-bold text-gray-800 mb-3">Order Summary</h2>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <p className="text-sm text-gray-600">
                    Items: {cart.reduce((total, item) => total + item.quantity, 0)}
                  </p>
                  <p className="text-sm text-gray-600">Total: ₹{totalPrice}</p>
                  <p className="text-sm text-gray-600">Slot: {selectedSlot || "Not selected"}</p>
                </div>
                <button
                  onClick={handleConfirmOrder}
                  disabled={!selectedSlot}
                  className={`w-full sm:w-auto bg-yellow-500 text-black px-4 sm:px-6 py-2 rounded-xl font-semibold hover:bg-yellow-400 transition ${
                    !selectedSlot ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  Confirm Order
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}