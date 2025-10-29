// src/pages/HomePage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import DSCLogo from '../assets/DSCLogo.png';

function HomePage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-purple-900 via-purple-700 to-pink-500 relative overflow-hidden">
      {/* Decorative Circles */}
      <div className="absolute top-24 left-16 w-32 h-32 bg-pink-600 rounded-full opacity-60"></div>
      <div className="absolute top-24 right-32 w-80 h-80 bg-linear-to-br from-purple-600 to-blue-600 rounded-full opacity-50 blur-2xl"></div>

      {/* Header Navigation */}
      <header className="flex items-center justify-between px-8 lg:px-16 py-6">
        {/* Logo and Brand */}
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg">
            {DSCLogo ? (
              <img src={DSCLogo} alt="DSC Logo" className="w-9 h-9" />
            ) : (
              <span className="text-purple-700 text-2xl font-bold">🌸</span>
            )}
          </div>
          <span className="text-white text-2xl font-bold">DSC Souvenirs</span>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-12 text-white text-lg">
          <a href="#features" className="hover:opacity-80 transition">Features</a>
          <a href="#about" className="hover:opacity-80 transition">About Us</a>
          <a href="#how-it-works" className="hover:opacity-80 transition">How it Works</a>
        </nav>

        {/* Login Button */}
        <Link
          to="/login"
          className="px-8 py-2.5 bg-white text-purple-900 rounded-full font-semibold hover:bg-gray-100 transition shadow-lg text-lg"
        >
          Login
        </Link>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-8 lg:px-16 py-12 lg:py-20 flex flex-col lg:flex-row items-center justify-between gap-16 relative z-10">
        {/* Left Side - Text Content */}
        <div className="flex-1 text-white space-y-8 max-w-xl">
          <h1 className="text-6xl lg:text-7xl font-bold leading-tight">
            Sales and<br />
            Inventory<br />
            Management<br />
            System
          </h1>
          
          <p className="text-xl text-white leading-relaxed">
            "A simple, reliable system to handle<br />
            your shop's sales and inventory in one place."
          </p>
          
          <Link
            to="/login"
            className="inline-block px-10 py-3.5 bg-white text-purple-900 rounded-lg font-semibold hover:bg-gray-100 transition shadow-xl text-lg"
          >
            Get started
          </Link>
        </div>

        {/* Right Side - Device Mockups */}
        <div className="flex-1 relative min-h-[500px]">
          {/* Desktop Monitor */}
          <div className="absolute top-0 left-0 right-0 z-10">
            <div className="relative">
              {/* Monitor Frame */}
              <div className="bg-gray-900 rounded-t-2xl p-3 shadow-2xl">
                {/* Screen */}
                <div className="bg-white rounded-t-xl overflow-hidden aspect-video">
                  {/* Placeholder for actual app screenshot */}
                  <div className="w-full h-full bg-linear-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <div className="grid grid-cols-4 gap-3 p-6 w-full h-full">
                      {[...Array(16)].map((_, i) => (
                        <div key={i} className="bg-linear-to-br from-orange-300 via-yellow-200 to-pink-300 rounded-xl shadow-sm"></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              {/* Monitor Stand */}
              <div className="mx-auto w-4/5 h-8 bg-gray-800 rounded-b-xl"></div>
              <div className="mx-auto w-1/3 h-3 bg-gray-700 rounded-b-lg"></div>
            </div>
          </div>

          {/* Laptop/Tablet Overlay */}
          <div className="absolute bottom-0 right-0 z-20 w-2/3 transform translate-x-12 translate-y-8">
            <div className="bg-gray-900 rounded-t-xl p-2 shadow-2xl">
              {/* Screen */}
              <div className="bg-white rounded-t-lg overflow-hidden aspect-video">
                {/* Placeholder for actual app screenshot */}
                <div className="w-full h-full bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                  <div className="grid grid-cols-4 gap-2 p-4 w-full h-full">
                    {[...Array(12)].map((_, i) => (
                      <div key={i} className="bg-linear-to-br from-blue-200 via-purple-200 to-pink-200 rounded-lg shadow-sm"></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            {/* Keyboard Base */}
            <div className="bg-gray-800 h-4 rounded-b-xl"></div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default HomePage;