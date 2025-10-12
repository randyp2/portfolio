import { motion } from "framer-motion";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { FADE_RADIUS } from "../typesConstants";
import MassBlock from "../components/MassBlock";

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
}

const Projects: React.FC<ProjectsProps> = ({ centerX, ballX, cameraX, viewportCenterX, onBoundsChange}) => {
    
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
        }
    }, [opacity, spawnMasses]);

    return(
        <motion.div
            ref={sectionRef}
            className=" w-full h-screen flex flex-row items-center justify-start gap-10 absolute top-1/2 left-1/2 -translate-y-1/2  bg-white/5 rounded-3xl shadow-2xl p-10 max-h-[600px]"
            style={{
                left: `${centerX}px`,
                width: "auto", // allows it to expand to fit both GlassCards
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
            {/* Falling masses */}
            {spawnMasses && (
                <div className=" flex flex-row gap-10">
                {["5N", "5N", "10N", "20N"].map((label, i) => (
                    <MassBlock key={i} label={label} index={i} />
                ))}
                </div>
            )}
        </motion.div>
    );
}

export default Projects;