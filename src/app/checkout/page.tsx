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

type CheckoutStep = "initial" | "saving" | "saved";

// Slot generation logic
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

  const [checkoutStep, setCheckoutStep] = useState<CheckoutStep>("initial");
  const [orderId, setOrderId] = useState<string | null>(null);

  const [phone, setPhone] = useState<string>("");
  const [phoneError, setPhoneError] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("cart");
    if (saved) {
      try {
        setCart(JSON.parse(saved));
      } catch {
        setCart([]);
      }
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

  const validatePhone = (value: string): string | null => {
    const trimmed = value.trim();
    if (!trimmed) return "Phone number is required";
    if (!/^\d+$/.test(trimmed)) return "Phone number should contain only digits";
    if (trimmed.length !== 10) return "Phone number should be 10 digits";
    // Optional: basic Indian mobile prefix check
    if (!/^[6-9]/.test(trimmed)) return "Enter a valid Indian mobile number";
    return null;
  };

  const handleConfirm = async () => {
    if (!selectedSlot) {
      setToast("Please select a delivery slot");
      setTimeout(() => setToast(null), 1800);
      return;
    }

    const error = validatePhone(phone);
    if (error) {
      setPhoneError(error);
      return;
    }
    setPhoneError(null);

    setCheckoutStep("saving");

    try {
      const response = await fetch("/api/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cart: cart,
          discounted: discounted,
          selectedSlot: selectedSlot,
          orderStatus: "placed",
          phone: phone.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save order. Please try again.");
      }

      const responseData = await response.json();
      const newOrderId = responseData.orderId;
      setOrderId(newOrderId);

      localStorage.removeItem("cart");
      setCart([]);
      setCheckoutStep("saved");
    } catch (error) {
      console.error("Confirmation error:", error);
      setToast(
        error instanceof Error ? error.message : "An unknown error occurred."
      );
      setCheckoutStep("initial");
      setTimeout(() => setToast(null), 2600);
    }
  };

  return (
    <main className="min-h-screen bg-white text-gray-800">
      {/* Header */}
      <section className="py-8 px-6 text-center bg-gray-100">
        <h1 className="text-4xl font-bold text-amber-500">Checkout</h1>
        <p className="mt-2 text-gray-600">
          Review your order, add your phone number and pick a convenient delivery
          slot.
        </p>
      </section>

      {/* Content */}
      <section className="py-8 px-6 max-w-6xl mx-auto">
        {cart.length === 0 && checkoutStep !== "saved" ? (
          <div className="text-center">
            <p className="text-lg text-gray-600">Your cart is empty.</p>
            <button
              onClick={() => router.push("/")}
              className="mt-4 bg-yellow-500 text-black px-6 py-3 rounded-xl font-semibold hover:bg-yellow-400"
            >
              Go to Menu
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Hide details after final success message if you want it simpler */}
            {checkoutStep !== "saved" && (
              <>
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

                {/* Slot Picker */}
                <div className="bg-white rounded-xl shadow p-4">
                  <h3 className="font-semibold mb-3">Choose Delivery Slot</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {groupedSlots.map(([dateStr, ds]) => (
                      <div key={dateStr}>
                        <div className="text-base font-semibold mb-2">
                          {dateStr}
                        </div>
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

                {/* Phone input */}
                <div className="bg-white rounded-xl shadow p-4">
                  <h3 className="font-semibold mb-2">Your Phone Number</h3>
                  <p className="text-xs text-gray-500 mb-3">
                    We will use this number to confirm your order and coordinate
                    delivery.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <span className="px-3 py-2 rounded-l-xl border border-r-0 border-gray-300 bg-gray-50 text-sm text-gray-600">
                        +91
                      </span>
                      <input
                        type="tel"
                        inputMode="numeric"
                        maxLength={10}
                        value={phone}
                        onChange={(e) => {
                          const v = e.target.value.replace(/\D/g, "");
                          setPhone(v);
                          if (phoneError) setPhoneError(null);
                        }}
                        placeholder="10-digit mobile number"
                        className={`flex-1 sm:w-64 px-3 py-2 rounded-r-xl border text-sm outline-none ${
                          phoneError
                            ? "border-red-500 focus:border-red-500"
                            : "border-gray-300 focus:border-amber-500"
                        }`}
                      />
                    </div>
                    {phoneError && (
                      <p className="text-xs text-red-600 mt-1">{phoneError}</p>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* Confirmation CTA / states */}
            <div className="bg-amber-50 p-6 rounded-xl text-center transition-all duration-300">
              {checkoutStep === "initial" && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-left">
                    <h3 className="font-bold text-lg text-gray-800">
                      Confirm your order
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      After you confirm, we will save your order and our team
                      will contact you shortly on your phone number to confirm
                      and arrange delivery.
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Please double-check your phone number and delivery slot.
                    </p>
                  </div>
                  <div className="flex gap-3 w-full sm:w-auto justify-end">
                    <button
                      onClick={() => router.push("/cart")}
                      className="px-5 py-3 rounded-xl border text-sm font-medium"
                    >
                      Back to cart
                    </button>
                    <button
                      onClick={handleConfirm}
                      disabled={!selectedSlot || !cart.length}
                      className={`px-5 py-3 rounded-xl text-sm font-semibold ${
                        selectedSlot && cart.length
                          ? "bg-green-600 text-white hover:bg-green-700"
                          : "bg-gray-300 text-gray-600 cursor-not-allowed"
                      }`}
                    >
                      Confirm Order
                    </button>
                  </div>
                </div>
              )}

              {checkoutStep === "saving" && (
                <div className="flex flex-col items-center justify-center gap-3">
                  <div className="animate-spin h-8 w-8 border-4 border-t-amber-500 border-gray-200 rounded-full"></div>
                  <p className="font-semibold text-gray-700">
                    Saving your order, please wait...
                  </p>
                </div>
              )}

              {checkoutStep === "saved" && (
                <div className="flex flex-col items-center justify-center gap-4 py-4">
                  <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
                    <svg
                      className="h-10 w-10 text-green-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <h3 className="font-bold text-2xl text-gray-800">
                    Order placed!
                  </h3>
                  {orderId && (
                    <p className="text-sm text-gray-700">
                      Your Order ID is{" "}
                      <span className="font-semibold text-black">
                        {orderId}
                      </span>
                      .
                    </p>
                  )}
                  <p className="text-sm text-gray-600 max-w-md">
                    Thank you for ordering from Caffeine Club. Our team will
                    contact you soon on{" "}
                    <span className="font-semibold">+91 {phone}</span> to
                    confirm your order and arrange delivery and payment.
                  </p>
                  <button
                    onClick={() => router.push("/")}
                    className="mt-2 px-6 py-3 rounded-xl font-semibold bg-yellow-500 text-black hover:bg-yellow-400"
                  >
                    Back to Home
                  </button>
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
