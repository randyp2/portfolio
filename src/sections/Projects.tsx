import { motion } from "framer-motion";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  FADE_RADIUS,
  type COLLIDERES_RECT,
} from "../typesConstants";
import { AnimatedFolder } from "../components/ui/3d-folder";
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
        projects={[
          {
            id: "p1",
            image: "/media/portfolio-gen-prev.mp4",
            title: "Portfolio Generator",
            description:
              "Generates a portfolio based on user form and user resume",
            tags: [
              "Next.js",
              "TailwindCSS",
              "Java",
              "Spring Boot",
              "Docker",
              "AWS",
            ],
            status: "In Development",
            link: "https://example.com",
          },
          {
            id: "p2",
            image: "/media/dsa_prev.mp4",
            title: "DSA Visualizer",
            description:
              "Sorting visualizer and linked list visualizer that analyzes sorting algorithms, comparisons, and run times",
            tags: ["C#", ".NET Framework"],
            status: "Finished",
            link: "https://github.com/randyp2/DSA_Visualizer",
          },
          {
            id: "p3",
            image: "/media/conway_prev.mp4",
            title: "Conway's Game of Life",
            description: "Cellular automaton simulation",
            tags: ["C++", "Raylib"],
            status: "Finished",
            link: "https://github.com/randyp2/conways-game-of-life-cpp",
          },
        ]}
      />

      <AnimatedFolder
        ref={folder2Ref}
        title="Work"
        collisionTrigger={
          lastColliderHit?.title === "Projects-Work"
            ? lastColliderHit.sequence
            : undefined
        }
        projects={[
          {
            id: "w1",
            image: "/media/crj_prev.mp4",
            title: "CRJ Website",
            description:
              "Lead Full Stack Developer for client website redesign and development",
            tags: ["Next.js", "Supabase", "Vercel"],
            status: "In Development",
            link: "https://example.com",
          },
          {
            id: "w2",
            image: "/media/portfolio-gen-prev.mp4",
            title: "Portfolio Generator",
            description:
              "Startup venture: AI-powered portfolio generator that creates personalized portfolios from user forms and resumes",
            tags: [
              "Next.js",
              "Supabase",
              "Spring Boot",
              "AWS",
              "Docker",
              "Vercel",
            ],
            status: "In Development",
            link: "https://example.com",
          },
        ]}
      />

      <AnimatedFolder
        ref={folder3Ref}
        title="Learning"
        collisionTrigger={
          lastColliderHit?.title === "Projects-Learning"
            ? lastColliderHit.sequence
            : undefined
        }
        isDisabled={true}
        projects={[]}
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
