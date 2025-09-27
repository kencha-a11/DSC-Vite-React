// src/pages/HomePage.jsx
import React from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <section className="text-center px-6">
        <h1 className="text-4xl md:text-6xl font-extrabold text-indigo-600 dark:text-indigo-400 mb-4">
          Welcome to My App
        </h1>
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-xl mx-auto">
          A modern React application with authentication, protected routes, and a clean UI powered by Tailwind.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to="/home"
            className="px-6 py-3 rounded-lg bg-indigo-600 text-white font-medium shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
          >
            Home
          </Link>
          <Link
            to="/login"
            className="px-6 py-3 rounded-lg bg-white text-indigo-600 border border-indigo-300 font-medium shadow hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
          >
            Login
          </Link>
        </div>
      </section>
    </main>
  );
}

export default HomePage;
