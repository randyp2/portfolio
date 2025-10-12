import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { FADE_RADIUS } from "../typesConstants";
import GlassCard from "../components/GlassCard";
import { motion } from "framer-motion";
import EducationTimeline from "../about-components/EducationTimeline";
import PhotoCard from "../about-components/PhotoCard";

import ProfilePicture from "../assets/about-photo-card.webp"
import EducationCard from "../about-components/ExperienceCard";
import ExperienceCard from "../about-components/ExperienceCard";
import Experience from "../about-components/Experience";

interface AboutProps {
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

const About:React.FC<AboutProps> = ({ 
    centerX, 
    ballX, 
    cameraX, 
    viewportCenterX, 
    onBoundsChange
}) => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const cardRef = useRef<HTMLDivElement>(null); 
    const [sectionWidth, setSectionWidth] = useState<number>(0);

    // const distance: number = Math.abs(ballX - centerX);
    // const opacity: number = Math.max(0, Math.min(1, 1 - distance / FADE_RADIUS));
    
    


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
    useEffect(() => console.log({
        ballX,
        leftEdge,
        rightEdge,
        sectionWidth,
    }), [ballX]);

    // Send bounds of glasscard to physics engine
    // useEffect(() => {
    //     if (!cardRef.current) return;
    //     const rect: DOMRect = cardRef.current.getBoundingClientRect();
    //     const worldLeft: number = cameraX - viewportCenterX + rect.left;
    //     const worldRight: number = cameraX - viewportCenterX + rect.right;
    //     // onBoundsChange?.({
    //     //   title: "About",
    //     //   x1: worldLeft,
    //     //   x2: worldRight,
    //     //   y1: rect.top,
    //     //   y2: rect.bottom,
    //     // });
    //   }, [cameraX, viewportCenterX, onBoundsChange]);

    //bg-white/5 border border-white/10
    return(
        <motion.div
            ref={sectionRef}
            className=" flex flex-row items-center justify-start gap-10 absolute top-1/2 left-1/2 -translate-y-1/2   rounded-3xl shadow-2xl p-10 max-h-[600px]"
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

            {/* Photo card and social media links */}
            <PhotoCard imgSrc={ProfilePicture}/>

            {/* About Content */}
            <div className="flex flex-col justify-center gap-3">

                
                <div className="flex flex-row items-center gap-3">

                    {/* About intro cards */}
                    <GlassCard ref={cardRef} title="About Me" opacity={opacity} scale={scale} className="max-w-[520px]">
                        <p className="text-white/90 leading-relaxed">
                        Hi, I’m <span className="text-[#c5f9f5] font-semibold">Randy</span> — a Computer Science student and aspiring software engineer
                        passionate about building modern, efficient, and visually engaging applications.
                        </p>

                        <p className="mt-3 text-white/90 leading-relaxed">
                        I graduated as <span className="text-[#c5f9f5] font-semibold">Valedictorian</span> in 2023 and currently maintain a 
                        <span className="text-[#c5f9f5] font-semibold"> 4.0 GPA</span> on the Dean’s List while pursuing my CS degree.
                        </p>

                    
                    </GlassCard>

                    {/* Education timeline */}
                    <GlassCard ref={cardRef} title="Education Timeline" opacity={opacity} scale={scale} className="w-[1250px]">
                        <div className="mt-10 flex flex-grow flex-col justify-start h-[125px]">
                            {/* <span className="text-3xl font-bold mb-6 tracking-tight">Education Timeline</span> */}
                            <div><EducationTimeline opacity={opacity} /></div>
                        </div>
                    </GlassCard>
                </div>

                {/* Work experience Cards */}
                <div>
                    <Experience opacity={opacity} scale={scale}/>

                    
                </div>
                
            </div>


        </motion.div>
    );
}

export default About;