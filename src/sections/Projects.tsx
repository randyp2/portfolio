import { motion } from "framer-motion";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  FADE_RADIUS,
  type COLLIDERES_RECT,
} from "../typesConstants";
import { AnimatedFolder } from "../components/ui/3d-folder";
import {
  LEARNING_PROJECTS,
  PERSONAL_PROJECTS,
  WORK_PROJECTS,
} from "../content/projects";
import { ChevronRight } from "lucide-react";

interface ProjectsProps {
  centerX: number;
  ballX: number;
  cameraX: number;
  viewportCenterX: number;
  lastColliderHit: {
    title: string;
    sequence: number;
  } | null;
  onBoundsChange?: (bounds: COLLIDERES_RECT) => void;
}

const Projects: React.FC<ProjectsProps> = ({
  centerX,
  ballX,
  cameraX,
  viewportCenterX,
  lastColliderHit,
  onBoundsChange,
}) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [sectionWidth, setSectionWidth] = useState<number>(0);

  // Refs and state for each folder
  const folder1Ref = useRef<HTMLDivElement>(null);
  const folder2Ref = useRef<HTMLDivElement>(null);
  const folder3Ref = useRef<HTMLDivElement>(null);
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

  // Collision detection for all folders
  useEffect(() => {
    const checkAndReportBounds = (
      folderRef: React.RefObject<HTMLDivElement | null>,
      title: string,
    ) => {
      if (!folderRef.current) return;

      const rect = folderRef.current.getBoundingClientRect();

      // Convert folder screen position to world coordinates for X
      const worldLeft = cameraX - viewportCenterX + rect.left;
      const worldRight = cameraX - viewportCenterX + rect.right;

      // Report actual bounds for physics collision (ball bouncing)
      onBoundsChange?.({
        title,
        x1: worldLeft,
        x2: worldRight,
        y1: rect.top,
        y2: rect.bottom,
      });
    };

    checkAndReportBounds(
      folder1Ref,
      "Projects-Personal",
    );
    checkAndReportBounds(
      folder2Ref,
      "Projects-Work",
    );
    checkAndReportBounds(
      folder3Ref,
      "Projects-Learning",
    );
  }, [
    ballX,
    cameraX,
    viewportCenterX,
    onBoundsChange,
  ]);

  const leftEdge = centerX;
  const rightEdge = centerX + sectionWidth - 1200;

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
      ref={sectionRef}
      className="min-w-screen h-screen flex flex-row justify-center items-center gap-48 absolute top-0 p-10"
      style={{
        left: `${centerX}px`,
        width: "auto",
        maxWidth: "none",
        paddingBottom: "120px",
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
      <AnimatedFolder
        ref={folder1Ref}
        title="Personal"
        collisionTrigger={
          lastColliderHit?.title === "Projects-Personal"
            ? lastColliderHit.sequence
            : undefined
        }
        projects={PERSONAL_PROJECTS}
      />

      <AnimatedFolder
        ref={folder2Ref}
        title="Work"
        collisionTrigger={
          lastColliderHit?.title === "Projects-Work"
            ? lastColliderHit.sequence
            : undefined
        }
        projects={WORK_PROJECTS}
      />

      <AnimatedFolder
        ref={folder3Ref}
        title="Learning"
        collisionTrigger={
          lastColliderHit?.title === "Projects-Learning"
            ? lastColliderHit.sequence
            : undefined
        }
        projects={LEARNING_PROJECTS}
      />

      {/* Navigation arrow - keep going indicator */}
      <div className="flex flex-col items-center gap-2 ml-16">
        <motion.div
          animate={{ x: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          style={{
            filter: "drop-shadow(0 0 15px rgba(46, 212, 101, 0.55))",
          }}
        >
          <ChevronRight className="h-20 w-20 text-[var(--terminal-green)]" strokeWidth={1.5} />
        </motion.div>
        <span
          className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--terminal-muted)]"
          style={{
            textShadow: "0 0 10px rgba(46, 212, 101, 0.35)",
          }}
        >
          continue
        </span>
      </div>
    </motion.div>
  );
};

export default Projects;
