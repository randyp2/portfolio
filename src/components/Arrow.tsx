import { motion } from "framer-motion";
import React from "react";

interface ArrowProps {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  isVisible: boolean;
}

const Arrow: React.FC<ArrowProps> = ({ startX, startY, endX, endY, isVisible }) => {
  const dx = endX - startX;
  const dy = endY - startY;
  const length = Math.sqrt(dx * dx + dy * dy);
  const rawAngle = Math.atan2(dy, dx) * (180 / Math.PI); // tan^-1(dy/dx)
  const angle = rawAngle < 0 ? rawAngle + 360 : rawAngle;

  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        left: `${startX}px`,
        top: `${startY}px`,
        transformOrigin: "0 50%", // pivot at start
      }}
      // 👇 Include rotation inside animate to ensure Framer updates it
      animate={{
        opacity: isVisible ? 1 : 0,
        rotate: angle, // <— key change
        scale: isVisible ? 1 : 0.9,
      }}
      transition={{
        duration: 0,
        ease: "linear",
      }}
    >
      <div
        className="relative bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.6)]"
        style={{
          width: `${length}px`,
          height: "3px",
        }}
      >
        <div
          className="absolute right-0 top-1/2 -translate-y-1/2"
          style={{
            width: 0,
            height: 0,
            borderLeft: "12px solid white",
            borderTop: "6px solid transparent",
            borderBottom: "6px solid transparent",
          }}
        />
      </div>
    </motion.div>
  );
};


export default Arrow;