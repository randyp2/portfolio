import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";

const roles = ["CREATOR", "CS_MAJOR", "BUILDER"] as const;

const MobileIntro: React.FC = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setIndex((current) => (current + 1) % roles.length);
    }, 2500);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <section
      id="intro"
      className="flex min-h-screen flex-col justify-center px-4 pb-14 pt-24"
    >
      <motion.div
        className="terminal-panel overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
      >
        <div className="terminal-titlebar">
          <span className="terminal-dot" />
          visitor@rjp:~/intro
        </div>

        <div className="px-5 py-8">
          <p className="terminal-command mb-6 text-xs text-[var(--terminal-muted)]">
            whoami
          </p>
          <p className="terminal-kicker mb-2">Full-stack developer</p>
          <h1 className="font-alfa text-[clamp(3rem,16vw,5.5rem)] leading-[0.9] text-[var(--terminal-green-bright)] [text-shadow:0_0_24px_rgba(70,255,123,0.2)]">
            RANDY
            <br />
            PAHANG II
          </h1>

          <div className="mt-7 border-l border-[var(--terminal-line-strong)] pl-4 text-xs leading-6">
            <p>
              <span className="text-[var(--terminal-muted)]">focus:</span>{" "}
              polished products + reliable systems
            </p>
            <p>
              <span className="text-[var(--terminal-muted)]">status:</span>{" "}
              <span className="text-[var(--terminal-green)]">
                open_to_opportunities
              </span>
            </p>
          </div>

          <div className="mt-8 flex items-center gap-2 border-t border-[var(--terminal-line)] pt-4 text-sm">
            <span className="text-[var(--terminal-green)]">$</span>
            <span className="text-[var(--terminal-muted)]">role</span>
            <span className="relative h-6 min-w-[11ch] overflow-hidden font-bold text-[var(--terminal-green-bright)]">
              <AnimatePresence mode="wait">
                <motion.span
                  key={roles[index]}
                  className="absolute"
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

      <motion.div
        className="mt-10 flex flex-col items-center gap-2 text-[var(--terminal-muted)]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.4 }}
      >
        <span className="text-[10px] uppercase tracking-[0.18em]">
          scroll to continue
        </span>
        <ChevronDown className="h-5 w-5 animate-bounce text-[var(--terminal-green)]" />
      </motion.div>
    </section>
  );
};

export default MobileIntro;
