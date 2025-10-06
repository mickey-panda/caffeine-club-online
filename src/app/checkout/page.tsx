"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type CartItem = {
  id: number;
  name: string;
  category: string;
  price: number;
  isAvailable: boolean;
  quantity: number;
};

// Represents the stages of the checkout process
type CheckoutStep = "initial" | "saving" | "saved" | "finalizing";

// Slot generation logic (remains the same)
function generateSlots(hoursAhead = 72, minHoursAhead = 3) {
  const now = new Date();
  const minTime = new Date(now.getTime() + minHoursAhead * 60 * 60 * 1000);
  const maxTime = new Date(now.getTime() + hoursAhead * 60 * 60 * 1000);

  const roundUp30 = (d: Date) => {
    const m = d.getMinutes();
    if (m === 0) return new Date(d.setSeconds(0, 0));
    const add = m <= 30 ? 30 - m : 60 - m;
    const nd = new Date(d.getTime() + add * 60000);
    nd.setSeconds(0, 0);
    return nd;
  };

  let current = roundUp30(new Date(minTime));
  const slots: Date[] = [];

  while (current <= maxTime) {
    const h = current.getHours();
    if (h >= 13 && h <= 23) {
      slots.push(new Date(current));
    }
    current = new Date(current.getTime() + 30 * 60000);
    if (current.getHours() === 0) {
      current.setHours(13, 0, 0, 0);
    }
  }
  return slots;
}

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<Date | null>(null);
  const [promo, setPromo] = useState("");
  const [promoApplied, setPromoApplied] = useState<number>(0);
  const [slots, setSlots] = useState<Date[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  
  // State for the new interactive flow
  const [checkoutStep, setCheckoutStep] = useState<CheckoutStep>("initial");
  const [whatsappUrl, setWhatsappUrl] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("cart");
    if (saved) {
      try {
        setCart(JSON.parse(saved));
      } catch {}
    }
  }, []);

  useEffect(() => {
    const s = generateSlots(72, 3);
    setSlots(s);
    if (s.length) setSelectedSlot(s[0]);
  }, []);

  const totalPrice = cart.reduce((s, it) => s + it.price * it.quantity, 0);
  const discounted = Math.max(0, totalPrice - promoApplied);

  const groupedSlots = useMemo(() => {
    const map = new Map<string, Date[]>();
    slots.forEach((d) => {
      const key = d.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
      const arr = map.get(key) || [];
      arr.push(d);
      map.set(key, arr);
    });
    return Array.from(map.entries());
  }, [slots]);

  const applyPromo = () => {
    if (promo.trim().toUpperCase() === "WELCOME50" && totalPrice >= 200) {
      setPromoApplied(50);
      setToast("Promo applied: ₹50 off");
    } else {
      setToast("Invalid promo or conditions not met");
    }
    setTimeout(() => setToast(null), 2000);
  };
  
  const handleConfirm = async () => {
    if (!selectedSlot) {
      setToast("Please select a delivery slot");
      setTimeout(() => setToast(null), 1800);
      return;
    }
    setCheckoutStep("saving"); // Start the saving process

    try {
      const response = await fetch('/api/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cart: cart,
          discounted: discounted,
          selectedSlot: selectedSlot,
          orderStatus: "placed",
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save order. Please try again.');
      }

      const responseData = await response.json();
      const newOrderId = responseData.orderId;
      setOrderId(newOrderId); // Save order ID

      const items = cart.map((c) => `${c.name}(${c.category}) x${c.quantity} = ₹${c.price * c.quantity}`).join("%0A");
      const orderIdLine = `Order ID: ${newOrderId}`;
      const totalLine = `Total: ₹${discounted}`;
      const slotLine = `Slot: ${selectedSlot.toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit", hour12: true })}`;
      const message = `Hi, I placed an order:%0A${orderIdLine}%0A${items}%0A${totalLine}%0A${slotLine}`;
      const phone = "7381400960";
      
      setWhatsappUrl(`https://wa.me/${phone}?text=${message}`);
      setCheckoutStep("saved"); // Move to the 'saved' step
      
    } catch (error) {
      console.error("Confirmation error:", error);
      setToast(error instanceof Error ? error.message : "An unknown error occurred.");
      setCheckoutStep("initial"); // Revert to initial state on error
    }
  };

  const handleFinalize = () => {
    setCheckoutStep("finalizing"); // Update state to show final message
    localStorage.removeItem("cart");
    setCart([]);
    // Brief delay to allow user to see the "Redirecting" message
    setTimeout(() => {
      router.push("/");
    }, 1200);
  };

  return (
    <main className="min-h-screen bg-white text-gray-800">
      <section className="py-8 px-6 text-center bg-gray-100">
        <h1 className="text-4xl font-bold text-amber-500">Checkout</h1>
        <p className="mt-2 text-gray-600">Review your order and pick a convenient delivery slot.</p>
      </section>

      <section className="py-8 px-6 max-w-6xl mx-auto">
        {cart.length === 0 && checkoutStep !== "finalizing" ? (
          <div className="text-center">
            <p className="text-lg text-gray-600">Your cart is empty.</p>
            <button
              onClick={() => router.push("/menu")}
              className="mt-4 bg-yellow-500 text-black px-6 py-3 rounded-xl font-semibold hover:bg-yellow-400"
            >
              Go to Menu
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {/* These sections are visible until the order is finalized */}
            {checkoutStep !== "finalizing" && (
              <>
                {/* Order Summary */}
                <div className="bg-white rounded-xl shadow p-4">
                  <h2 className="text-xl font-bold mb-3">Order Summary</h2>
                  <div className="text-sm text-gray-700">
                    {cart.map((c) => (
                      <div key={c.id} className="flex justify-between py-1">
                        <div>{c.name} - {c.category} x ({c.quantity})</div>
                        <div>₹{c.price * c.quantity}</div>
                      </div>
                    ))}
                    <div className="border-t mt-3 pt-3 flex justify-between font-semibold">
                      <div>Total</div>
                      <div>₹{totalPrice}</div>
                    </div>
                    {promoApplied > 0 && (
                      <div className="flex justify-between text-sm text-green-700 mt-2">
                        <div>Promo</div>
                        <div>-₹{promoApplied}</div>
                      </div>
                    )}
                    <div className="flex justify-between text-lg font-bold mt-2">
                      <div>Payable</div>
                      <div>₹{discounted}</div>
                    </div>
                  </div>
                </div>
                
                {/* Slot Picker */}
                <div className="bg-white rounded-xl shadow p-4">
                  <h3 className="font-semibold mb-3">Choose Delivery Slot</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {groupedSlots.map(([dateStr, ds]) => (
                      <div key={dateStr}>
                        <div className="text-base font-semibold mb-2">{dateStr}</div>
                        <div className="flex flex-wrap gap-2">
                          {ds.map((d) => {
                            const selected = selectedSlot && selectedSlot.getTime() === d.getTime();
                            return (
                              <button
                                key={d.toString()}
                                onClick={() => setSelectedSlot(d)}
                                className={`px-3 py-2 text-sm rounded-lg border ${selected ? "bg-yellow-500 text-black border-yellow-500" : "bg-gray-50 border-gray-200 hover:bg-gray-100"}`}
                              >
                                {d.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", hour12: true })}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* --- Interactive Confirmation CTA --- */}
            <div className="bg-amber-50 p-6 rounded-xl text-center transition-all duration-300">
              {/* Step 1: Initial State */}
              {checkoutStep === "initial" && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-left">
                    <h3 className="font-bold text-lg text-gray-800">Ready to Order?</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Once confirmed, your order will be saved and you will be directed to WhatsApp to finalize.
                    </p>
                  </div>
                  <div className="flex gap-3 w-full sm:w-auto">
                    <button onClick={() => router.push("/cart")} className="px-5 py-3 rounded-xl border">Back</button>
                    <button onClick={handleConfirm} disabled={!selectedSlot} className="px-5 py-3 rounded-xl font-semibold bg-green-600 text-white hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed">
                      Confirm Order
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Saving State */}
              {checkoutStep === "saving" && (
                <div className="flex flex-col items-center justify-center gap-3">
                  <div className="animate-spin h-8 w-8 border-4 border-t-amber-500 border-gray-200 rounded-full"></div>
                  <p className="font-semibold text-gray-700">Saving your order, please wait...</p>
                </div>
              )}

              {/* Step 3: Saved State */}
              {checkoutStep === "saved" && (
                <div className="flex flex-col items-center justify-center gap-4">
                  <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-2xl text-gray-800">Order Saved!</h3>
                  <p className="text-gray-600">Your Order ID is <strong className="text-black">{orderId}</strong>. Click below to finalize on WhatsApp.</p>
                  <a href={whatsappUrl!} target="_blank" rel="noopener noreferrer" onClick={handleFinalize} className="mt-2 w-full max-w-sm text-center px-6 py-4 rounded-xl font-semibold bg-green-600 text-white hover:bg-green-700 shadow-lg transform hover:scale-105 transition-transform">
                    Finalize on WhatsApp
                  </a>
                </div>
              )}
              
              {/* Step 4: Finalizing State */}
              {checkoutStep === "finalizing" && (
                <div className="flex flex-col items-center justify-center gap-3 py-10">
                   <div className="animate-pulse h-16 w-16 text-green-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                   </div>
                  <p className="font-semibold text-lg text-gray-700">Redirecting to WhatsApp...</p>
                  <p className="text-sm text-gray-500">Your order is complete. Thank you!</p>
                </div>
              )}
            </div>
          </div>
        )}
      </section>

      {toast && (
        <div className="fixed right-6 bottom-6 bg-black text-white px-4 py-2 rounded-lg shadow-lg">
          {toast}
        </div>
      )}
    </main>
  );
}
