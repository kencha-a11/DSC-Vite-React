// src/pages/HomePage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import monitor from '../assets/monitor.png';

function HomePage() {
  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        background:
          "linear-gradient(80.51deg, #55084E 10.98%, #5F0A53 23.59%, #861269 43.28%, #8E146D 50.05%, #ED28A2 95.3%)",
      }}
    >
      {/* Decorative Circles */}

      {/* Small Pink Circle (left) */}
      <div
        className="
          absolute rounded-full bg-pink-600 opacity-70
          left-4 top-24
          sm:left-8 sm:top-32
          md:left-14 md:top-40
          w-10 h-10
          sm:w-14 sm:h-14
          md:w-20 md:h-20
        "
      ></div>

      {/* Large Purple Circle */}
      <div
        className="
          absolute rounded-full opacity-50 blur-sm
          right-4 top-60
          sm:right-20 sm:top-40
          md:right-60 md:top-24
          w-[250px] h-[250px]
          sm:w-[400px] sm:h-[400px]
          md:w-[700px] md:h-[700px]
          bg-[radial-gradient(circle_at_40%_40%,rgba(150,0,255,0.45),rgba(90,0,150,0.45))]
        "
      ></div>

      {/* Highlight Circle */}
      <div
        className="
          absolute rounded-full opacity-70
          right-2 top-[22rem]
          sm:right-12 sm:top-72
          md:right-60 md:top-36
          w-[120px] h-[120px]
          sm:w-[180px] sm:h-[180px]
          md:w-[260px] md:h-[260px]
          bg-[radial-gradient(circle_at_30%_30%,rgba(70,120,255,0.9),rgba(50,0,150,0.9))]
        "
      ></div>

      {/* HEADER */}
      <header className="flex items-center justify-between px-4 sm:px-8 lg:px-16 py-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white rounded-full flex items-center justify-center shadow-lg">
            <img src={logo} alt="DSC Logo" className="w-full h-full rounded-full" />
          </div>
          <span className="text-white text-xl sm:text-2xl font-bold">
            DSC Souvenirs
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-10 text-white text-lg">
          <a href="#features" className="hover:opacity-80 transition">
            Features
          </a>
          <a href="#about" className="hover:opacity-80 transition">
            About Us
          </a>
          <a href="#how-it-works" className="hover:opacity-80 transition">
            How it Works
          </a>
        </nav>

        <Link
          to="/login"
          className="px-6 sm:px-8 py-2.5 bg-white text-purple-900 rounded-full font-semibold hover:bg-gray-100 transition shadow-lg text-md sm:text-lg"
        >
          Login
        </Link>
      </header>

      {/* MAIN CONTENT */}
      <main className="container mx-auto px-4 sm:px-8 lg:px-16 py-12 lg:py-20 flex flex-col lg:flex-row items-center justify-between gap-16 relative z-10">

        {/* LEFT TEXT */}
        <div className="flex-1 text-white space-y-6 max-w-xl text-center lg:text-left">
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight">
            Sales and<br />
            Inventory<br />
            Management<br />
            System
          </h1>

          <p className="text-lg sm:text-xl text-white leading-relaxed">
            "A simple, reliable system to handle<br />
            your shop's sales and inventory in one place."
          </p>

          <Link
            to="/login"
            className="inline-block px-8 sm:px-10 py-3.5 bg-white text-purple-900 rounded-lg font-semibold hover:bg-gray-100 transition shadow-xl text-lg"
          >
            Get started
          </Link>
        </div>

        {/* RIGHT SIDE - Device Image */}
        <div className="flex-1 relative min-h-[300px] sm:min-h-[400px] lg:min-h-[500px] z-10 flex justify-center">
          <img
            src={monitor}
            alt="monitor"
            className="
              w-full
              max-w-[300px]
              sm:max-w-[450px]
              md:max-w-[650px]
              lg:max-w-[900px]
              object-contain drop-shadow-2xl
            "
          />
        </div>
      </main>
    </div>
  );
}

export default HomePage;
