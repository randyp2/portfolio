import { motion } from "framer-motion";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  BALL_RADIUS,
  FADE_RADIUS,
  type COLLIDERES_RECT,
} from "../typesConstants";
import { AnimatedFolder } from "../components/ui/3d-folder";
import { ChevronRight } from "lucide-react";

interface ProjectsProps {
  centerX: number;
  ballX: number;
  ballY: number;
  cameraX: number;
  viewportCenterX: number;
  onBoundsChange?: (bounds: COLLIDERES_RECT) => void;
}

const Projects: React.FC<ProjectsProps> = ({
  centerX,
  ballX,
  ballY,
  cameraX,
  viewportCenterX,
  onBoundsChange,
}) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [sectionWidth, setSectionWidth] = useState<number>(0);

  // Refs and state for each folder
  const folder1Ref = useRef<HTMLDivElement>(null);
  const folder2Ref = useRef<HTMLDivElement>(null);
  const folder3Ref = useRef<HTMLDivElement>(null);
  const [hasCollided1, setHasCollided1] = useState<boolean>(false);
  const [hasCollided2, setHasCollided2] = useState<boolean>(false);
  const [hasCollided3, setHasCollided3] = useState<boolean>(false);
  const [isColliding1, setIsColliding1] = useState<boolean>(false);
  const [isColliding2, setIsColliding2] = useState<boolean>(false);
  const [isColliding3, setIsColliding3] = useState<boolean>(false);

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
      hasCollided: boolean,
      setHasCollided: React.Dispatch<React.SetStateAction<boolean>>,
      setIsColliding: React.Dispatch<React.SetStateAction<boolean>>
    ) => {
      if (!folderRef.current) return;

      const rect = folderRef.current.getBoundingClientRect();

      // Convert folder screen position to world coordinates for X
      const worldLeft = cameraX - viewportCenterX + rect.left;
      const worldRight = cameraX - viewportCenterX + rect.right;

      // Small padding to catch fast-moving ball (state updates lag behind physics)
      const padding = 15;
      const ballIntersectsX = ballX + BALL_RADIUS >= worldLeft - padding &&
                              ballX - BALL_RADIUS <= worldRight + padding;
      const ballIntersectsY = ballY + BALL_RADIUS >= rect.top - padding &&
                              ballY - BALL_RADIUS <= rect.bottom + padding;
      const ballIntersects = ballIntersectsX && ballIntersectsY;

      if (ballIntersects && !hasCollided) {
        setHasCollided(true);
        setIsColliding(true);
      }

      // Report actual bounds for physics collision (ball bouncing)
      onBoundsChange?.({
        title,
        x1: worldLeft,
        x2: worldRight,
        y1: rect.top,
        y2: rect.bottom,
      });
    };

    checkAndReportBounds(folder1Ref, "Projects-Personal", hasCollided1, setHasCollided1, setIsColliding1);
    checkAndReportBounds(folder2Ref, "Projects-Work", hasCollided2, setHasCollided2, setIsColliding2);
    checkAndReportBounds(folder3Ref, "Projects-Learning", hasCollided3, setHasCollided3, setIsColliding3);
  }, [ballX, ballY, cameraX, viewportCenterX, hasCollided1, hasCollided2, hasCollided3, onBoundsChange]);

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
        isColliding={isColliding1}
        projects={[
          {
            id: "p1",
            image: "/portfolio/media/portfolio-gen-prev.mp4",
            title: "Portfolio Generator",
            description: "Generates a portfolio based on user form and user resume",
            tags: ["Next.js", "TailwindCSS", "Java", "Spring Boot", "Docker", "AWS"],
            status: "In Development",
            link: "https://example.com",
          },
          {
            id: "p2",
            image: "/portfolio/media/dsa_prev.mp4",
            title: "DSA Visualizer",
            description: "Sorting visualizer and linked list visualizer that analyzes sorting algorithms, comparisons, and run times",
            tags: ["C#", ".NET Framework"],
            status: "Finished",
            link: "https://github.com/randyp2",
          },
        ]}
      />

      <AnimatedFolder
        ref={folder2Ref}
        title="Work"
        isColliding={isColliding2}
        projects={[
          {
            id: "w1",
            image: "https://picsum.photos/seed/work1/800/600",
            title: "Client Project 1",
          },
          {
            id: "w2",
            image: "https://picsum.photos/seed/work2/800/600",
            title: "Client Project 2",
          },
          {
            id: "w3",
            image: "https://picsum.photos/seed/work3/800/600",
            title: "Client Project 3",
          },
        ]}
      />

      <AnimatedFolder
        ref={folder3Ref}
        title="Learning"
        isColliding={isColliding3}
        projects={[
          {
            id: "l1",
            image: "https://picsum.photos/seed/learn1/800/600",
            title: "Tutorial Project",
          },
          {
            id: "l2",
            image: "https://picsum.photos/seed/learn2/800/600",
            title: "Course Project",
          },
          {
            id: "l3",
            image: "https://picsum.photos/seed/learn3/800/600",
            title: "Experiment",
          },
        ]}
      />

      {/* Navigation arrow - keep going indicator */}
      <div className="flex flex-col items-center gap-2 ml-16">
        <motion.div
          animate={{ x: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          style={{
            filter: "drop-shadow(0 0 15px rgba(255, 255, 255, 0.6))",
          }}
        >
          <ChevronRight className="w-20 h-20 text-white" strokeWidth={2} />
        </motion.div>
        <span
          className="text-sm text-white/70 font-medium"
          style={{
            textShadow: "0 0 10px rgba(255, 255, 255, 0.5)",
          }}
        >
          Keep going
        </span>
      </div>
    </motion.div>
  );
};

export default Projects;
