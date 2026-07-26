import React from "react";
import Navbar from "./components/Navbar";
import WorldCanvas from "./components/WorldCanvas";
import Footer from "./components/Footer";
import MobilePage from "./components/MobilePage";
import { useMediaQuery } from "./hooks/useMediaQuery";

const App: React.FC = () => {
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  return (
    <div
      className={`terminal-app min-h-screen antialiased ${
        isDesktop ? "overflow-hidden" : ""
      }`}
    >
      <Navbar />
      {isDesktop ? (
        <>
          <WorldCanvas />
          <Footer />
        </>
      ) : (
        <MobilePage />
      )}
    </div>
  );
};

export default App;
