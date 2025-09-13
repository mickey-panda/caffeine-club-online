"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import HeroVideo from "./components/HeroVideo";

export default function HomePage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-white text-gray-800">
      {/* Hero Section */}
      <section className="relative h-[100vh] flex flex-col items-center justify-center text-center bg-gray-0 text-white">
        <div>
          {/* Small screen only */}
          <div className="block md:hidden">
            <HeroVideo />
          </div>

          {/* Medium & Large screens */}
          <div className="hidden md:block">
            <Image
              src="/images/white-sauce-pasta.webp"
              alt="pasta"
              fill
              className="object-cover"
            />
          </div>
        </div>
        <div className="relative z-10 px-6 w-full h-full flex flex-col items-center justify-center space-y-24 md:space-y-16 lg:space-y-8">
          <h1
            className="text-4xl md:text-6xl font-bold text-amber-300"
            style={{
              textShadow: "3px 3px 6px rgba(0,0,0,1)",
            }}
          >
            Fresh Food, Direct from Our Café
          </h1>
          <p
            className="mt-4 text-lg md:text-xl font-bold text-white"
            style={{
              WebkitTextStroke: "0.2px red", // black border
              WebkitTextFillColor: "black",  // keep text white
            }}
            >
            Order for your gatherings — at least 3 hours before delivery.
          </p>
          <button
            onClick={() => router.push("/menu")}
            className="
              mt-6 
              px-6 py-3 
              rounded-xl 
              text-lg font-semibold 
              bg-gradient-to-r from-yellow-400 to-yellow-600 
              text-black 
              shadow-[0_4px_0px_rgba(0,0,0,0.2)] 
              hover:shadow-[0_6px_0px_rgba(0,0,0,0.25)] 
              active:translate-y-1 
              transition-all duration-200
            "
          >
            Order Now
          </button>
        </div>
      </section>

      {/* Menu Highlights */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-10">Popular Picks</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { name: "Blue Lagoon Mojito", price: "₹49", vid: "/videos/blue-lagoon-video.mp4" },
            { name: "Red Sauce Pasta", price: "₹119", vid: "/videos/red-sauce-video.mp4" },
            { name: "Cold Coffee", price: "₹49", vid: "/videos/cold-coffee-video.mp4" },
          ].map((item) => (
            <div
              key={item.name}
              className="relative bg-white shadow-lg rounded-2xl overflow-hidden group hover:shadow-xl transition"
            >
              {/* Video fills parent */}
              <video
                src={item.vid}
                className="object-cover w-full h-92"
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
              />

              {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

                {/* Text over video */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center text-white">
                  <h3 className="text-xl font-semibold">{item.name}</h3>
                  <p className="text-lg">{item.price}</p>
                  <button
                    onClick={() => router.push("/menu")}
                    className="mt-3 bg-yellow-500 text-black px-4 py-2 rounded-lg font-medium hover:bg-yellow-400 transition"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>

        {/* Full menu button */}
        <div className="text-center mt-10">
          <button
            onClick={() => router.push("/menu")}
            className="text-lg font-semibold text-yellow-600 hover:underline"
          >
            See Full Menu →
          </button>
        </div>
      </section>


      {/* How It Works */}
      <section className="bg-gray-100 py-16 px-6">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center max-w-6xl mx-auto">
          <div className="p-6 bg-white rounded-xl shadow">
            <h3 className="text-xl font-semibold mb-2">1. Choose Dishes</h3>
            <p>Select from our freshly made café favorites.</p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow">
            <h3 className="text-xl font-semibold mb-2">2. Pick Delivery Time</h3>
            <p>Order at least 3 hours before or even a day in advance.</p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow">
            <h3 className="text-xl font-semibold mb-2">3. Enjoy!</h3>
            <p>Delivered via Rapido/local partners (delivery charge extra).</p>
          </div>
        </div>
      </section>

      {/* Why Our Website Section */}
      <section className="py-16 px-6 max-w-5xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-6">Why Order From Our Website?</h2>
        <p className="text-lg text-gray-700 mb-4">
          Most online food delivery apps charge restaurants a{" "}
          <span className="font-semibold text-red-600">15–35% commission</span> on every order.
          That extra cost ultimately comes from <span className="font-semibold">you, the customer</span>.
        </p>
        <p className="text-lg text-gray-700 mb-4">
          With our own website, you pay the{" "}
          <span className="font-semibold text-green-600">same price online as offline</span> —
          no extra commissions, only the actual delivery charge.
        </p>
        <p className="text-lg text-gray-700">
          Since we know your order at least 3 hours before, your food is{" "}
          <span className="font-semibold">always prepared fresh</span> and ready on time.
        </p>
        <div className="mt-8 bg-yellow-100 p-6 rounded-2xl shadow text-gray-800">
          <p className="text-md">
            We are <span className="font-semibold">not against food delivery apps</span> — they do
            a great job connecting multiple restaurants to you. But our mission is to{" "}
            <span className="font-semibold">make food affordable and fresh</span>, even when ordered online.
          </p>
        </div>
      </section>

      {/* Gatherings & Group Orders Section */}
      <section className="bg-gray-50 py-16 px-6">
        <h2 className="text-3xl font-bold text-center mb-8">
          Perfect for Gatherings & Small Feasts
        </h2>
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-lg text-gray-700 mb-6">
            Planning an <span className="font-semibold">office party</span> or a{" "}
            <span className="font-semibold">hostel night feast</span>? We’ve got you covered.
          </p>
          <p className="text-lg text-gray-700 mb-6">
            Order <span className="font-semibold">snacks, cold beverages, pizzas, burgers, and desserts</span> directly from us.
            It’s the <span className="font-semibold text-green-600">most affordable option</span> — no commissions, only fresh food.
          </p>
          <p className="text-lg text-gray-700">
            Whether it’s a small team hangout or a late-night hostel celebration, you’ll save money and get{" "}
            <span className="font-semibold">delicious food on time</span>.
          </p>
          <button
            onClick={() => router.push("/menu")}
            className="mt-8 bg-yellow-500 text-black px-6 py-3 rounded-xl text-lg font-semibold hover:bg-yellow-400 transition"
          >
            Plan Your Feast
          </button>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 px-6 max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-6">About Our Café</h2>
        <p className="text-lg text-gray-600">
          We started our café with one goal: to serve fresh, tasty, and affordable
          food directly to you. By ordering here, you save on extra commissions
          charged by food apps. Your support keeps us brewing happiness every day!
        </p>
      </section>

      {/* CTA */}
      <section className="bg-yellow-500 py-12 text-center">
        <h2 className="text-3xl font-bold text-black">
          Ready to place your order?
        </h2>
        <button
          onClick={() => router.push("/menu")}
          className="mt-6 bg-black text-white px-8 py-3 rounded-xl text-lg font-semibold hover:bg-gray-800 transition"
        >
          Order Now
        </button>
      </section>
    </main>
  );
}
