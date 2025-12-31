import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";

const MobileIntro: React.FC = () => {
  const titles: string[] = ["CREATOR", "CS MAJOR", "BUILDER"];
  const [index, setIndex] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % titles.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="intro"
      className="min-h-screen flex flex-col justify-center items-center px-6 text-center"
    >
      <motion.div
        className="font-alfa"
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <span className="block text-4xl sm:text-5xl text-white [text-shadow:_0_0_4px_white]">
          HEY, I'M RANDY
        </span>

        <div className="text-3xl sm:text-4xl text-border mt-4 flex flex-col items-center">
          <span>I'M A</span>
          <div className="relative h-[50px] sm:h-[60px] overflow-hidden w-full flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.span
                key={titles[index]}
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: "0%", opacity: 1 }}
                exit={{ y: "-100%", opacity: 0 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className="absolute"
              >
                {titles[index]}
              </motion.span>
            </AnimatePresence>
          </div>
        </div>

        <span className="block text-4xl sm:text-5xl text-white [text-shadow:_0_0_4px_white] mt-2">
          HEY, I'M RANDY
        </span>
      </motion.div>

      <motion.div
        className="mt-16 animate-bounce"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <ChevronDown className="w-8 h-8 text-white/60" />
      </motion.div>
    </section>
  );
};

export default MobileIntro;
