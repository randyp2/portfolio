import React from "react";
import type { PhysicsEntity } from "../physics/SimplePhysics";
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

// Map skill IDs to icons with brand colors (matching InfiniteIconCarousel)
const skillIcons: Record<string, React.ReactNode> = {
  java: <FaJava size={40} color="#ED8B00" />,
  typescript: <SiTypescript size={40} color="#3178C6" />,
  cpp: <SiCplusplus size={40} color="#00599C" />,
  c: <SiC size={40} color="#A8B9CC" />,
  csharp: <SiDotnet size={40} color="#512BD4" />,
  python: <SiPython size={40} color="#3776AB" />,
  sql: <FaDatabase size={40} color="#F29111" />,
  swift: <SiSwift size={40} color="#F05138" />,
  git: <SiGit size={40} color="#F05032" />,
  docker: <SiDocker size={40} color="#2496ED" />,
  aws: <SiAmazonwebservices size={40} color="#FF9900" />,
  supabase: <SiSupabase size={40} color="#3FCF8E" />,
  postman: <SiPostman size={40} color="#FF6C37" />,
  springboot: <SiSpringboot size={40} color="#6DB33F" />,
  react: <SiReact size={40} color="#61DAFB" />,
  nextjs: <SiNextdotjs size={40} color="#FFFFFF" />,
  nodejs: <SiNodedotjs size={40} color="#339933" />,
  django: <SiDjango size={40} color="#092E20" />,
  postgresql: <SiPostgresql size={40} color="#4169E1" />,
};

interface MassBlockProps {
  entity: PhysicsEntity;
  blockRef: (el: HTMLDivElement | null) => void;
}

const MassBlock: React.FC<MassBlockProps> = ({ entity, blockRef }) => {
  const icon = skillIcons[entity.label ?? ""] || entity.label;

  return (
    <div
      ref={blockRef}
      className="absolute rounded-lg flex items-center justify-center select-none bg-zinc-800/50 border border-zinc-700/50"
      style={{
        width: `${entity.width}px`,
        height: `${entity.height}px`,
        willChange: "transform",
      }}
    >
      {icon}
    </div>
  );
};

export default MassBlock;
