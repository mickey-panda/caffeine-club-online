"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import MenuLoader from "../components/MenuLoader"; // adjust path if needed

interface MenuItem {
  id: number;
  name: string;
  category: string;
  price: number;
  isAvailable: boolean;
  quantity?: number;
}

interface CartItem extends MenuItem {
  quantity: number;
}

export default function MenuPage() {
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("Pizza");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch {
        setCart([]);
      }
    }
  }, []);

  // Fetch menu and merge with cart quantities
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/upload-menu");
        const result = await response.json();

        if (response.ok) {
          const fetchedItems: MenuItem[] = result.data || [];
          const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
          const updatedMenuItems = fetchedItems.map((item) => {
            const cartItem = savedCart.find(
              (c: CartItem) => c.id === item.id
            );
            return { ...item, quantity: cartItem ? cartItem.quantity : 0 };
          });
          setMenuItems(updatedMenuItems);
        } else {
          setError(result.message || "Failed to fetch menu");
        }
      } catch {
        setError("Failed to fetch menu");
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  // Persist cart to localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const categories = useMemo(
    () =>
      Array.from(new Set(menuItems.map((i) => i.category))).filter(
        (c) => c !== "No items"
      ),
    [menuItems]
  );

  const filteredItems = useMemo(
    () => menuItems.filter((i) => i.category === selectedCategory),
    [menuItems, selectedCategory]
  );

  const updateCart = (item: MenuItem, change: number) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === item.id);
      let updatedCart: CartItem[];

      if (existing) {
        const newQty = existing.quantity + change;
        if (newQty <= 0) {
          updatedCart = prev.filter((c) => c.id !== item.id);
        } else {
          updatedCart = prev.map((c) =>
            c.id === item.id ? { ...c, quantity: newQty } : c
          );
        }
      } else {
        updatedCart = [...prev, { ...item, quantity: 1 }];
      }

      return updatedCart;
    });

    setMenuItems((prev) =>
      prev.map((menuItem) =>
        menuItem.id === item.id
          ? { ...menuItem, quantity: (menuItem.quantity || 0) + change }
          : menuItem
      )
    );
  };

  const getItemQuantity = (id: number) =>
    cart.find((c) => c.id === id)?.quantity || 0;

  const totalCartItems = cart.reduce((t, i) => t + i.quantity, 0);

  const categoryMedia: {
    [key: string]: { type: "video" | "image"; src: string };
  } = {
    Pizza: { type: "video", src: "/videos/pizza.mp4" },
    Pasta: { type: "video", src: "/videos/red-sauce-video.mp4" },
    Sandwich: { type: "video", src: "/videos/sandwich-video.mp4" },
    Burger: { type: "video", src: "/videos/burger-video.mp4" },
    Maggie: { type: "video", src: "/videos/maggie-video.mp4" },
    Momo: { type: "video", src: "/videos/momo-video.mp4" },
    Waffle: { type: "video", src: "/videos/waffle-video.mp4" },
    "Waffle with Ice-Cream": {
      type: "video",
      src: "/videos/waffle-icecream-video.mp4",
    },
    "Ice Cream": { type: "video", src: "/videos/icecream-video.mp4" },
    "Special Ice Cream": {
      type: "video",
      src: "/videos/spl-icecream-video.mp4",
    },
    Snacks: { type: "video", src: "/videos/snacks-video.mp4" },
    "French Fries": { type: "video", src: "/videos/frenchfries-video.mp4" },
    "Hot Beverages": { type: "image", src: "/images/hot-beverages.webp" },
    "Cold Coffee": { type: "video", src: "/videos/cold-coffee-video.mp4" },
    Mojito: { type: "video", src: "/videos/blue-lagoon-video.mp4" },
    Milkshakes: { type: "video", src: "/videos/milkshake-video.mp4" },
    "Add Ons": { type: "image", src: "/images/add-ons.webp" },
    Brownies: { type: "image", src: "/images/brownie.webp" },
    "Tortilla Wrap": { type: "video", src: "/videos/wrap-video.mp4" },
    Muffins: { type: "image", src: "/images/muffin.webp" },
  };

  const selectedMedia = categoryMedia[selectedCategory];

  const scrollToMenu = () => {
    menuRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="min-h-screen bg-white text-gray-800">
      {/* ─── HERO SECTION ─────────────────────────────────────────── */}
      <section className="relative h-[100dvh] flex flex-col items-center justify-center text-center overflow-hidden">
        {/* Background: video on mobile, image on desktop */}
        <div className="block md:hidden absolute inset-0">
          <video
            src="/videos/cold-coffee-video.mp4"
            className="object-cover w-full h-full"
            autoPlay
            muted
            loop
            playsInline
          />
          <div className="absolute inset-0 bg-black/55" />
        </div>
        <div className="hidden md:block absolute inset-0">
          <Image
            src="/images/white-sauce-pasta.webp"
            alt="Caffeine Club food"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/55" />
        </div>

        {/* Text overlay */}
        <div className="relative z-10 px-6 max-w-3xl space-y-5">
          <p className="text-xs sm:text-sm uppercase tracking-widest text-amber-300 font-semibold">
            Caffeine Club, Madhapur
          </p>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white drop-shadow-lg leading-tight">
            Fresh Food,{" "}
            <span className="text-amber-300">Direct from Our Café</span>
          </h1>
          <p className="text-base md:text-lg text-gray-200 font-medium leading-relaxed">
            Skip the apps, save the commissions. Order at{" "}
            <span className="font-semibold text-amber-200">offline prices</span>{" "}
            — food always prepared fresh after confirmation.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={scrollToMenu}
              className="px-8 py-3 rounded-2xl text-base font-bold bg-gradient-to-r from-yellow-400 to-amber-500 text-black shadow-lg hover:scale-105 transition w-full sm:w-auto"
            >
              Order Now 🍕
            </button>
            <button
              onClick={scrollToMenu}
              className="px-8 py-3 rounded-2xl text-base font-medium border border-white/40 text-white hover:bg-white/10 transition w-full sm:w-auto"
            >
              Browse Menu ↓
            </button>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-3">
            {[
              "No hidden fees",
              "Fresh on every order",
              "Slots 1 PM – 11 PM",
            ].map((b) => (
              <span
                key={b}
                className="px-3 py-1 text-xs rounded-full bg-white/15 border border-white/20 text-white backdrop-blur-sm"
              >
                {b}
              </span>
            ))}
          </div>
        </div>

        {/* Scroll arrow */}
        <button
          onClick={scrollToMenu}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 hover:text-white animate-bounce"
          aria-label="Scroll to menu"
        >
          <svg
            className="w-7 h-7"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </section>

      {/* ─── POPULAR PICKS ────────────────────────────────────────── */}
      <section className="py-14 px-6 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-2">
          Our Customers Love These
        </h2>
        <p className="text-center text-gray-500 text-sm mb-10">
          Tap a favourite to jump straight to it in the menu below.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            {
              name: "Blue Lagoon Mojito",
              price: "₹49",
              category: "Mojito",
              vid: "/videos/blue-lagoon-video.mp4",
            },
            {
              name: "Red Sauce Pasta",
              price: "₹119",
              category: "Pasta",
              vid: "/videos/red-sauce-video.mp4",
            },
            {
              name: "Classic Cold Coffee",
              price: "₹49",
              category: "Cold Coffee",
              vid: "/videos/cold-coffee-video.mp4",
            },
          ].map((item) => (
            <button
              key={item.name}
              onClick={() => {
                setSelectedCategory(item.category);
                scrollToMenu();
              }}
              className="relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition group text-left"
            >
              <video
                src={item.vid}
                className="object-cover w-full h-60"
                autoPlay
                muted
                loop
                playsInline
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:from-black/90 transition" />
              <div className="absolute bottom-5 left-5 text-white">
                <h3 className="text-lg font-semibold">{item.name}</h3>
                <p className="text-sm text-amber-300">{item.price}</p>
              </div>
              <span className="absolute top-3 right-3 text-[10px] font-semibold bg-amber-400 text-black px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition">
                View in menu →
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* ─── CATEGORY QUICK ACCESS ────────────────────────────────── */}
      <section className="py-10 px-6 bg-gray-50 border-y border-gray-200">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl font-bold text-center mb-1">
            What are you craving?
          </h2>
          <p className="text-center text-sm text-gray-500 mb-6">
            Pick a category to jump right in.
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-3">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  scrollToMenu();
                }}
                className={`rounded-xl border px-2 py-2 text-xs sm:text-sm font-medium text-center transition hover:shadow-sm
                  ${
                    selectedCategory === cat
                      ? "border-amber-500 bg-amber-50 text-amber-700 shadow-sm"
                      : "border-gray-200 bg-white text-gray-700 hover:border-amber-300 hover:text-amber-700"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ─── STICKY CATEGORY PILLS ────────────────────────────────── */}
      <div ref={menuRef} />
      <section className="py-3 bg-white sticky top-0 z-30 border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-2">
          <div className="relative">
            <div className="flex flex-nowrap gap-2 overflow-x-auto no-scrollbar pb-1 px-2">
              {categories.map((category, index) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`
                    px-5 py-2 text-sm font-medium whitespace-nowrap rounded-full transition-all duration-200
                    ${index === 0 ? "ml-2" : ""}
                    ${index === categories.length - 1 ? "mr-2" : ""}
                    ${
                      selectedCategory === category
                        ? "bg-amber-500 text-white shadow-sm"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-amber-700 border border-gray-200"
                    }
                  `}
                >
                  {category}
                </button>
              ))}
            </div>
            <div className="absolute top-0 right-0 h-full w-6 bg-gradient-to-l from-white to-transparent pointer-events-none" />
            <div className="absolute top-0 left-0 h-full w-6 bg-gradient-to-r from-white to-transparent pointer-events-none" />
          </div>
        </div>
      </section>

      {/* ─── MENU ITEMS ───────────────────────────────────────────── */}
      <section className="py-8 px-4 sm:px-6 max-w-6xl mx-auto mb-8">
        {error ? (
          <p className="text-center text-red-600 text-lg">{error}</p>
        ) : (
          <div className="flex flex-col lg:flex-row lg:gap-6">
            {/* Category media */}
            <div className="relative h-56 sm:h-64 mb-6 lg:mb-0 lg:w-2/5 lg:h-[400px] rounded-xl overflow-hidden shadow-lg flex-shrink-0">
              {loading ? (
                <MenuLoader />
              ) : selectedMedia ? (
                <>
                  {selectedMedia.type === "video" ? (
                    <video
                      src={selectedMedia.src}
                      className="object-cover w-full h-full"
                      autoPlay
                      muted
                      loop
                      playsInline
                    />
                  ) : (
                    <Image
                      src={selectedMedia.src}
                      alt={selectedCategory}
                      className="object-cover w-full h-full"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h2 className="text-2xl sm:text-3xl font-bold text-white drop-shadow-lg">
                      {selectedCategory}
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-200 mt-1">
                      Tap + to add items · Open cart to checkout
                    </p>
                  </div>
                </>
              ) : (
                <MenuLoader />
              )}
            </div>

            {/* Items grid */}
            <div className="lg:w-3/5">
              {loading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-32 bg-gray-200 animate-pulse rounded-xl"
                    />
                  ))}
                </div>
              ) : filteredItems.length === 0 ? (
                <p className="text-center text-gray-600">
                  No items in this category.
                </p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
                  {filteredItems.map((item) => {
                    const qty = getItemQuantity(item.id);
                    return (
                      <div
                        key={item.id}
                        className="bg-white shadow-sm border border-gray-100 rounded-xl p-3 sm:p-4 flex flex-col justify-between hover:shadow-md transition"
                      >
                        <div>
                          <h3 className="text-sm sm:text-base font-semibold line-clamp-2 text-gray-800">
                            {item.name}
                          </h3>
                          <p className="text-sm sm:text-base text-gray-700 mt-1 font-medium">
                            ₹{item.price}
                          </p>
                          <p
                            className={`text-[11px] sm:text-xs mt-1 font-medium ${
                              item.isAvailable
                                ? "text-green-600"
                                : "text-red-500"
                            }`}
                          >
                            {item.isAvailable ? "● Available" : "● Not Available"}
                          </p>
                        </div>

                        {item.isAvailable ? (
                          qty > 0 ? (
                            <div className="flex items-center justify-between mt-3 bg-yellow-100 rounded-lg overflow-hidden">
                              <button
                                onClick={() => updateCart(item, -1)}
                                className="px-3 py-2 font-bold text-xl text-gray-700 hover:bg-yellow-200 transition"
                              >
                                −
                              </button>
                              <span className="font-bold text-sm sm:text-base">
                                {qty}
                              </span>
                              <button
                                onClick={() => updateCart(item, 1)}
                                className="px-3 py-2 font-bold text-xl text-gray-700 hover:bg-yellow-200 transition"
                              >
                                +
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => updateCart(item, 1)}
                              className="mt-3 w-full py-2 rounded-lg font-medium bg-yellow-500 text-black hover:bg-yellow-400 text-sm transition"
                            >
                              Add to Cart
                            </button>
                          )
                        ) : (
                          <button
                            disabled
                            className="mt-3 w-full py-2 rounded-lg font-medium bg-gray-200 text-gray-400 cursor-not-allowed text-sm"
                          >
                            Not Available
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </section>

      {/* ─── FLOATING CART ────────────────────────────────────────── */}
      {totalCartItems > 0 && (
        <button
          onClick={() => router.push("/cart")}
          className="fixed bottom-6 right-6 bg-yellow-500 text-black px-5 py-3 rounded-full shadow-xl hover:bg-yellow-400 transition z-40 flex items-center gap-2 font-semibold text-sm"
        >
          <span>🛒</span>
          <span>{totalCartItems} item{totalCartItems > 1 ? "s" : ""}</span>
          <span className="hidden sm:inline">→ Cart</span>
        </button>
      )}
    </main>
  );
}
