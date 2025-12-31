import React, { useLayoutEffect, useRef, useState } from "react";
import { FADE_RADIUS } from "../typesConstants";
import { motion } from "framer-motion";
import { GlowingEffect } from "../components/ui/glowing-effect";
import { cn } from "@/lib/utils";
import GitHubActivityChart from "../components/GitHubActivityChart";
import { Github, Linkedin, Mail, ArrowRight, ChevronRight } from "lucide-react";
import InfiniteIconCarousel from "../components/InfiniteIconCarousel";
import { useWorldStore } from "../state/useWorldStore";

interface AboutProps {
  centerX: number;
  ballX: number;
  cameraX?: number;
  viewportCenterX?: number;

  // Update bounds of glasscard
  onBoundsChange?: (bounds: {
    title: string;
    x1: number;
    x2: number;
    y1: number;
    y2: number;
  }) => void;
}

interface GridItemProps {
  area: string;
  children: React.ReactNode;
}

const GridItem = ({ area, children }: GridItemProps) => {
  return (
    <motion.li
      className={cn("list-none", area)}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="relative h-full rounded-[1.25rem] border-[0.75px] border-zinc-800 p-2 md:rounded-[1.5rem] md:p-3">
        <GlowingEffect
          spread={40}
          glow={true}
          disabled={false}
          proximity={64}
          inactiveZone={0.01}
          borderWidth={3}
          variant="white"
        />
        <div className="relative flex h-full flex-col overflow-hidden rounded-xl border-[0.75px] border-zinc-800 bg-zinc-950/90 backdrop-blur-sm shadow-sm">
          {children}
        </div>
      </div>
    </motion.li>
  );
};

const About: React.FC<AboutProps> = ({
  centerX,
  ballX,
}) => {
  const jumpTo = useWorldStore((state) => state.jumpTo);
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

  return (
    <motion.div
      ref={sectionRef}
      className="absolute top-1/2 -translate-y-1/2 p-10"
      style={{
        left: `${centerX}px`,
        width: "1600px",
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
      <ul className="grid grid-cols-1 md:grid-cols-6 gap-6 auto-rows-[180px]">
        {/* About Me - Tall (2x2) */}
        <GridItem area="md:col-span-2 md:row-span-2">
          <div className="flex flex-col justify-center h-full px-8 py-10 md:px-10 md:py-30">
            <h1 className="text-2xl md:text-3xl text-white font-bold mb-3 tracking-tight">
              Randy Pahang II
            </h1>
            <p className="text-base md:text-lg text-zinc-300 mb-1">
              Computer Science Student @ UNLV
            </p>
            <p className="text-sm md:text-base text-zinc-400 mb-6">
              SWE Full-Stack Developer
            </p>

            <div className="space-y-4 text-sm md:text-base text-zinc-300 leading-relaxed">
              <p>
                I love building polished products that connect thoughtful design
                with reliable engineering. My recent work spans full stack
                projects, interactive visuals, and tooling that makes teams move
                faster.
              </p>
              <p>
                Outside of classes you can find me tutoring CS peers,
                experimenting with new frameworks, and contributing to
                collaborative projects that solve real problems for students and
                small businesses.
              </p>
            </div>
          </div>
        </GridItem>

        {/* Tech Stack - Tall (2x2) with Languages carousel */}
        <GridItem area="md:col-span-2 md:row-span-2">
          <div className="flex flex-col h-full p-6">
            <h3 className="text-2xl text-white font-medium mb-2">Languages</h3>
            <div className="flex-1 flex items-center">
              <InfiniteIconCarousel
                rows={[
                  {
                    label: "Languages",
                    icons: [
                      "java",
                      "typescript",
                      "cpp",
                      "c",
                      "csharp",
                      "python",
                      "sql",
                      "swift",
                    ],
                  },
                ]}
              />
            </div>
            <button
              onClick={() => jumpTo("languages")}
              className="mt-4 flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-zinc-800/60 border border-zinc-700 text-zinc-200 hover:bg-zinc-700/60 hover:text-white transition-all duration-200 group text-base font-medium"
            >
              See More
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </GridItem>

        {/* Education - Standard (2x1) */}
        <GridItem area="md:col-span-2">
          <div className="flex items-center justify-between h-full px-6 py-4">
            <div>
              <h3 className="text-xl text-white font-medium">Education</h3>
              <p className="text-zinc-300">BS Computer Science @ UNLV</p>
              <p className="text-sm text-zinc-400">Minor in Accounting</p>
            </div>
            <div className="text-right">
              <p className="text-xl text-white font-bold">4.0 GPA</p>
              <p className="text-zinc-400 text-sm">Class of 2027</p>
            </div>
          </div>
        </GridItem>

        {/* Skills - GitHub Activity Chart (2x1) */}
        <GridItem area="md:col-span-2">
          <div className="flex flex-col h-full p-4">
            <h3 className="text-xl text-white font-medium mb-2">
              GitHub Activity
            </h3>
            <div className="flex-1 min-h-0">
              <GitHubActivityChart username="randyp2" />
            </div>
          </div>
        </GridItem>

        {/* Experience - Wide (3x1) */}
        <GridItem area="md:col-span-3">
          <div className="flex flex-col h-full p-6">
            <h3 className="text-2xl text-white font-medium mb-4">
              Experience
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
              <div className="space-y-1">
                <p className="text-white font-semibold">Tutor for UNLV CS</p>
                <p className="text-sm text-zinc-400">2024 - Present</p>
              </div>
              <div className="space-y-1">
                <p className="text-white font-semibold">STARS</p>
                <p className="text-sm text-zinc-400">Nov 2025 - Present</p>
                <p className="text-xs text-zinc-500 mt-1">
                  ML recommendation system
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-white font-semibold">CRJ Services</p>
                <p className="text-sm text-zinc-400">Sept - Dec 2025</p>
                <p className="text-xs text-zinc-500 mt-1">Admin dashboard</p>
              </div>
            </div>
          </div>
        </GridItem>

        {/* Contact - Wide (3x1) */}
        <GridItem area="md:col-span-3">
          <div className="flex flex-col items-center justify-center h-full p-6">
            <h3 className="text-2xl text-white font-medium mb-6">
              Get in Touch
            </h3>
            <div className="flex gap-6">
              <a
                href="https://github.com/randyp2"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-full bg-zinc-800/60 border border-zinc-700 hover:bg-zinc-700/60 hover:scale-110 transition-all duration-200"
              >
                <Github className="w-8 h-8 text-zinc-200" />
              </a>
              <a
                href="https://linkedin.com/in/randypahangii"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-full bg-zinc-800/60 border border-zinc-700 hover:bg-zinc-700/60 hover:scale-110 transition-all duration-200"
              >
                <Linkedin className="w-8 h-8 text-zinc-200" />
              </a>
              <a
                href="mailto:rpahang2@gmail.com"
                className="p-4 rounded-full bg-zinc-800/60 border border-zinc-700 hover:bg-zinc-700/60 hover:scale-110 transition-all duration-200"
              >
                <Mail className="w-8 h-8 text-zinc-200" />
              </a>
            </div>
          </div>
        </GridItem>
      </ul>

      {/* Navigation arrow - keep going indicator */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-32 flex flex-col items-center gap-2">
        <motion.div
          animate={{ x: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          style={{
            filter: "drop-shadow(0 0 15px rgba(255, 255, 255, 0.6))",
          }}
        >
          <ChevronRight className="w-16 h-16 text-white" strokeWidth={2} />
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

export default About;
