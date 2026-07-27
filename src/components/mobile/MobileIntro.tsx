import AsciiPortrait from "../AsciiPortrait";
import HeroCopy from "../HeroCopy";

const MobileIntro: React.FC = () => {
  return (
    <section
      id="intro"
      className="flex min-h-screen flex-col items-start overflow-visible px-3 pb-10 pt-20"
    >
      <HeroCopy className="mobile-hero-copy" />
      <AsciiPortrait />
    </section>
  );
};

export default MobileIntro;
