import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import profile2 from "../assets/profile-pic.png";
import { FileDown, Menu, X, ChevronDown } from "lucide-react";

const MobileNavbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSkillsExpanded, setIsSkillsExpanded] = useState(false);

  const resumeUrl = `${import.meta.env.BASE_URL}files/resume.pdf`;

  const sections = [
    { id: "about", label: "About" },
    { id: "projects", label: "Projects" },
    { id: "contact", label: "Contact" },
  ];

  const skillSections = [
    { id: "languages", label: "Languages" },
    { id: "tools", label: "Developer Tools" },
    { id: "frameworks", label: "Frameworks" },
  ];

  const scrollToId = (id: string) => {
    const targetId = ["languages", "tools", "frameworks"].includes(id)
      ? "skills"
      : id;
    const el = document.getElementById(targetId);
    if (!el) return;
    const navbarOffset = 70;
    const scrollEl =
      document.scrollingElement ||
      document.documentElement ||
      document.body;
    const targetY = el.getBoundingClientRect().top + scrollEl.scrollTop - navbarOffset;
    scrollEl.scrollTo({ top: targetY, behavior: "smooth" });
    setIsMenuOpen(false);
    setIsSkillsExpanded(false);
  };

  const handleProfileClick = () => {
    const scrollEl =
      document.scrollingElement ||
      document.documentElement ||
      document.body;
    scrollEl.scrollTo({ top: 0, behavior: "smooth" });
    setIsMenuOpen(false);
    setIsSkillsExpanded(false);
  };

  return (
    <>
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3
        bg-white/10 backdrop-blur-xl border-b border-white/10
        shadow-[0_0_30px_rgba(255,255,255,0.15)]"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="flex items-center gap-3">
          <motion.img
            src={profile2}
            alt="Profile"
            className="w-10 h-10 rounded-full border border-white/20 shadow-[0_0_20px_rgba(255,255,255,0.3)] object-cover object-center hover:cursor-pointer"
            whileHover={{ scale: 1.08, boxShadow: "0 0 25px rgba(255,255,255,0.6)" }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            onClick={handleProfileClick}
          />
          <span className="text-white/90 font-bold tracking-wide text-sm">Randy Pahang II</span>
        </div>

        <div className="flex items-center gap-3">
          <motion.a
            href={resumeUrl}
            download
            target="_blank"
            rel="noopener noreferrer"
            className="relative p-2 rounded-full bg-white/10 border border-white/15 shadow-[0_0_15px_rgba(255,255,255,0.2)]"
            whileHover={{ rotate: -6, scale: 1.08 }}
            whileTap={{ scale: 0.9, rotate: 0 }}
          >
            <FileDown className="w-5 h-5 text-white" strokeWidth={1.8} />
          </motion.a>

          <motion.button
            className="p-2 rounded-lg bg-white/10 border border-white/15"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            whileTap={{ scale: 0.9 }}
          >
            <AnimatePresence mode="wait">
              {isMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <X className="w-5 h-5 text-white" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <Menu className="w-5 h-5 text-white" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="fixed top-[52px] left-0 right-0 z-40 overflow-hidden
              bg-white/10 backdrop-blur-xl border-b border-white/10
              shadow-[0_10px_30px_rgba(0,0,0,0.3)]"
          >
            <div className="flex flex-col py-2">
              {sections.map((section, index) => (
                <motion.button
                  key={section.id}
                  onClick={() => scrollToId(section.id)}
                  className="w-full text-left px-6 py-3 text-white/90 hover:bg-white/10
                    transition-colors font-medium tracking-wide"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  {section.label}
                </motion.button>
              ))}

              <div>
                <motion.button
                  onClick={() => setIsSkillsExpanded(!isSkillsExpanded)}
                  className="w-full text-left px-6 py-3 text-white/90 hover:bg-white/10
                    transition-colors font-medium tracking-wide flex items-center justify-between"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  Skills
                  <motion.div
                    animate={{ rotate: isSkillsExpanded ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </motion.div>
                </motion.button>

                <AnimatePresence>
                  {isSkillsExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden bg-white/5"
                    >
                      {skillSections.map((skill, index) => (
                        <motion.button
                          key={skill.id}
                          onClick={() => scrollToId(skill.id)}
                          className="w-full text-left pl-10 pr-6 py-2.5 text-white/80 hover:bg-white/10
                            transition-colors text-sm font-medium"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          {skill.label}
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MobileNavbar;
