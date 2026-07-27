import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type RefObject,
} from "react";
import AsciiPortrait from "../components/AsciiPortrait";
import HeroCopy from "../components/HeroCopy";
import PixelArrow from "../components/PixelArrow";
import type { BallCoordinates } from "../typesConstants";

const SEQUENCE_STALL_MS = 750;

interface IntroProps {
  ballPositionRef: RefObject<BallCoordinates>;
  centerX: number;
  viewportCenterX: number;
}

const Intro: React.FC<IntroProps> = ({
  ballPositionRef,
  centerX,
  viewportCenterX,
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isCopyComplete, setIsCopyComplete] = useState(false);
  const [isPortraitComplete, setIsPortraitComplete] = useState(false);
  const [isArrowVisible, setIsArrowVisible] = useState(false);
  const completeCopy = useCallback(() => setIsCopyComplete(true), []);
  const completePortrait = useCallback(
    () => setIsPortraitComplete(true),
    [],
  );

  useEffect(() => {
    if (!isCopyComplete || !isPortraitComplete) return;

    const stallId = window.setTimeout(
      () => setIsArrowVisible(true),
      SEQUENCE_STALL_MS,
    );

    return () => window.clearTimeout(stallId);
  }, [isCopyComplete, isPortraitComplete]);

  return (
    <section ref={sectionRef} className="hero-intro">
      <div className="hero-portrait-slot">
        <AsciiPortrait
          onAnimationComplete={completePortrait}
          reaction={{
            ballPositionRef,
            sectionCenterX: centerX,
            sectionRef,
            viewportCenterX,
          }}
        />
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
