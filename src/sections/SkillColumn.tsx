import { motion } from "framer-motion";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { FADE_RADIUS } from "../typesConstants";
import type { SimplePhysics } from "../physics/SimplePhysics";
import { ChevronRight } from "lucide-react";

interface SkillColumnProps {
  centerX: number;
  ballX: number;
  title: string;
  skills: string[];
  physics: SimplePhysics | null;
  onSpawn: () => void;
  showArrow?: boolean;
}

const SkillColumn: React.FC<SkillColumnProps> = ({
  centerX,
  ballX,
  title,
  skills,
  physics,
  onSpawn,
  showArrow = true,
}) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [sectionWidth, setSectionWidth] = useState<number>(0);
  const [hasSpawned, setHasSpawned] = useState(false);

  useLayoutEffect(() => {
    const handleResize = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        setSectionWidth(rect.width);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const leftEdge = centerX;
  const rightEdge = centerX + sectionWidth - 600;

  let opacity = 1;
  if (ballX < leftEdge) {
    const diff = leftEdge - ballX;
    opacity = Math.max(0, 1 - diff / FADE_RADIUS);
  } else if (ballX > rightEdge) {
    const diff = ballX - rightEdge;
    opacity = Math.max(0, 1 - diff / FADE_RADIUS);
  }
  const scale: number = 0.96 + 0.04 * opacity;

  // Spawn blocks when opacity > 0.5 and physics is ready
  useEffect(() => {
    if (opacity > 0.5 && !hasSpawned && physics) {
      // Spawn blocks in 2 columns (2xN layout)
      skills.forEach((skill, index) => {
        // 2 columns: even indices left, odd indices right
        const column = index % 2;
        const row = Math.floor(index / 2);

        const columnOffset = column === 0 ? -50 : 50; // Left/right offset from center
        const x = centerX + columnOffset;
        const y = -200 - row * 100; // Smaller Y gap since 2 per row

        physics.addBlock(
          `skill-${skill}`,
          x,
          y,
          70 + Math.random() * 20, // Width
          70 + Math.random() * 20, // Height
          4, // Mass
          skill, // Label for icon
        );
      });
      setHasSpawned(true);
      onSpawn();
    }
  }, [opacity, hasSpawned, physics, skills, centerX, onSpawn]);

  return (
    <motion.div
      ref={sectionRef}
      className="min-w-screen h-screen flex flex-col justify-center items-center absolute top-0 p-10"
      style={{
        left: `${centerX}px`,
        width: "auto",
        maxWidth: "none",
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
      {/* Title */}
      <motion.span
        className="absolute top-24 border border-[var(--terminal-line)] bg-black/80 px-6 py-3 text-center font-alfa text-[48px] text-[var(--terminal-green-bright)] [text-shadow:0_0_18px_rgba(46,212,101,0.2)]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        {title}
      </motion.span>

      {/* Navigation arrow - keep going indicator */}
      {showArrow && (
        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-24 flex flex-col items-center gap-2">
          <motion.div
            animate={{ x: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            style={{
              filter: "drop-shadow(0 0 15px rgba(46, 212, 101, 0.55))",
            }}
          >
            <ChevronRight className="h-16 w-16 text-[var(--terminal-green)]" strokeWidth={1.5} />
          </motion.div>
          <span
            className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--terminal-muted)]"
            style={{
              textShadow: "0 0 10px rgba(46, 212, 101, 0.35)",
            }}
          >
            next process
          </span>
        </div>
      )}
    </motion.div>
  );
};

export default SkillColumn;
