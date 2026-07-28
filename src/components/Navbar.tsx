import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  FileDown,
  Github,
  Linkedin,
  Menu,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useMediaQuery } from "../hooks/useMediaQuery";
import { useWorldStore } from "../state/useWorldStore";
import type {
  ExperienceSectionId,
  SectionId,
} from "../typesConstants";

const sectionsBeforeExperience: {
  id: SectionId;
  label: string;
}[] = [
  { id: "about", label: "about" },
];

const sectionsAfterExperience: {
  id: SectionId;
  label: string;
}[] = [
  { id: "projects", label: "projects" },
];

const experienceSections: {
  id: ExperienceSectionId;
  label: string;
}[] = [
  { id: "experience", label: "01 // nevada help desk" },
  {
    id: "experience-unlv-tutor",
    label: "02 // unlv cs tutor",
  },
  { id: "experience-crj", label: "03 // crj services" },
  { id: "experience-stars", label: "04 // stars" },
  { id: "experience-jt4", label: "05 // jt4" },
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isExperienceExpanded, setIsExperienceExpanded] =
    useState(false);
  const [isSkillsExpanded, setIsSkillsExpanded] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  const resumeUrl = `${import.meta.env.BASE_URL}files/resume.pdf`;

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
    setIsExperienceExpanded(false);
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
    setIsExperienceExpanded(false);
    setIsSkillsExpanded(false);
  }, [isDesktop]);

  return (
    <>
      <motion.nav
        className="navbar-shell fixed left-3 right-3 top-3 z-50 mx-auto flex h-12 max-w-[1240px] items-center justify-between lg:left-6 lg:right-6"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        aria-label="Primary navigation"
      >
        <button
          type="button"
          onClick={handleHomeClick}
          className="navbar-wordmark pointer-events-auto px-2 py-2 text-left"
          aria-label="Return to introduction"
        >
          RJP
        </button>

        <div className="pointer-events-auto hidden items-center gap-1 lg:flex">
          {sectionsBeforeExperience.map((section) => (
            <motion.button
              key={section.id}
              type="button"
              onClick={() => handleNavClick(section.id)}
              className="navbar-nav-link"
              whileTap={{ scale: 0.97 }}
            >
              {section.label}
            </motion.button>
          ))}

          <div className="group relative">
            <motion.button
              type="button"
              onClick={() => handleNavClick("experience")}
              className="navbar-nav-link flex items-center gap-1.5"
              whileTap={{ scale: 0.97 }}
              aria-haspopup="menu"
            >
              <span>experience</span>
              <ChevronDown className="h-3.5 w-3.5 transition-transform group-hover:rotate-180 group-focus-within:rotate-180" />
            </motion.button>

            <div
              className="navbar-dropdown invisible absolute left-0 top-full z-50 mt-2 min-w-[250px] translate-y-1 py-1 opacity-0 transition-all duration-150 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100"
              role="menu"
            >
              {experienceSections.map((checkpoint) => (
                <button
                  key={checkpoint.id}
                  type="button"
                  onClick={() => handleNavClick(checkpoint.id)}
                  className="navbar-dropdown-link block w-full px-3 py-2 text-left"
                  role="menuitem"
                >
                  {checkpoint.label}
                </button>
              ))}
            </div>
          </div>

          {sectionsAfterExperience.map((section) => (
            <motion.button
              key={section.id}
              type="button"
              onClick={() => handleNavClick(section.id)}
              className="navbar-nav-link"
              whileTap={{ scale: 0.97 }}
            >
              {section.label}
            </motion.button>
          ))}

          <div className="group relative">
            <motion.button
              type="button"
              onClick={() => handleNavClick("languages")}
              className="navbar-nav-link flex items-center gap-1.5"
              whileTap={{ scale: 0.97 }}
              aria-haspopup="menu"
            >
              <span>skills</span>
              <ChevronDown className="h-3.5 w-3.5 transition-transform group-hover:rotate-180 group-focus-within:rotate-180" />
            </motion.button>

            <div
              className="navbar-dropdown invisible absolute left-0 top-full z-50 mt-2 min-w-[190px] translate-y-1 py-1 opacity-0 transition-all duration-150 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100"
              role="menu"
            >
              {skillSections.map((skill) => (
                <button
                  key={skill.id}
                  type="button"
                  onClick={() => handleNavClick(skill.id)}
                  className="navbar-dropdown-link block w-full px-3 py-2 text-left"
                  role="menuitem"
                >
                  {skill.label}
                </button>
              ))}
            </div>
          </div>

          <motion.button
            type="button"
            onClick={() => handleNavClick("contact")}
            className="navbar-nav-link"
            whileTap={{ scale: 0.97 }}
          >
            contact
          </motion.button>
        </div>

        <div className="pointer-events-auto flex items-center gap-1">
          <motion.a
            href={resumeUrl}
            download
            target="_blank"
            rel="noopener noreferrer"
            className="navbar-icon-link"
            whileTap={{ scale: 0.96 }}
            aria-label="Download resume"
            title="Resume"
          >
            <FileDown aria-hidden="true" />
          </motion.a>

          <motion.a
            href="https://github.com/randyp2"
            target="_blank"
            rel="noreferrer"
            className="navbar-icon-link"
            whileTap={{ scale: 0.96 }}
            aria-label="Open Randy's GitHub"
            title="GitHub"
          >
            <Github aria-hidden="true" />
          </motion.a>

          <motion.a
            href="https://linkedin.com/in/randypahangii"
            target="_blank"
            rel="noreferrer"
            className="navbar-icon-link"
            whileTap={{ scale: 0.96 }}
            aria-label="Open Randy's LinkedIn"
            title="LinkedIn"
          >
            <Linkedin aria-hidden="true" />
          </motion.a>

          {!isDesktop && (
            <motion.button
              type="button"
              className="navbar-icon-link"
              onClick={() =>
                setIsMobileMenuOpen((current) => !current)
              }
              whileTap={{ scale: 0.94 }}
              aria-label={
                isMobileMenuOpen
                  ? "Close navigation"
                  : "Open navigation"
              }
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
          )}
        </div>

      </motion.nav>

      <AnimatePresence>
        {isMobileMenuOpen && !isDesktop && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="navbar-mobile-menu fixed left-3 right-3 top-[68px] z-40 overflow-hidden"
          >
            <div className="flex flex-col p-1.5">
              {sectionsBeforeExperience.map((section, index) => (
                <motion.button
                  key={section.id}
                  type="button"
                  onClick={() => handleNavClick(section.id)}
                  className="navbar-mobile-link px-4 py-3 text-left"
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.04 }}
                >
                  {section.label}
                </motion.button>
              ))}

              <button
                type="button"
                onClick={() =>
                  setIsExperienceExpanded((current) => !current)
                }
                className="navbar-mobile-link flex items-center justify-between px-4 py-3 text-left"
                aria-expanded={isExperienceExpanded}
              >
                <span>experience</span>
                <motion.span
                  animate={{
                    rotate: isExperienceExpanded ? 180 : 0,
                  }}
                  transition={{ duration: 0.16 }}
                >
                  <ChevronDown className="h-4 w-4" />
                </motion.span>
              </button>

              <AnimatePresence>
                {isExperienceExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden border-l border-[var(--terminal-line)] bg-black/50 pl-4"
                  >
                    {experienceSections.map((checkpoint) => (
                      <button
                        key={checkpoint.id}
                        type="button"
                        onClick={() =>
                          handleNavClick(checkpoint.id)
                        }
                        className="navbar-mobile-link block w-full px-4 py-2.5 text-left text-xs text-[var(--terminal-muted)]"
                      >
                        {checkpoint.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {sectionsAfterExperience.map((section, index) => (
                <motion.button
                  key={section.id}
                  type="button"
                  onClick={() => handleNavClick(section.id)}
                  className="navbar-mobile-link px-4 py-3 text-left"
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay:
                      (sectionsBeforeExperience.length + index + 1) *
                      0.04,
                  }}
                >
                  {section.label}
                </motion.button>
              ))}

              <button
                type="button"
                onClick={() => setIsSkillsExpanded((current) => !current)}
                className="navbar-mobile-link flex items-center justify-between px-4 py-3 text-left"
              >
                <span>skills</span>
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
                        className="navbar-mobile-link block w-full px-4 py-2.5 text-left text-xs text-[var(--terminal-muted)]"
                      >
                        {skill.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                type="button"
                onClick={() => handleNavClick("contact")}
                className="navbar-mobile-link px-4 py-3 text-left"
              >
                contact
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
