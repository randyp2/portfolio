import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface Project {
  id: string;
  image: string;
  title: string;
  description?: string;
  tags?: string[];
  status?: "In Development" | "Finished" | "Archived";
  link?: string;
}

const isVideoFile = (url: string): boolean => {
  const videoExtensions = [".mp4", ".webm", ".ogg", ".mov"];
  return videoExtensions.some((ext) => url.toLowerCase().endsWith(ext));
};

const personalProjects: Project[] = [
  {
    id: "p1",
    image: "/media/portfolio-gen-prev.mp4",
    title: "Portfolio Generator",
    description: "Generates a portfolio based on user form and user resume",
    tags: ["Next.js", "TailwindCSS", "Java", "Spring Boot", "Docker", "AWS"],
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
];

const workProjects: Project[] = [
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
    tags: ["Next.js", "Supabase", "Spring Boot", "AWS", "Docker", "Vercel"],
    status: "In Development",
    link: "https://example.com",
  },
];

interface MobileProjectCardProps {
  project: Project;
}

const MobileProjectCard = ({ project }: MobileProjectCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isVideo = isVideoFile(project.image);

  return (
    <motion.div
      className="mb-3 rounded-xl border border-zinc-800 bg-zinc-950/90 overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.3 }}
    >
      {/* Header - always visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full text-left"
      >
        <div className="flex items-center gap-4 p-4">
          {/* Thumbnail */}
          <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-zinc-900">
            {isVideo ? (
              <video
                src={project.image}
                className="w-full h-full object-cover"
                muted
                playsInline
                loop
                autoPlay
              />
            ) : (
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover"
              />
            )}
          </div>

          {/* Title + Status */}
          <div className="flex-1 min-w-0">
            <h4 className="text-white font-medium truncate">{project.title}</h4>
            {project.status && (
              <span
                className={cn(
                  "inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded-full",
                  project.status === "Finished"
                    ? "bg-green-500/20 text-green-400 border border-green-500/30"
                    : project.status === "In Development"
                    ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                    : "bg-zinc-500/20 text-zinc-400 border border-zinc-500/30"
                )}
              >
                {project.status}
              </span>
            )}
          </div>

          {/* Expand icon */}
          <ChevronDown
            className={cn(
              "w-5 h-5 text-zinc-400 transition-transform duration-200 flex-shrink-0",
              isExpanded && "rotate-180"
            )}
          />
        </div>
      </button>

      {/* Expandable content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4">
              {/* Full media preview */}
              <div className="rounded-lg overflow-hidden mb-3 bg-zinc-900">
                {isVideo ? (
                  <video
                    src={project.image}
                    className="w-full h-auto"
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
                ) : (
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-auto"
                  />
                )}
              </div>

              {/* Description */}
              {project.description && (
                <p className="text-zinc-400 text-sm mb-3">
                  {project.description}
                </p>
              )}

              {/* Tags */}
              {project.tags && project.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 text-xs font-medium bg-zinc-800 text-zinc-300 rounded border border-zinc-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Link button */}
              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-zinc-300 bg-zinc-800 hover:bg-zinc-700 rounded-lg border border-zinc-700 transition-colors"
                >
                  View Project
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const MobileProjects: React.FC = () => {
  return (
    <section id="projects" className="py-12 px-4">
      <h2 className="text-2xl font-bold text-white mb-6">Projects</h2>

      {/* Personal Projects */}
      <div className="mb-8">
        <h3 className="text-lg text-zinc-400 mb-3 font-medium">Personal</h3>
        {personalProjects.map((project) => (
          <MobileProjectCard key={project.id} project={project} />
        ))}
      </div>

      {/* Work Projects */}
      <div className="mb-8">
        <h3 className="text-lg text-zinc-400 mb-3 font-medium">Work</h3>
        {workProjects.map((project) => (
          <MobileProjectCard key={project.id} project={project} />
        ))}
      </div>

      {/* Learning - Coming Soon */}
      <div>
        <h3 className="text-lg text-zinc-400 mb-3 font-medium">Learning</h3>
        <div className="rounded-xl border border-zinc-800 bg-zinc-950/90 p-6 text-center">
          <p className="text-zinc-500 text-sm">Coming soon...</p>
        </div>
      </div>
    </section>
  );
};

export default MobileProjects;
