import { useCallback, useEffect, useState } from "react";
import AsciiPortrait from "../components/AsciiPortrait";
import HeroCopy from "../components/HeroCopy";
import PixelArrow from "../components/PixelArrow";

const SEQUENCE_STALL_MS = 750;

const Intro: React.FC = () => {
  const [isCopyComplete, setIsCopyComplete] = useState(false);
  const [isPortraitVisible, setIsPortraitVisible] = useState(false);
  const [isPortraitComplete, setIsPortraitComplete] = useState(false);
  const [isArrowVisible, setIsArrowVisible] = useState(false);
  const completeCopy = useCallback(() => setIsCopyComplete(true), []);
  const completePortrait = useCallback(
    () => setIsPortraitComplete(true),
    [],
  );

  useEffect(() => {
    if (!isCopyComplete) return;

    const stallId = window.setTimeout(
      () => setIsPortraitVisible(true),
      SEQUENCE_STALL_MS,
    );

    return () => window.clearTimeout(stallId);
  }, [isCopyComplete]);

  useEffect(() => {
    if (!isPortraitComplete) return;

    const stallId = window.setTimeout(
      () => setIsArrowVisible(true),
      SEQUENCE_STALL_MS,
    );

    return () => window.clearTimeout(stallId);
  }, [isPortraitComplete]);

  return (
    <section className="hero-intro">
      <div className="hero-portrait-slot">
        {isPortraitVisible ? (
          <AsciiPortrait onAnimationComplete={completePortrait} />
        ) : null}
      </div>
      <HeroCopy
        className="hero-copy-slot"
        onRevealComplete={completeCopy}
      />
      <div
        className={`hero-arrow-slot ${isArrowVisible ? "is-visible" : ""}`}
      >
        <PixelArrow />
      </div>
    </section>
  );
};

export default Intro;
