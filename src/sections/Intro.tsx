import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { FaArrowRight } from "react-icons/fa";

const Intro: React.FC = () => {
  const titles: string[] = ["CREATOR", "CS MAJOR", "BUILDER"]; // Titles to cycle through
  // const titles: string[] = ["<CODE>", "<BUILD>", "<LEARN>"]; // Titles to cycle through
  const [index, setIndex] = useState<number>(0); // Current index

  // Cycle through titles every 2.5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % titles.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      className="flex flex-row justify-center items-center w-full h-screen gap-20"
      initial={{ scale: 0.6, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 1, ease: "easeOut" }}
    >
      <div
        className=" flex flex-col justify-center align-middle text-center 
            font-alfa text-[100px]"
      >
        <span className=" text-white [text-shadow:_0_0_4px_white]">
          HEY, I'M RANDY
        </span>

        <div className="relative -mt-6 text-border flex items-center justify-center">
          {/* Static part */}
          <span className="text-border">I'M A&nbsp;</span>

          {/* Animated part */}
          <div className="relative h-[110px] overflow-hidden w-[600px] flex items-center">
            <AnimatePresence mode="wait">
              <motion.span
                key={titles[index]}
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: "-12%", opacity: 1 }}
                exit={{ y: "-100%", opacity: 0 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className="absolute left-0 top-0 w-full text-left"
              >
                {titles[index]}
              </motion.span>
            </AnimatePresence>
          </div>
        </div>

        <span className="-mt-5 text-white [text-shadow:_0_0_4px_white]">
          {" "}
          HEY, I'M RANDY{" "}
        </span>
      </div>

      <div>
        <span className="text-[200px] text-white drop-shadow-[0_0_3px_white]">
          <FaArrowRight />
        </span>
      </div>
    </motion.div>
  );
};

export default Intro;

