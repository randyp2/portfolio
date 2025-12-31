import { useState } from "react";
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
import { cn } from "@/lib/utils";

type SkillKey =
  | "java"
  | "typescript"
  | "cpp"
  | "c"
  | "csharp"
  | "python"
  | "sql"
  | "swift"
  | "git"
  | "docker"
  | "aws"
  | "supabase"
  | "postman"
  | "springboot"
  | "react"
  | "nextjs"
  | "nodejs"
  | "django"
  | "postgresql";

interface SkillInfo {
  icon: React.ReactNode;
  label: string;
}

const skillData: Record<SkillKey, SkillInfo> = {
  java: { icon: <FaJava size={32} color="#ED8B00" />, label: "Java" },
  typescript: {
    icon: <SiTypescript size={32} color="#3178C6" />,
    label: "TypeScript",
  },
  cpp: { icon: <SiCplusplus size={32} color="#00599C" />, label: "C++" },
  c: { icon: <SiC size={32} color="#A8B9CC" />, label: "C" },
  csharp: { icon: <SiDotnet size={32} color="#512BD4" />, label: "C#" },
  python: { icon: <SiPython size={32} color="#3776AB" />, label: "Python" },
  sql: { icon: <FaDatabase size={32} color="#F29111" />, label: "SQL" },
  swift: { icon: <SiSwift size={32} color="#F05138" />, label: "Swift" },
  git: { icon: <SiGit size={32} color="#F05032" />, label: "Git" },
  docker: { icon: <SiDocker size={32} color="#2496ED" />, label: "Docker" },
  aws: { icon: <SiAmazonwebservices size={32} color="#FF9900" />, label: "AWS" },
  supabase: {
    icon: <SiSupabase size={32} color="#3FCF8E" />,
    label: "Supabase",
  },
  postman: { icon: <SiPostman size={32} color="#FF6C37" />, label: "Postman" },
  springboot: {
    icon: <SiSpringboot size={32} color="#6DB33F" />,
    label: "Spring Boot",
  },
  react: { icon: <SiReact size={32} color="#61DAFB" />, label: "React" },
  nextjs: { icon: <SiNextdotjs size={32} color="#FFFFFF" />, label: "Next.js" },
  nodejs: { icon: <SiNodedotjs size={32} color="#339933" />, label: "Node.js" },
  django: { icon: <SiDjango size={32} color="#092E20" />, label: "Django" },
  postgresql: {
    icon: <SiPostgresql size={32} color="#4169E1" />,
    label: "PostgreSQL",
  },
};

const languageSkills: SkillKey[] = [
  "java",
  "typescript",
  "cpp",
  "c",
  "csharp",
  "python",
  "sql",
  "swift",
];
const toolSkills: SkillKey[] = ["git", "docker", "aws", "supabase", "postman"];
const frameworkSkills: SkillKey[] = [
  "springboot",
  "react",
  "nextjs",
  "nodejs",
  "django",
  "postgresql",
];

type TabType = "languages" | "tools" | "frameworks";

interface SkillCardProps {
  skillKey: SkillKey;
}

const SkillCard = ({ skillKey }: SkillCardProps) => {
  const skill = skillData[skillKey];
  return (
    <motion.div
      className="flex flex-col items-center gap-2 p-4 rounded-xl border border-zinc-800 bg-zinc-950/90"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      <div className="w-8 h-8 flex items-center justify-center">{skill.icon}</div>
      <span className="text-xs text-zinc-400 text-center">{skill.label}</span>
    </motion.div>
  );
};

const MobileSkills: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("languages");

  const tabs: { key: TabType; label: string }[] = [
    { key: "languages", label: "Languages" },
    { key: "tools", label: "Tools" },
    { key: "frameworks", label: "Frameworks" },
  ];

  const getSkillsForTab = (tab: TabType): SkillKey[] => {
    switch (tab) {
      case "languages":
        return languageSkills;
      case "tools":
        return toolSkills;
      case "frameworks":
        return frameworkSkills;
    }
  };

  const currentSkills = getSkillsForTab(activeTab);

  return (
    <section id="skills" className="py-12 px-4">
      <h2 className="text-2xl font-bold text-white mb-6">Skills</h2>

      {/* Tab buttons */}
      <div className="flex gap-2 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              "flex-1 px-4 py-2.5 text-sm font-medium rounded-lg border transition-all duration-200",
              activeTab === tab.key
                ? "bg-zinc-800 border-zinc-600 text-white"
                : "bg-zinc-950/90 border-zinc-800 text-zinc-400 active:bg-zinc-800/60"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Skill grid */}
      <motion.div
        key={activeTab}
        className="grid grid-cols-3 sm:grid-cols-4 gap-3"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {currentSkills.map((skill) => (
          <SkillCard key={skill} skillKey={skill} />
        ))}
      </motion.div>
    </section>
  );
};

export default MobileSkills;
