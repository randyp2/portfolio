import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  ExternalLink,
  FileText,
  Play,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  LEARNING_PROJECTS,
  PERSONAL_PROJECTS,
  WORK_PROJECTS,
  type Project,
} from "@/content/projects";

const isVideoFile = (url: string): boolean => {
  const videoExtensions = [".mp4", ".webm", ".ogg", ".mov"];
  return videoExtensions.some((ext) => url.toLowerCase().endsWith(ext));
};

interface MobileProjectCardProps {
  project: Project;
}

const MobileProjectCard = ({ project }: MobileProjectCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isReadingMore, setIsReadingMore] = useState(false);
  const isVideo = isVideoFile(project.image);
  const readMoreLinks = project.links.filter(
    (link) => link.includeInReadMore !== false,
  );
  const cardLinks = project.links.filter(
    (link) => link.includeOnCard,
  );

  const toggleExpanded = () => {
    if (isExpanded) {
      setIsReadingMore(false);
    }

    setIsExpanded((currentValue) => !currentValue);
  };

  return (
    <motion.div
      className="terminal-panel mb-3 overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.3 }}
    >
      {/* Header - always visible */}
      <button
        onClick={toggleExpanded}
        className="w-full text-left"
      >
        <div className="flex items-center gap-4 p-4">
          {/* Thumbnail */}
          <div className="h-16 w-16 flex-shrink-0 overflow-hidden border border-[var(--terminal-line)] bg-black">
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
                  project.status === "Finished" ||
                    project.status === "Current Internship" ||
                    project.status === "1st Place"
                    ? "border border-[var(--terminal-line-strong)] bg-[#001d00] text-[var(--terminal-green)]"
                    : project.status === "In Development"
                    ? "border border-[var(--terminal-line)] bg-black text-[var(--terminal-muted)]"
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
              {/* Media and project readme share the same stage. */}
              <div className="mb-3 overflow-hidden border border-[var(--terminal-line)] bg-black">
                {isReadingMore ? (
                  <article className="mobile-project-readme">
                    <header>
                      <span>project://{project.id}/readme</span>
                      <h5>{project.title}</h5>
                      <p>{project.description}</p>
                    </header>

                    <div>
                      <p>{project.details}</p>
                    </div>

                    {readMoreLinks.length > 0 ? (
                      <footer>
                        <span>Explore further</span>
                        <nav aria-label={`${project.title} links`}>
                          {readMoreLinks.map((link) => (
                            <a
                              key={`${link.label}-${link.href}`}
                              href={link.href}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <span>{link.label}</span>
                              <ExternalLink aria-hidden="true" />
                            </a>
                          ))}
                        </nav>
                      </footer>
                    ) : null}
                  </article>
                ) : project.embedUrl ? (
                  <iframe
                    src={project.embedUrl}
                    title={`${project.title} video`}
                    className="aspect-video w-full bg-black"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    loading="lazy"
                    allowFullScreen
                  />
                ) : isVideo ? (
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
              {!isReadingMore && project.description && (
                <p className="text-zinc-400 text-sm mb-3">
                  {project.description}
                </p>
              )}

              {/* Tags */}
              {!isReadingMore &&
                project.tags &&
                project.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="border border-[var(--terminal-line)] bg-[#001d00] px-2 py-0.5 text-xs font-medium text-[var(--terminal-muted)]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  aria-pressed={isReadingMore}
                  onClick={() =>
                    setIsReadingMore(
                      (currentValue) => !currentValue,
                    )
                  }
                  className="terminal-button inline-flex items-center gap-2 px-4 py-2 text-sm font-medium"
                >
                  {isReadingMore ? (
                    <Play className="w-3.5 h-3.5" />
                  ) : (
                    <FileText className="w-3.5 h-3.5" />
                  )}
                  {isReadingMore ? "View media" : "Read more"}
                </button>

                {cardLinks.map((link) => (
                  <a
                    key={`${link.label}-${link.href}`}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="terminal-button inline-flex items-center gap-2 px-4 py-2 text-sm font-medium"
                  >
                    {link.label}
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                ))}
              </div>
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
      <div className="mb-6 flex items-center gap-3">
        <span className="terminal-kicker">02 // projects</span>
        <span className="h-px flex-1 bg-[var(--terminal-line)]" />
      </div>

      {/* Personal Projects */}
      <div className="mb-8">
        <h3 className="terminal-command mb-3 text-sm font-medium">
          ls ./personal
        </h3>
        {PERSONAL_PROJECTS.map((project) => (
          <MobileProjectCard key={project.id} project={project} />
        ))}
      </div>

      {/* Work Projects */}
      <div className="mb-8">
        <h3 className="terminal-command mb-3 text-sm font-medium">
          ls ./work
        </h3>
        {WORK_PROJECTS.map((project) => (
          <MobileProjectCard key={project.id} project={project} />
        ))}
      </div>

      {/* Learning Projects */}
      <div>
        <h3 className="terminal-command mb-3 text-sm font-medium">
          ls ./learning
        </h3>
        {LEARNING_PROJECTS.map((project) => (
          <MobileProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
};

export default MobileProjects;
