import React, { useEffect, useRef } from "react";
import Navbar from "./components/Navbar";
import WorldCanvas from "./components/WorldCanvas";
import Footer from "./components/Footer";


const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#15181c] text-white antialiased overflow-hidden font-sans">
      <Navbar />
      <WorldCanvas />
      <Footer />
    </div>
  );
};

export default App;