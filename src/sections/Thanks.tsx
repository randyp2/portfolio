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
      className="absolute top-0 flex h-screen w-screen items-center justify-center"
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
      <div className="terminal-panel w-[min(760px,80vw)] overflow-hidden">
        <div className="terminal-titlebar">
          <span className="terminal-dot" />
          session-complete
        </div>
        <div className="px-12 py-14 text-left">
          <p className="terminal-command mb-6 text-sm text-[var(--terminal-muted)]">
            exit --message
          </p>
          <h2 className="font-alfa text-[72px] leading-none text-[var(--terminal-green-bright)] [text-shadow:0_0_28px_rgba(70,255,123,0.2)]">
            THANK YOU.
          </h2>
          <p className="mt-6 text-sm text-[var(--terminal-muted)]">
            Connection remains open. Reach out when you are ready to build.
          </p>
          <p className="mt-8 text-[var(--terminal-green)]">
            rjp@portfolio:~$ <span className="terminal-cursor" />
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default Thanks;
