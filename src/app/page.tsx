"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import HeroVideo from "./components/HeroVideo";

export default function HomePage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* Hero Section */}
      <section className="relative h-[100vh] flex flex-col items-center justify-center text-center">
        {/* Mobile (video) */}
        <div className="block md:hidden absolute inset-0">
          <HeroVideo />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        {/* Desktop (image) */}
        <div className="hidden md:block absolute inset-0">
          <Image
            src="/images/white-sauce-pasta.webp"
            alt="pasta"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>

        {/* Text overlay */}
        <div className="relative z-10 px-6 max-w-3xl space-y-6">
          <h1 className="text-4xl md:text-6xl font-extrabold text-amber-300 drop-shadow-lg">
            Fresh Food, Direct from Our Café
          </h1>
          <p className="text-lg md:text-xl text-white font-medium leading-relaxed">
            Skip the apps, save the commissions. Order directly from us at{" "}
            <span className="font-semibold text-amber-200">
              the same offline price
            </span>, with food always prepared fresh.
          </p>
          <button
            onClick={() => router.push("/menu")}
            className="px-8 py-3 rounded-2xl text-lg font-semibold bg-gradient-to-r from-yellow-400 to-yellow-600 text-black shadow-lg hover:scale-105 transition"
          >
            Order Now
          </button>
        </div>
      </section>

      {/* Popular Picks */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-14">
          Our Customers Love These
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            { name: "Blue Lagoon Mojito", price: "₹49", vid: "/videos/blue-lagoon-video.mp4" },
            { name: "Red Sauce Pasta", price: "₹119", vid: "/videos/red-sauce-video.mp4" },
            { name: "Classic Cold Coffee", price: "₹49", vid: "/videos/cold-coffee-video.mp4" },
          ].map((item) => (
            <div
              key={item.name}
              className="relative rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition"
            >
              <video
                src={item.vid}
                className="object-cover w-full h-80"
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center text-white">
                <h3 className="text-xl font-semibold">{item.name}</h3>
                <p className="text-lg">{item.price}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-12">
          <button
            onClick={() => router.push("/menu")}
            className="text-lg font-semibold text-yellow-600 hover:underline"
          >
            Browse Full Menu →
          </button>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gray-50 py-20 px-6">
        <h2 className="text-4xl font-bold text-center mb-16 text-gray-800">
          How Ordering Works
        </h2>

        <div className="relative max-w-6xl mx-auto">
          {/* Connector line for desktop */}
          <div className="hidden md:block absolute top-16 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full z-0"></div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative z-10">
            {[
              {
                step: "1",
                title: "Choose Your Dishes",
                desc: "Pick from freshly prepared pastas, snacks, beverages & desserts.",
              },
              {
                step: "2",
                title: "Pick Delivery Slot",
                desc: "Book your delivery 3+ hrs in advance — schedule for today or tomorrow.",
              },
              {
                step: "3",
                title: "Enjoy Fresh Food",
                desc: "We cook only after your order is confirmed, ensuring freshness.",
              },
            ].map((card, idx) => (
              <div
                key={card.step}
                className="relative p-8 bg-white/90 backdrop-blur-sm rounded-3xl shadow-md hover:shadow-xl transition transform hover:-translate-y-1"
              >
                {/* Step circle */}
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 text-white text-xl font-bold mb-4">
                  {card.step}
                </div>

                <h3 className="text-xl font-semibold mb-2 text-gray-800">
                  {card.title}
                </h3>
                <p className="text-gray-600">{card.desc}</p>

                {/* Connector line for mobile */}
                {idx < 2 && (
                  <div className="absolute bottom-0 left-1/10 transform -translate-x-1/2 translate-y-8 h-12 w-1 bg-gradient-to-b from-yellow-400 to-amber-500 md:hidden"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Gatherings */}
      <section className="py-20 px-6 bg-gradient-to-br from-yellow-50 to-yellow-100">
        <h2 className="text-4xl font-bold text-center mb-8">
          Perfect for Office Gatherings & Hostel Feasts
        </h2>
        <div className="max-w-4xl mx-auto text-center space-y-6 text-lg text-gray-700">
          <p>
            Planning an <span className="font-semibold">office party</span> or{" "}
            <span className="font-semibold">hostel night-out</span>? We make it simple.
          </p>
          <p>
            Order <span className="font-semibold">snacks, beverages, pizzas, burgers & desserts</span> directly —
            it’s the <span className="text-green-600 font-semibold">most affordable option</span> since you avoid commissions.
          </p>
          <p>
            We ensure timely delivery so you can{" "}
            <span className="font-semibold">focus on the fun</span>.
          </p>
          <button
            onClick={() => router.push("/menu")}
            className="mt-8 bg-yellow-500 text-black px-8 py-3 rounded-2xl text-lg font-semibold hover:bg-yellow-400 transition"
          >
            Plan Your Feast
          </button>
        </div>
      </section>

      {/* Why Us */}
      <section className="py-20 px-6 max-w-5xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-6">Why Order Direct?</h2>
        <p className="text-lg text-gray-700 mb-6">
          Food delivery apps charge{" "}
          <span className="font-semibold text-red-600">15–35% commissions</span> per order —
          costs that eventually come from <span className="font-semibold">you</span>.
        </p>
        <p className="text-lg text-gray-700 mb-6">
          By ordering here, you pay{" "}
          <span className="text-green-600 font-semibold">only the actual price</span> + delivery charge.
        </p>
        <div className="bg-yellow-100 p-6 rounded-2xl shadow max-w-3xl mx-auto">
          <p className="text-md font-medium text-gray-800">
            We aren’t against food delivery apps — they’re great for discovery. But here,{" "}
            <span className="font-semibold">you save more and eat fresher</span>.
          </p>
        </div>
      </section>

      {/* About */}
      <section className="py-20 px-6 max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-6">About Our Café</h2>
        <p className="text-lg text-gray-600 leading-relaxed">
          We started with one simple goal: to serve{" "}
          <span className="font-semibold">fresh, tasty, and affordable food</span>.
          Every order is made fresh and delivered with care. Ordering directly
          helps us keep prices low and quality high — thank you for supporting local!
        </p>
      </section>

      {/* Final CTA */}
      <section className="bg-yellow-500 py-16 text-center">
        <h2 className="text-4xl font-bold text-black">Hungry Already?</h2>
        <p className="text-lg mt-3 text-black/80">
          Place your order now and enjoy fresh café food in just a few hours.
        </p>
        <button
          onClick={() => router.push("/menu")}
          className="mt-8 bg-black text-white px-10 py-3 rounded-2xl text-lg font-semibold hover:bg-gray-800 transition"
        >
          Order Now
        </button>
      </section>
    </main>
  );
}
