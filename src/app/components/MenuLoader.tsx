"use client";

import React from "react";

export default function MenuLoader() {
  return (
    <div className="flex flex-col items-center justify-center h-[70vh] w-full relative">
      {/* Background Video */}
      <video
        src="/videos/pizza.mp4" // or "/videos/pasta.mp4"
        className="object-cover w-full h-full transition-opacity duration-700 ease-in-out"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center">
        {/* <h2 className="text-2xl sm:text-3xl font-bold text-amber-400 mb-4">
          Loading Our Delicious Menu 🍕
        </h2> */}
        {/* <p className="text-gray-200 text-sm sm:text-base animate-pulse">
          Fresh food is on the way...
        </p> */}

        {/* Simple spinner */}
        {/* <div className="mt-6 h-10 w-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin"></div> */}
      </div>
    </div>
  );
}
