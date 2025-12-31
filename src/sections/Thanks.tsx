import { motion } from "framer-motion";
import React from "react";
import { FADE_RADIUS } from "../typesConstants";

interface ThanksProps {
  centerX: number;
  ballX: number;
}

const Thanks: React.FC<ThanksProps> = ({ centerX, ballX }) => {
  // Calculate opacity based on ball distance
  const leftEdge = centerX - 400;
  const rightEdge = centerX + 400;

  let opacity = 1;
  if (ballX < leftEdge) {
    const diff = leftEdge - ballX;
    opacity = Math.max(0, 1 - diff / FADE_RADIUS);
  } else if (ballX > rightEdge) {
    const diff = ballX - rightEdge;
    opacity = Math.max(0, 1 - diff / FADE_RADIUS);
  }
  const scale: number = 0.96 + 0.04 * opacity;

  return (
    <motion.div
      className="flex flex-row justify-center items-center w-screen h-screen absolute top-0"
      style={{
        left: `${centerX}px`,
        transform: "translateX(-50%)",
      }}
      animate={{
        opacity,
        scale,
      }}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 20,
        mass: 0.5,
      }}
    >
      <div
        className="flex flex-col justify-center align-middle text-center font-alfa text-[100px]"
      >
        <span className="text-white [text-shadow:_0_0_4px_white]">
          THANK YOU
        </span>

        <span className="-mt-6 text-border">
          THANK YOU
        </span>

        <span className="-mt-5 text-white [text-shadow:_0_0_4px_white]">
          THANK YOU
        </span>
      </div>
    </motion.div>
  );
};

export default Thanks;
