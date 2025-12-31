import { motion, AnimatePresence } from "framer-motion";
import type { SectionId } from "../typesConstants";
import { useWorldStore } from "../state/useWorldStore";

import profile2 from "../assets/profile-pic.png";
import { useEffect, useState } from "react";
import { FileDown, Menu, X, ChevronDown } from "lucide-react";
import { useMediaQuery } from "../hooks/useMediaQuery";

const Navbar: React.FC = () => {
    const jumpTo = useWorldStore((state) => state.jumpTo);

    const resetTo: () => void = useWorldStore((state) => state.reset);
    const [showResumePreview, setShowResumePreview] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSkillsExpanded, setIsSkillsExpanded] = useState(false);
    const isDesktop = useMediaQuery("(min-width: 1024px)");
   
    const resumeUrl = `${import.meta.env.BASE_URL}files/resume.pdf`;
    const resumePreview = `${import.meta.env.BASE_URL}images/resume-photo.png`;

    // Main nav sections (Skills is handled separately as dropdown)
    const sections: { id: SectionId; label: string }[] = [
      { id: 'about', label: 'About' },
      { id: 'projects', label: 'Projects' },
    ];

    // Skills dropdown sub-sections
    const skillSections: { id: SectionId; label: string }[] = [
      { id: 'languages', label: 'Languages' },
      { id: 'tools', label: 'Developer Tools' },
      { id: 'frameworks', label: 'Frameworks' },
    ];
  

    const handleProfileClick = () => {
      if (isDesktop) {
        resetTo();
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    };

    const handleNavClick = (sectionId: SectionId) => {
      if (isDesktop) {
        jumpTo(sectionId);
      } else {
        // Map desktop skill section IDs to mobile skills section
        const mobileId = ['languages', 'tools', 'frameworks'].includes(sectionId)
          ? 'skills'
          : sectionId;
        const el = document.getElementById(mobileId);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
      setIsMobileMenuOpen(false);
      setIsSkillsExpanded(false);
    };

    // Close mobile menu when switching to desktop
    useEffect(() => {
      if (isDesktop) {
        setIsMobileMenuOpen(false);
        setIsSkillsExpanded(false);
      }
    }, [isDesktop]);

          
    return (
      <>
        <motion.nav
          className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 lg:justify-center lg:gap-8 py-3 lg:py-4
          bg-white/10 backdrop-blur-xl border-b border-white/10
          shadow-[0_0_30px_rgba(255,255,255,0.15)]
        "
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          {/* Left: Profile (both mobile and desktop) */}
          <div className="flex items-center gap-3 lg:absolute lg:left-8">
            <motion.img
              src={profile2}
              alt="Profile"
              className="w-10 h-10 lg:w-14 lg:h-14 rounded-full border border-white/20
                shadow-[0_0_20px_rgba(255,255,255,0.3)]
                object-cover object-center hover:cursor-pointer"
              whileHover={{ scale: 1.08, boxShadow: "0 0 25px rgba(255,255,255,0.6)" }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              onClick={() => {
                handleProfileClick();
                setIsMobileMenuOpen(false);
              }}
            />
            {/* Name - hidden on mobile, shown on desktop */}
            <span className="hidden lg:block text-white/90 font-bold tracking-wide">Randy Pahang II</span>
          </div>

          {/* Center: Name on mobile only */}
          <span className="lg:hidden text-white/90 font-bold tracking-wide text-sm">Randy Pahang II</span>

          {/* --- Center Navigation Buttons (Desktop only) --- */}
          <div className="hidden lg:flex gap-6">
            {sections.map((section, index) => (
              <motion.button
                key={section.id}
                onClick={() => handleNavClick(section.id)}
                className="
                  text-white/80 hover:text-white px-4 py-2 rounded-lg relative font-medium tracking-wide
                  transition-colors hover:cursor-pointer
                "
                whileHover={{
                  scale: 1.08,
                  textShadow: "0 0 15px rgba(255,255,255,0.4)",
                }}
                whileTap={{ scale: 0.85 }}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  opacity: { duration: 0.25, delay: index * 0.1 },
                  y: { duration: 0.25, delay: index * 0.1 },
                  type: "spring",
                  stiffness: 200,
                  damping: 15,
                }}
              >
                {section.label}
                <motion.div
                  className="absolute inset-0 rounded-lg bg-white/10 z-0"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                />
              </motion.button>
            ))}

            {/* Skills Dropdown (Desktop) */}
            <div className="relative group">
              <motion.button
                onClick={() => handleNavClick('languages')}
                className="
                  text-white/80 hover:text-white px-4 py-2 rounded-lg relative font-medium tracking-wide
                  transition-colors hover:cursor-pointer flex items-center gap-1
                "
                whileHover={{
                  scale: 1.08,
                  textShadow: "0 0 15px rgba(255,255,255,0.4)",
                }}
                whileTap={{ scale: 0.85 }}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  opacity: { duration: 0.25, delay: 0.2 },
                  y: { duration: 0.25, delay: 0.2 },
                  type: "spring",
                  stiffness: 200,
                  damping: 15,
                }}
              >
                Skills
                <svg
                  className="w-4 h-4 transition-transform group-hover:rotate-180"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                <motion.div
                  className="absolute inset-0 rounded-lg bg-white/10 z-0"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                />
              </motion.button>

              {/* Desktop Dropdown Menu */}
              <div className="absolute top-full left-0 mt-2 py-2 min-w-[160px] rounded-lg
                bg-white/10 backdrop-blur-xl border border-white/10
                shadow-[0_0_20px_rgba(255,255,255,0.1)]
                opacity-0 invisible group-hover:opacity-100 group-hover:visible
                transition-all duration-200 z-50"
              >
                {skillSections.map((skill) => (
                  <button
                    key={skill.id}
                    onClick={() => handleNavClick(skill.id)}
                    className="w-full text-left px-4 py-2 text-white/80 hover:text-white
                      hover:bg-white/10 transition-colors text-sm font-medium"
                  >
                    {skill.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Contact Button (Desktop) */}
            <motion.button
              onClick={() => handleNavClick('contact')}
              className="
                text-white/80 hover:text-white px-4 py-2 rounded-lg relative font-medium tracking-wide
                transition-colors hover:cursor-pointer
              "
              whileHover={{
                scale: 1.08,
                textShadow: "0 0 15px rgba(255,255,255,0.4)",
              }}
              whileTap={{ scale: 0.85 }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                opacity: { duration: 0.25, delay: 0.3 },
                y: { duration: 0.25, delay: 0.3 },
                type: "spring",
                stiffness: 200,
                damping: 15,
              }}
            >
              Contact
              <motion.div
                className="absolute inset-0 rounded-lg bg-white/10 z-0"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              />
            </motion.button>
          </div>

          {/* Right side: Resume + Hamburger (mobile) or just Resume (desktop) */}
          <div className="flex items-center gap-3 lg:absolute lg:right-16">
            {/* Resume download button */}
            <motion.a
              href={resumeUrl}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="relative p-2 rounded-full bg-white/10 border border-white/15 shadow-[0_0_15px_rgba(255,255,255,0.2)]"
              whileHover={{ rotate: -6, scale: 1.08 }}
              whileTap={{ scale: 0.9, rotate: 0 }}
              onMouseEnter={() => setShowResumePreview(true)}
              onMouseLeave={() => setShowResumePreview(false)}
            >
              <FileDown className="w-5 h-5 lg:w-6 lg:h-6 text-white" strokeWidth={1.8} />
            </motion.a>

            {/* Hamburger button (mobile only) */}
            <motion.button
              className="lg:hidden p-2 rounded-lg bg-white/10 border border-white/15"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              whileTap={{ scale: 0.9 }}
            >
              <AnimatePresence mode="wait">
                {isMobileMenuOpen ? (
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

          {/* Resume preview tooltip (desktop only) */}
          <AnimatePresence>
            {showResumePreview && isDesktop && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.18 }}
                className="fixed top-16 right-6 z-50 pointer-events-none"
              >
                <div className="rounded-lg overflow-hidden border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_15px_35px_rgba(0,0,0,0.35)]">
                  <img
                    src={resumePreview}
                    alt="Resume preview"
                    className="w-80 h-48 object-cover"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.nav>

        {/* Mobile Dropdown Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && !isDesktop && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="fixed top-[52px] left-0 right-0 z-40 overflow-hidden
                bg-white/10 backdrop-blur-xl border-b border-white/10
                shadow-[0_10px_30px_rgba(0,0,0,0.3)]"
            >
              <div className="flex flex-col py-2">
                {/* Main nav sections */}
                {sections.map((section, index) => (
                  <motion.button
                    key={section.id}
                    onClick={() => handleNavClick(section.id)}
                    className="w-full text-left px-6 py-3 text-white/90 hover:bg-white/10
                      transition-colors font-medium tracking-wide cursor-pointer"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    {section.label}
                  </motion.button>
                ))}

                {/* Skills accordion */}
                <div>
                  <motion.button
                    onClick={() => setIsSkillsExpanded(!isSkillsExpanded)}
                    className="w-full text-left px-6 py-3 text-white/90 hover:bg-white/10
                      transition-colors font-medium tracking-wide flex items-center justify-between cursor-pointer"
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
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden bg-white/5"
                      >
                        {skillSections.map((skill, index) => (
                          <motion.button
                            key={skill.id}
                            onClick={() => handleNavClick(skill.id)}
                            className="w-full text-left pl-10 pr-6 py-2.5 text-white/80 hover:bg-white/10
                              transition-colors text-sm font-medium cursor-pointer"
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

                {/* Contact */}
                <motion.button
                  onClick={() => handleNavClick('contact')}
                  className="w-full text-left px-6 py-3 text-white/90 hover:bg-white/10
                    transition-colors font-medium tracking-wide cursor-pointer"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 }}
                >
                  Contact
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
};

export default Navbar;
