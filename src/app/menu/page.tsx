"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import MenuLoader from "../components/MenuLoader";

interface MenuItem {
  id: number;
  name: string;
  category: string;
  price: number;
  isAvailable: boolean;
  quantity?: number; // Optional for display purposes
}

interface CartItem extends MenuItem {
  quantity: number;
}

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("Pizza");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Initialize cart from localStorage once on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setCart(parsedCart);
        console.log("Cart loaded from localStorage:", parsedCart);
      } catch (err) {
        console.error("Error parsing cart from localStorage:", err);
        setCart([]);
      }
    }
  }, []);

  // Fetch menu items and merge with cart quantities
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/upload-menu");
        const result = await response.json();

        if (response.ok) {
          const fetchedItems: MenuItem[] = result.data || [];
          
          // Merge cart quantities into menu items for display
          const updatedMenuItems = fetchedItems.map((item) => {
            const cartItem = cart.find((c) => c.id === item.id);
            return {
              ...item,
              quantity: cartItem ? cartItem.quantity : 0
            };
          });

          setMenuItems(updatedMenuItems);
          console.log("Menu items loaded and merged with cart:", updatedMenuItems);
        } else {
          setError(result.message || "Failed to fetch menu");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to fetch menu");
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []); // Empty dependency array - only run once

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem("cart", JSON.stringify(cart));
      console.log("Cart saved to localStorage:", cart);
    }
  }, [cart]);

  const categories = Array.from(
    new Set(menuItems.map((item) => item.category))
  ).filter((c) => c !== "No items");

  const filteredItems = menuItems.filter(
    (item) => item.category === selectedCategory
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
      
      console.log("Cart updated:", updatedCart);
      return updatedCart;
    });

    // Update menu items display immediately
    setMenuItems((prev) =>
      prev.map((menuItem) =>
        menuItem.id === item.id
          ? { ...menuItem, quantity: (menuItem.quantity || 0) + change }
          : menuItem
      )
    );
  };

  const getItemQuantity = (id: number) => {
    const found = cart.find((c) => c.id === id);
    return found ? found.quantity : 0;
  };

  const categoryImages: { [key: string]: string } = {
    Pizza: "/videos/pizza.mp4",
    Pasta: "/videos/red-sauce-video.mp4",
    Sandwich: "/videos/sandwich-video.mp4",
    Burger: "/videos/burger-video.mp4",
    Maggie: "/videos/maggie-video.mp4",
    Momo: "/videos/momo-video.mp4",
    Waffle: "/videos/waffle-video.mp4",
    "Waffle with Ice-Cream": "/videos/waffle-icecream-video.mp4",
    "Ice Cream": "/videos/icecream-video.mp4",
    "Special Ice Cream": "/videos/spl-icecream-video.mp4",
    Snacks: "/videos/snacks-video.mp4",
    "French Fries": "/videos/frenchfries-video.mp4",
    "Hot Beverages": "/images/hot-beverages.webp",
    "Cold Coffee": "/videos/cold-coffee-video.mp4",
    Mojito: "/videos/blue-lagoon-video.mp4",
    Milkshakes: "/videos/milkshake-video.mp4",
    "Add Ons": "/images/add-ons.webp",
    Brownies: "/images/brownie.webp",
    "Tortilla Wrap": "/videos/wrap-video.mp4",
    Muffins: "/images/muffin.webp",
  };

  return (
    <main className="min-h-screen bg-white text-gray-800">
      {/* Header */}
      <section className="py-6 px-6 text-center bg-gray-100 shadow-md">
        <h1 className="text-2xl font-bold text-amber-500">Caffeine Club, Madhapur</h1>
        <p className="mt-1 text-sm text-gray-600">Order fresh, tasty food anytime!</p>
      </section>

      {/* Category Selector */}
      <section className="py-3 bg-gray-50 sticky top-0 z-30 border-b border-gray-200">
        <div className="max-w-6xl mx-auto">
          <div className="relative">
            {/* Category Pills Container */}
            <div className="flex flex-nowrap gap-2 overflow-x-auto no-scrollbar pb-1">
              {categories.map((category, index) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`
                    relative px-5 py-2 text-sm font-medium whitespace-nowrap transition-all duration-200 ease-in-out
                    ${
                      selectedCategory === category
                        ? "bg-amber-500 text-white shadow-sm"
                        : "bg-white text-gray-700 hover:bg-gray-50 hover:text-amber-700 border border-gray-200 hover:border-amber-200"
                    }
                    rounded-full inline-flex items-center justify-center group
                    ${
                      index === 0 ? "ml-4" : index === categories.length - 1 ? "mr-4" : ""
                    }
                  `}
                >
                  {/* Category Text */}
                  <span className="relative z-10">
                    {category}
                  </span>
                </button>
              ))}
            </div>
            
            {/* Scroll Indicators */}
            <div className="absolute top-0 right-0 h-full w-4 bg-gradient-to-l from-white/0 to-white/90 pointer-events-none"></div>
            <div className="absolute top-0 left-0 h-full w-4 bg-gradient-to-r from-white/0 to-white/90 pointer-events-none"></div>
          </div>
        </div>
      </section>


      {/* Menu Items */}
      <section className="py-8 px-6 max-w-6xl mx-auto">
        {error ? (
          <p className="text-center text-lg text-red-600">Error: {error}</p>
        ) : (
          <div className="flex flex-col lg:flex-row lg:gap-6">
            {/* Category Video */}
            <div className="relative h-64 mb-8 lg:mb-0 lg:w-2/5 lg:h-[400px] rounded-xl overflow-hidden shadow-lg">
              {loading ? (
                <MenuLoader />
              ) : (
                <>
                  <video
                    src={categoryImages[selectedCategory] || "/videos/default-menu.mp4"}
                    className="object-cover w-full h-full"
                    autoPlay
                    muted
                    loop
                    playsInline
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <h2 className="absolute bottom-4 left-4 text-3xl font-bold text-white drop-shadow-lg">
                    {selectedCategory}
                  </h2>
                </>
              )}
            </div>

            {/* Items List */}
            <div className="lg:w-3/5">
              {loading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-32 bg-gray-200 animate-pulse rounded-xl"
                    ></div>
                  ))}
                </div>
              ) : filteredItems.length === 0 ? (
                <p className="text-center text-lg text-gray-600">
                  No items in this category.
                </p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                  {filteredItems.map((item) => {
                    const qty = getItemQuantity(item.id);
                    return (
                      <div
                        key={item.id}
                        className="bg-white shadow-lg rounded-xl p-4 flex flex-col justify-between hover:shadow-xl transition"
                      >
                        <div>
                          <h3 className="text-lg font-semibold">{item.name}</h3>
                          <p className="text-gray-600">₹{item.price}</p>
                          <p
                            className={`text-sm ${
                              item.isAvailable ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            {item.isAvailable ? "Available" : "Not Available"}
                          </p>
                        </div>
                        {item.isAvailable ? (
                          qty > 0 ? (
                            <div className="flex items-center justify-between mt-3 bg-yellow-100 rounded-lg">
                              <button
                                onClick={() => updateCart(item, -1)}
                                className="px-3 py-1 font-bold text-lg"
                              >
                                −
                              </button>
                              <span className="font-semibold">{qty}</span>
                              <button
                                onClick={() => updateCart(item, 1)}
                                className="px-3 py-1 font-bold text-lg"
                              >
                                +
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => updateCart(item, 1)}
                              className="mt-3 w-full py-2 rounded-lg font-medium bg-yellow-500 text-black hover:bg-yellow-400 transition"
                            >
                              Add to Cart
                            </button>
                          )
                        ) : (
                          <button
                            disabled
                            className="mt-3 w-full py-2 rounded-lg font-medium bg-gray-300 text-gray-500 cursor-not-allowed"
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

      {/* Floating Cart Button */}
      {cart.length > 0 && (
        <button
          onClick={() => router.push("/cart")}
          className="fixed bottom-6 right-6 bg-yellow-500 text-black p-4 rounded-full shadow-lg hover:bg-yellow-400 transition z-30"
        >
          🛒 {cart.reduce((total, item) => total + item.quantity, 0)}
        </button>
      )}
    </main>
  );
}