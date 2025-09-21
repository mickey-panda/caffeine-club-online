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

// ✅ Keep your slot generation logic
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

    // move forward 30 minutes
    current = new Date(current.getTime() + 30 * 60000);

    // if we've crossed midnight → reset to next day 1 PM
    if (current.getHours() === 0) {
      current.setHours(13, 0, 0, 0); // stay on SAME date but at 1 PM
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

  const handleConfirm = () => {
    if (!selectedSlot) {
      setToast("Please select a delivery slot");
      setTimeout(() => setToast(null), 1800);
      return;
    }
    const items = cart
      .map((c) => `${c.name} x${c.quantity} = ₹${c.price * c.quantity}`)
      .join("%0A");
    const totalLine = `Total: ₹${discounted}`;
    const slotLine = `Slot: ${selectedSlot.toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })}`;
    const message = `Hi, I placed an order:%0A${items}%0A${totalLine}%0A${slotLine}`;
    const phone = "7381400960";
    const url = `https://wa.me/${phone}?text=${message}`;
    window.open(url, "_blank");
    localStorage.removeItem("cart");
    setCart([]);
    setToast("Opening WhatsApp to confirm your order...");
    setTimeout(() => {
      setToast(null);
      router.push("/");
    }, 1500);
  };

  return (
    <main className="min-h-screen bg-white text-gray-800">
      {/* Header */}
      <section className="py-8 px-6 text-center bg-gray-100">
        <h1 className="text-4xl font-bold text-amber-500">Checkout</h1>
        <p className="mt-2 text-gray-600">
          Review your order and pick a convenient delivery slot.
        </p>
      </section>

      {/* Content */}
      <section className="py-8 px-6 max-w-6xl mx-auto">
        {cart.length === 0 ? (
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
            {/* Order Summary */}
            <div className="bg-white rounded-xl shadow p-4">
              <h2 className="text-xl font-bold mb-3">Order Summary</h2>
              <div className="text-sm text-gray-700">
                {cart.map((c) => (
                  <div key={c.id} className="flex justify-between py-1">
                    <div>
                      {c.name} - {c.category} x ({c.quantity})
                    </div>
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

            {/* Promo Section */}
            {/* <div className="bg-gray-50 p-4 rounded-xl">
              <h3 className="font-semibold">Have a promo code?</h3>
              <div className="mt-3 flex gap-3">
                <input
                  value={promo}
                  onChange={(e) => setPromo(e.target.value)}
                  placeholder="Enter promo code"
                  className="flex-1 px-3 py-2 border rounded-xl"
                />
                <button
                  onClick={applyPromo}
                  className="px-4 py-2 bg-black text-white rounded-xl"
                >
                  Apply
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Try <strong>WELCOME50</strong> for ₹50 off (min ₹200).
              </p>
            </div> */}

            {/* Slot Picker */}
            <div className="bg-white rounded-xl shadow p-4">
              <h3 className="font-semibold mb-3">Choose Delivery Slot</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {groupedSlots.map(([dateStr, ds]) => (
                  <div key={dateStr}>
                    <div className="text-base font-semibold mb-2">{dateStr}</div>
                    <div className="flex flex-wrap gap-2">
                      {ds.map((d) => {
                        const selected =
                          selectedSlot &&
                          selectedSlot.getTime() === d.getTime();
                        return (
                          <button
                            key={d.toString()}
                            onClick={() => setSelectedSlot(d)}
                            className={`px-3 py-2 text-sm rounded-lg border ${
                              selected
                                ? "bg-yellow-500 text-black border-yellow-500"
                                : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                            }`}
                          >
                            {d.toLocaleTimeString("en-IN", {
                              hour: "numeric",
                              minute: "2-digit",
                              hour12: true,
                            })}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Confirmation CTA */}
            <div className="bg-amber-50 p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <div className="text-sm text-gray-700">
                  Slot:{" "}
                  <span className="font-semibold">
                    {selectedSlot
                      ? selectedSlot.toLocaleString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                          hour12: true,
                        })
                      : "Not selected"}
                  </span>
                </div>
                <div className="text-xs italic text-gray-600 mt-1">
                  By confirming your order, you will be redirected to WhatsApp with your order details as a message. Our team will then contact you to confirm and arrange delivery and payment.
                </div>
              </div>

              <div className="flex gap-3 w-full sm:w-auto">
                <button
                  onClick={() => router.push("/cart")}
                  className="px-4 py-2 rounded-xl border"
                >
                  Back to cart
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={!selectedSlot}
                  className={`px-4 py-2 rounded-xl font-semibold ${
                    selectedSlot
                      ? "bg-green-600 text-white hover:bg-green-700"
                      : "bg-gray-300 text-gray-600 cursor-not-allowed"
                  }`}
                >
                  Confirm via WhatsApp
                </button>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Toast */}
      {toast && (
        <div className="fixed right-6 bottom-6 bg-black text-white px-4 py-2 rounded-lg shadow-lg">
          {toast}
        </div>
      )}
    </main>
  );
}
