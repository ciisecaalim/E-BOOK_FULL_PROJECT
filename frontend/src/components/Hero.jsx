import React from "react";
import books from "../assets/images/woman.png"; // Main e-book image
import { FaArrowRight, FaRocket, FaBook } from "react-icons/fa";

function HeroBookStore() {
  return (
    <section className="w-full h-screen relative overflow-hidden bg-gray-900">
      {/* Neon glow shapes */}
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-purple-500 rounded-full blur-3xl opacity-40 animate-pulse"></div>
      <div className="absolute bottom-10 right-1/3 w-80 h-80 bg-pink-500 rounded-full blur-2xl opacity-30 animate-pulse"></div>

      {/* Floating E-Book Icons */}
      <FaBook className="absolute top-20 left-10 text-yellow-400 w-6 h-6 animate-bounce-slow" />
      <FaBook className="absolute top-1/4 right-20 text-green-400 w-5 h-5 animate-spin-slow" />
      <FaBook className="absolute bottom-32 left-1/3 text-pink-400 w-7 h-7 animate-bounce-slow delay-200" />
      <FaBook className="absolute bottom-20 right-10 text-purple-400 w-6 h-6 animate-spin-slow delay-300" />
      <FaBook className="absolute top-40 right-1/4 text-blue-400 w-5 h-5 animate-bounce-slow delay-400" />

      <div className="container mx-auto px-6 md:px-20 flex flex-col-reverse md:flex-row items-center justify-between h-full gap-10 relative z-10">
        
        {/* Left Text Section */}
        <div className="flex-1 text-left space-y-6">
          <p className="text-pink-500 font-bold text-sm uppercase tracking-widest">
            Welcome to Your E-Book Store
          </p>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight">
            Discover <span className="text-purple-400">Digital Worlds</span>
          </h1>
          <p className="text-gray-300 text-base md:text-lg max-w-md">
            Explore thousands of e-books instantly. Dive into digital adventures, 
            knowledge, and inspiration—all from your screen. Your next read is just a click away!
          </p>

          {/* CTA Buttons */}
          <div className="flex gap-4 mt-4">
            <button className="bg-purple-500 hover:bg-purple-600 transition text-white font-bold px-6 py-3 rounded-lg flex items-center gap-2 shadow-lg">
              Browse E-Books <FaArrowRight />
            </button>
            <button className="bg-transparent border-2 border-pink-500 hover:bg-pink-500 hover:text-white transition text-pink-500 font-semibold px-6 py-3 rounded-lg flex items-center gap-2 shadow">
              Explore Categories <FaRocket />
            </button>
          </div>
        </div>

        {/* Right Image Section */}
        <div className="flex-1 relative flex justify-center md:justify-end">
          <div className="w-[300px] h-[400px] md:w-[400px] md:h-[500px] bg-gradient-to-tr from-pink-500 to-purple-500 rounded-3xl overflow-hidden shadow-2xl transform rotate-12 md:rotate-6">
            <img
              src={books}
              alt="E-Books"
              className="w-full h-full object-cover mix-blend-overlay"
            />
          </div>

          {/* Floating Badge */}
          <div className="absolute -bottom-6 right-0 bg-purple-900/90 backdrop-blur-md shadow-lg rounded-2xl px-6 py-4 text-center animate-bounce">
            <h3 className="text-2xl font-bold text-pink-400">10K+</h3>
            <p className="text-sm text-gray-300">E-Books Available</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroBookStore;
