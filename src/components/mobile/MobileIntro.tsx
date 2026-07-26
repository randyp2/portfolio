import { useCallback, useEffect, useState } from "react";
import AsciiPortrait from "../AsciiPortrait";
import HeroCopy from "../HeroCopy";

const SEQUENCE_STALL_MS = 750;

const MobileIntro: React.FC = () => {
  const [isCopyComplete, setIsCopyComplete] = useState(false);
  const [isPortraitVisible, setIsPortraitVisible] = useState(false);
  const completeCopy = useCallback(() => setIsCopyComplete(true), []);

  useEffect(() => {
    if (!isCopyComplete) return;

    const stallId = window.setTimeout(
      () => setIsPortraitVisible(true),
      SEQUENCE_STALL_MS,
    );

    return () => window.clearTimeout(stallId);
  }, [isCopyComplete]);

  return (
    <section
      id="intro"
      className="flex min-h-screen flex-col items-start overflow-visible px-3 pb-10 pt-20"
    >
      <HeroCopy
        className="mobile-hero-copy"
        onRevealComplete={completeCopy}
      />
      {isPortraitVisible ? <AsciiPortrait /> : null}
    </section>
  );
};

export default MobileIntro;
