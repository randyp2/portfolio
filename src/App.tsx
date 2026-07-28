import React, { useCallback, useState } from "react";
import Navbar from "./components/Navbar";
import WorldCanvas from "./components/WorldCanvas";
import Footer from "./components/Footer";
import MobilePage from "./components/MobilePage";
import BallTutorialModal from "./components/BallTutorialModal";
import { useMediaQuery } from "./hooks/useMediaQuery";

type PortfolioVariant = "desktop" | "mobile";

const App: React.FC = () => {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const activeVariant: PortfolioVariant = isDesktop
    ? "desktop"
    : "mobile";
  const [enteredVariants, setEnteredVariants] = useState<
    Record<PortfolioVariant, boolean>
  >({
    desktop: false,
    mobile: false,
  });
  const handleEnterPortfolio = useCallback(
    (variant: PortfolioVariant) => {
      setEnteredVariants((current) => ({
        ...current,
        [variant]: true,
      }));
    },
    [],
  );
  const hasEnteredActiveVariant = enteredVariants[activeVariant];

  const completeActiveTutorial = useCallback(() => {
    handleEnterPortfolio(activeVariant);
  }, [activeVariant, handleEnterPortfolio]);

  return (
    <div
      className={`terminal-app min-h-screen antialiased ${
        isDesktop ? "overflow-hidden" : ""
      }`}
    >
      {hasEnteredActiveVariant ? (
        isDesktop ? (
          <>
            <Navbar />
            <WorldCanvas />
            <Footer />
          </>
        ) : (
          <>
            <Navbar />
            <MobilePage />
          </>
        )
      ) : (
        <BallTutorialModal
          variant={activeVariant}
          onComplete={completeActiveTutorial}
        />
      )}
    </div>
  );
};

export default App;
