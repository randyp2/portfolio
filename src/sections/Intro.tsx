import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FaArrowRight } from "react-icons/fa";

const roles = ["CREATOR", "CS_MAJOR", "BUILDER"] as const;

const Intro: React.FC = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setIndex((current) => (current + 1) % roles.length);
    }, 2500);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <motion.section
      className="flex h-screen w-full items-center justify-center gap-10 px-16 pb-24 pt-24"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
    >
      <motion.div
        className="terminal-panel w-full max-w-[920px] overflow-hidden"
        initial={{ y: 24, scale: 0.98 }}
        animate={{ y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="terminal-titlebar">
          <span className="terminal-dot" />
          visitor@rjp:~/intro
          <span className="ml-auto text-[var(--terminal-green)]">● connected</span>
        </div>

        <div className="px-10 py-12 xl:px-14 xl:py-14">
          <p className="terminal-command mb-7 text-sm text-[var(--terminal-muted)]">
            whoami
          </p>

          <p className="terminal-kicker mb-3">Full-stack software engineer</p>
          <h1 className="font-alfa text-[clamp(3.5rem,7vw,7.4rem)] leading-[0.88] text-[var(--terminal-green-bright)] [text-shadow:0_0_30px_rgba(70,255,123,0.18)]">
            RANDY
            <br />
            PAHANG II
          </h1>

          <div className="mt-9 grid grid-cols-[auto_1fr] gap-x-5 gap-y-2 border-l border-[var(--terminal-line-strong)] pl-5 text-sm">
            <span className="text-[var(--terminal-muted)]">location</span>
            <span>Las Vegas, NV</span>
            <span className="text-[var(--terminal-muted)]">focus</span>
            <span>reliable systems + polished interfaces</span>
            <span className="text-[var(--terminal-muted)]">status</span>
            <span className="text-[var(--terminal-green)]">
              open_to_opportunities
            </span>
          </div>

          <div className="mt-10 flex items-center gap-3 border-t border-[var(--terminal-line)] pt-5 text-lg">
            <span className="text-[var(--terminal-green)]">$</span>
            <span className="text-[var(--terminal-muted)]">role --current</span>
            <span className="relative h-7 min-w-[13ch] overflow-hidden font-bold text-[var(--terminal-green-bright)]">
              <AnimatePresence mode="wait">
                <motion.span
                  key={roles[index]}
                  className="absolute left-0"
                  initial={{ y: "100%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: "-100%", opacity: 0 }}
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                >
                  {roles[index]}
                </motion.span>
              </AnimatePresence>
            </span>
            <span className="terminal-cursor" aria-hidden="true" />
          </div>
        </div>
      </motion.div>

      <div className="flex shrink-0 flex-col items-center gap-3 text-[var(--terminal-green)]">
        <motion.div
          animate={{ x: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <FaArrowRight className="text-6xl drop-shadow-[0_0_10px_rgba(70,255,123,0.45)]" />
        </motion.div>
        <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--terminal-muted)]">
          launch orb
        </span>
      </div>
    </motion.section>
  );
};

export default Intro;
