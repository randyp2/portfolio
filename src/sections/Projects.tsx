import { motion } from "framer-motion";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { FADE_RADIUS } from "../typesConstants";
import MassBlock from "../components/MassBlock";
import Atwood from "../projects-components/Atwood";

interface ProjectsProps {
    centerX: number;
    ballX: number;
    cameraX: number;
    viewportCenterX: number;

    // Update bounds of glasscard
    onBoundsChange?: (bounds: {
        title: string;
        x1: number;
        x2: number;
        y1: number;
        y2: number;
    }) => void;

    onSpawnMasses?: () => void;
}

const Projects: React.FC<ProjectsProps> = ({ centerX, ballX, cameraX, viewportCenterX, onBoundsChange, onSpawnMasses}) => {
    
    const sectionRef = useRef<HTMLDivElement>(null);
    const [sectionWidth, setSectionWidth] = useState<number>(0);

    useLayoutEffect(() => {
        const handleResize = () => {
          if (sectionRef.current) {
            const rect = sectionRef.current.getBoundingClientRect();
            setSectionWidth(rect.width);
          }
        };
      
        handleResize(); // initial call
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

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
    

    /* --- Spawn masses --- */
    const [spawnMasses, setSpawnMasses] = useState<boolean>(false);
    useEffect(() => {
        if (opacity > 0.5 && !spawnMasses) {
          setSpawnMasses(true);
          onSpawnMasses?.(); // Spawn in mass blocks
        }
    }, [opacity, spawnMasses, onSpawnMasses]);

    return(
        <motion.div
            ref={sectionRef}
            className=" bg-white/5 min-w-screen h-screen flex flex-row justify-center items-start gap-10 absolute top-0 rounded-3xl shadow-2xl p-10 "
            style={{
                left: `${centerX}px`,
                width: "auto", 
                maxWidth: "none", // ensure no Tailwind limit constrains it
            }}
            animate={{
                opacity,
                scale,
            }}
            transition={{
                type: 'spring',
                stiffness: 100,
                damping: 20,
                mass: 0.5,
            }}
        >
            <Atwood />
        </motion.div>
    );
}

export default Projects;