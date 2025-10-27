import React from "react";
import { Outlet } from "react-router-dom";

// import Header from "./components/Header";
// import Footer from "./components/Footer";

export default function App() {
  return (
    <div>
      {/* <Header /> */}
      <main>
        <Outlet /> {/* Render matched route content */}
      </main>
      {/* <Footer /> */}
    </div>
  );
}
