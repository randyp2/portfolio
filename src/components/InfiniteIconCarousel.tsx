import React from "react";
import { motion } from "framer-motion";
import {
  SiTypescript,
  SiCplusplus,
  SiC,
  SiDotnet,
  SiPython,
  SiSwift,
  SiGit,
  SiDocker,
  SiAmazonwebservices,
  SiSupabase,
  SiPostman,
  SiSpringboot,
  SiReact,
  SiNextdotjs,
  SiNodedotjs,
  SiDjango,
  SiPostgresql,
} from "react-icons/si";
import { FaJava, FaDatabase } from "react-icons/fa";

// Icon definitions with brand colors
const iconComponents = {
  java: <FaJava size={48} color="#ED8B00" />,
  typescript: <SiTypescript size={48} color="#3178C6" />,
  cpp: <SiCplusplus size={48} color="#00599C" />,
  c: <SiC size={48} color="#A8B9CC" />,
  csharp: <SiDotnet size={48} color="#512BD4" />,
  python: <SiPython size={48} color="#3776AB" />,
  sql: <FaDatabase size={48} color="#F29111" />,
  swift: <SiSwift size={48} color="#F05138" />,
  git: <SiGit size={48} color="#F05032" />,
  docker: <SiDocker size={48} color="#2496ED" />,
  aws: <SiAmazonwebservices size={48} color="#FF9900" />,
  supabase: <SiSupabase size={48} color="#3FCF8E" />,
  postman: <SiPostman size={48} color="#FF6C37" />,
  springboot: <SiSpringboot size={48} color="#6DB33F" />,
  react: <SiReact size={48} color="#61DAFB" />,
  nextjs: <SiNextdotjs size={48} color="#FFFFFF" />,
  nodejs: <SiNodedotjs size={48} color="#339933" />,
  django: <SiDjango size={48} color="#092E20" />,
  postgresql: <SiPostgresql size={48} color="#4169E1" />,
};

interface CarouselRow {
  label: string;
  icons: (keyof typeof iconComponents)[];
}

interface InfiniteIconCarouselProps {
  rows: CarouselRow[];
}

const InfiniteIconCarousel: React.FC<InfiniteIconCarouselProps> = ({
  rows,
}) => {
  return (
    <div className="flex flex-col justify-center gap-4 overflow-hidden flex-1">
      {rows.map((row, rowIndex) => (
        <div key={row.label} className="flex flex-col gap-3">
          <div className="relative overflow-hidden">
            <motion.div
              className="flex gap-8"
              animate={{ x: [0, -104 * row.icons.length] }}
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 15 + rowIndex * 3,
                  ease: "linear",
                },
              }}
            >
              {/* Duplicate icons for seamless loop */}
              {[...row.icons, ...row.icons, ...row.icons].map((iconKey, i) => (
                <div
                  key={i}
                  className="flex items-center justify-center shrink-0 w-24 h-24 rounded-xl bg-zinc-800/50 border border-zinc-700/50"
                >
                  {iconComponents[iconKey]}
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default InfiniteIconCarousel;
