import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, FileDown, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useMediaQuery } from "../hooks/useMediaQuery";
import { useWorldStore } from "../state/useWorldStore";
import type { SectionId } from "../typesConstants";

const primarySections: { id: SectionId; label: string; index: string }[] = [
  { id: "about", label: "about", index: "01" },
  { id: "projects", label: "projects", index: "02" },
];

const skillSections: { id: SectionId; label: string }[] = [
  { id: "languages", label: "languages" },
  { id: "tools", label: "developer-tools" },
  { id: "frameworks", label: "frameworks" },
];

const mobileSkillIds: SectionId[] = ["languages", "tools", "frameworks"];

const Navbar: React.FC = () => {
  const jumpTo = useWorldStore((state) => state.jumpTo);
  const resetTo = useWorldStore((state) => state.reset);
  const [showResumePreview, setShowResumePreview] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSkillsExpanded, setIsSkillsExpanded] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  const resumeUrl = `${import.meta.env.BASE_URL}files/resume.pdf`;
  const resumePreview = `${import.meta.env.BASE_URL}images/resume-photo.png`;

  const handleHomeClick = () => {
    if (isDesktop) {
      resetTo();
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  };

  const handleNavClick = (sectionId: SectionId) => {
    if (isDesktop) {
      jumpTo(sectionId);
      return;
    }

    setIsMobileMenuOpen(false);
    setIsSkillsExpanded(false);

    window.setTimeout(() => {
      const mobileId = mobileSkillIds.includes(sectionId)
        ? "skills"
        : sectionId;
      const element = document.getElementById(mobileId);
      if (!element) return;

      const navbarOffset = 72;
      const offsetPosition =
        element.getBoundingClientRect().top + window.scrollY - navbarOffset;

      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }, 100);
  };

  useEffect(() => {
    if (!isDesktop) return;
    setIsMobileMenuOpen(false);
    setIsSkillsExpanded(false);
  }, [isDesktop]);

  return (
    <>
      <motion.nav
        className="terminal-panel fixed left-3 right-3 top-3 z-50 mx-auto flex h-[58px] max-w-[1240px] items-center justify-between px-3 lg:left-6 lg:right-6 lg:px-4"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        aria-label="Primary navigation"
      >
        <button
          type="button"
          onClick={handleHomeClick}
          className="group flex min-w-0 items-center gap-2 px-2 py-2 text-left"
          aria-label="Return to introduction"
        >
          <span className="terminal-dot shrink-0" aria-hidden="true" />
          <span className="hidden text-xs font-bold tracking-[0.08em] text-[var(--terminal-green-bright)] sm:inline">
            rjp@portfolio
          </span>
          <span className="text-xs text-[var(--terminal-muted)]">:~$</span>
          <span className="h-4 w-[7px] bg-[var(--terminal-green)] opacity-80 group-hover:animate-pulse" />
        </button>

        <div className="hidden items-center gap-1 lg:flex">
          {primarySections.map((section) => (
            <motion.button
              key={section.id}
              type="button"
              onClick={() => handleNavClick(section.id)}
              className="terminal-button flex items-center gap-2 px-3 py-2 text-xs font-semibold tracking-[0.08em]"
              whileTap={{ scale: 0.97 }}
            >
              <span className="text-[var(--terminal-muted)]">
                [{section.index}]
              </span>
              <span>./{section.label}</span>
            </motion.button>
          ))}

          <div className="group relative">
            <motion.button
              type="button"
              onClick={() => handleNavClick("languages")}
              className="terminal-button flex items-center gap-2 px-3 py-2 text-xs font-semibold tracking-[0.08em]"
              whileTap={{ scale: 0.97 }}
              aria-haspopup="menu"
            >
              <span className="text-[var(--terminal-muted)]">[03]</span>
              <span>./skills</span>
              <ChevronDown className="h-3.5 w-3.5 transition-transform group-hover:rotate-180 group-focus-within:rotate-180" />
            </motion.button>

            <div
              className="terminal-panel invisible absolute left-0 top-full z-50 mt-2 min-w-[220px] translate-y-1 p-1 opacity-0 transition-all duration-150 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100"
              role="menu"
            >
              <div className="terminal-titlebar mb-1">
                <span className="terminal-dot" />
                ~/skills
              </div>
              {skillSections.map((skill) => (
                <button
                  key={skill.id}
                  type="button"
                  onClick={() => handleNavClick(skill.id)}
                  className="block w-full px-3 py-2 text-left text-xs text-[var(--terminal-muted)] transition-colors hover:bg-[var(--terminal-surface)] hover:text-[var(--terminal-green-bright)]"
                  role="menuitem"
                >
                  <span className="mr-2 text-[var(--terminal-green)]">$</span>
                  cd ./{skill.label}
                </button>
              ))}
            </div>
          </div>

          <motion.button
            type="button"
            onClick={() => handleNavClick("contact")}
            className="terminal-button flex items-center gap-2 px-3 py-2 text-xs font-semibold tracking-[0.08em]"
            whileTap={{ scale: 0.97 }}
          >
            <span className="text-[var(--terminal-muted)]">[04]</span>
            <span>./contact</span>
          </motion.button>
        </div>

        <div className="flex items-center gap-2">
          <motion.a
            href={resumeUrl}
            download
            target="_blank"
            rel="noopener noreferrer"
            className="terminal-button flex h-9 items-center gap-2 px-2.5 text-xs font-semibold tracking-[0.08em] lg:px-3"
            whileTap={{ scale: 0.96 }}
            onMouseEnter={() => setShowResumePreview(true)}
            onMouseLeave={() => setShowResumePreview(false)}
            onFocus={() => setShowResumePreview(true)}
            onBlur={() => setShowResumePreview(false)}
            aria-label="Download resume"
          >
            <FileDown className="h-4 w-4" strokeWidth={1.6} />
            <span className="hidden xl:inline">resume.pdf</span>
          </motion.a>

          <motion.button
            type="button"
            className="terminal-button flex h-9 w-9 items-center justify-center lg:hidden"
            onClick={() => setIsMobileMenuOpen((current) => !current)}
            whileTap={{ scale: 0.94 }}
            aria-label={isMobileMenuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={isMobileMenuOpen}
          >
            <AnimatePresence mode="wait" initial={false}>
              {isMobileMenuOpen ? (
                <motion.span
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <X className="h-4 w-4" />
                </motion.span>
              ) : (
                <motion.span
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <Menu className="h-4 w-4" />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        <AnimatePresence>
          {showResumePreview && isDesktop && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.16 }}
              className="terminal-panel pointer-events-none fixed right-6 top-[78px] z-50 w-80 overflow-hidden"
            >
              <div className="terminal-titlebar">
                <span className="terminal-dot" />
                ~/files/resume.pdf
              </div>
              <img
                src={resumePreview}
                alt="Resume preview"
                className="h-48 w-full object-cover opacity-80 grayscale"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      <AnimatePresence>
        {isMobileMenuOpen && !isDesktop && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="terminal-panel fixed left-3 right-3 top-[76px] z-40 overflow-hidden"
          >
            <div className="terminal-titlebar">
              <span className="terminal-dot" />
              navigation.sh
            </div>
            <div className="flex flex-col p-1.5">
              {primarySections.map((section, index) => (
                <motion.button
                  key={section.id}
                  type="button"
                  onClick={() => handleNavClick(section.id)}
                  className="px-4 py-3 text-left text-sm text-[var(--terminal-text)] transition-colors hover:bg-[var(--terminal-surface)]"
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.04 }}
                >
                  <span className="mr-3 text-[var(--terminal-green)]">$</span>
                  cd ./{section.label}
                </motion.button>
              ))}

              <button
                type="button"
                onClick={() => setIsSkillsExpanded((current) => !current)}
                className="flex items-center justify-between px-4 py-3 text-left text-sm text-[var(--terminal-text)] transition-colors hover:bg-[var(--terminal-surface)]"
              >
                <span>
                  <span className="mr-3 text-[var(--terminal-green)]">$</span>
                  ls ./skills
                </span>
                <motion.span
                  animate={{ rotate: isSkillsExpanded ? 180 : 0 }}
                  transition={{ duration: 0.16 }}
                >
                  <ChevronDown className="h-4 w-4" />
                </motion.span>
              </button>

              <AnimatePresence>
                {isSkillsExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden border-l border-[var(--terminal-line)] bg-black/50 pl-4"
                  >
                    {skillSections.map((skill) => (
                      <button
                        key={skill.id}
                        type="button"
                        onClick={() => handleNavClick(skill.id)}
                        className="block w-full px-4 py-2.5 text-left text-xs text-[var(--terminal-muted)] hover:text-[var(--terminal-green-bright)]"
                      >
                        └─ ./{skill.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                type="button"
                onClick={() => handleNavClick("contact")}
                className="px-4 py-3 text-left text-sm text-[var(--terminal-text)] transition-colors hover:bg-[var(--terminal-surface)]"
              >
                <span className="mr-3 text-[var(--terminal-green)]">$</span>
                cd ./contact
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
