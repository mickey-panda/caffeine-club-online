"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Define MenuItem interface to match the API response
interface MenuItem {
  id: number;
  name: string;
  category: string;
  price: number;
  isAvailable: boolean;
}

// Define CartItem interface for cart management
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

  // Initialize cart from localStorage on mount
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

  // Fetch menu items on mount
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/upload-menu", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const result = await response.json();
        if (response.ok) {
          setMenuItems(result.data || []);
        } else {
          setError(result.message || "Failed to fetch menu items");
        }
      } catch {
        setError("Failed to fetch menu items");
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, []);

  // Get unique categories from menu items
  const categories = Array.from(
    new Set(menuItems.map((item) => item.category))
  ).filter((category) => category !== "No items");

  // Filter items by selected category
  const filteredItems = menuItems.filter(
    (item) => item.category === selectedCategory
  );

  // Add item to cart and save to localStorage
  const addToCart = (item: MenuItem) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.id === item.id);
      let updatedCart: CartItem[];
      if (existingItem) {
        updatedCart = prevCart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        updatedCart = [...prevCart, { ...item, quantity: 1 }];
      }
      // Save updated cart to localStorage
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  // Category images mapping (adjust paths as needed)
  const categoryImages: { [key: string]: string } = {
    Pizza: "/videos/pizza.mp4",
    Pasta: "/videos/red-sauce-video.mp4",
    Sandwich: "/images/sandwich.webp",
    Burger: "/images/burger.webp",
    Maggie: "/images/maggie.webp",
    Momo: "/images/momo.webp",
    Waffle: "/images/waffle.webp",
    "Waffle with Ice-Cream": "/images/waffle-ice-cream.webp",
    "Ice Cream": "/images/ice-cream.webp",
    "Special Ice Cream": "/images/special-ice-cream.webp",
    Snacks: "/images/snacks.webp",
    "French Fries": "/images/french-fries.webp",
    "Hot Beverages": "/images/hot-beverages.webp",
    "Cold Coffee": "/images/cold-coffee.webp",
    Mojito: "/images/mojito.webp",
    Milkshakes: "/images/milkshake.webp",
    "Add Ons": "/images/add-ons.webp",
    Brownies: "/images/brownie.webp",
    "Tortilla Wrap": "/images/tortilla-wrap.webp",
    Muffins: "/images/muffin.webp",
  };

  return (
    <main className="min-h-screen bg-white text-gray-800">
      {/* Header */}
      <section className="py-8 px-6 text-center bg-gray-100">
        <h1 className="text-4xl font-bold text-amber-500">Caffeine Club, Madhapur</h1>
        <p className="mt-2 text-lg text-gray-600">
          Explore our delicious offerings, freshly made for you!
        </p>
      </section>

      {/* Category Selector */}
      <section className="py-0 px-0 bg-gray-50 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto overflow-x-auto no-scrollbar">
          <div className="flex space-x-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 whitespace-nowrap ${
                  selectedCategory === category
                    ? "bg-yellow-500 text-black shadow-md"
                    : "bg-gray-200 text-gray-800 hover:bg-yellow-400 hover:text-black"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Menu Items */}
      <section className="py-8 px-6 max-w-6xl mx-auto">
        {loading ? (
          <p className="text-center text-lg">Loading menu...</p>
        ) : error ? (
          <p className="text-center text-lg text-red-600">Error: {error}</p>
        ) : (
          <div className="flex flex-col lg:flex-row lg:gap-6">
            {/* Category Image */}
            <div className="relative h-64 mb-8 lg:mb-0 lg:w-2/5 lg:h-[400px] rounded-xl overflow-hidden shadow-lg">
              <video
                src={categoryImages[selectedCategory] || "/videos/default-menu.mp4"}
                className="object-cover w-full h-full"
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <h2 className="absolute bottom-4 left-4 text-2xl font-bold text-white">
                {selectedCategory}
              </h2>
            </div>

            {/* Items List */}
            <div className="lg:w-3/5">
              {filteredItems.length === 0 ? (
                <p className="text-center text-lg text-gray-600">
                  No items available in this category.
                </p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredItems.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white shadow-lg rounded-xl overflow-hidden group hover:shadow-xl transition"
                    >
                      <div className="p-4">
                        <h3 className="text-lg font-semibold text-gray-800">
                          {item.name}
                        </h3>
                        <p className="text-gray-600">₹{item.price}</p>
                        <p
                          className={`text-sm ${
                            item.isAvailable ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {item.isAvailable ? "Available" : "Not Available"}
                        </p>
                        <button
                          onClick={() => item.isAvailable && addToCart(item)}
                          disabled={!item.isAvailable}
                          className={`mt-3 w-full py-2 rounded-lg font-medium transition ${
                            item.isAvailable
                              ? "bg-yellow-500 text-black hover:bg-yellow-400"
                              : "bg-gray-300 text-gray-500 cursor-not-allowed"
                          }`}
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </section>

      {/* Cart Icon (Visible when cart has items) */}
      {cart.length > 0 && (
        <button
          onClick={() => router.push("/cart")}
          className="fixed bottom-6 right-6 bg-yellow-500 text-black p-4 rounded-full shadow-lg hover:bg-yellow-400 transition z-30"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
            {cart.reduce((total, item) => total + item.quantity, 0)}
          </span>
        </button>
      )}
    </main>
  );
}