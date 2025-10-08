import { motion } from "framer-motion";
import type { SectionId } from "../typesConstants";
import { useWorldStore } from "../state/useWorldStore";
import headlines from "../assets/headlines.mp3";
import headlinesBaby from "../assets/headlinesBaby.mp3";
import babyPfp from "../assets/baby.png";

import profile2 from "../assets/profile-pic.png";
import { useEffect, useRef, useState } from "react";
import { launchFireworks } from "../utils/firework";

const Navbar: React.FC = () => {
    const jumpTo: 
    (section: "about" | "projects" | "skills" | "contact" | "thanks") => void 
    = useWorldStore((state) => state.jumpTo);

    const resetTo: () => void = useWorldStore((state) => state.reset);  
    const [isBaby, setIsBaby] = useState<boolean>(false); 
  
    const sections: { id: SectionId; label: string }[] = [
      { id: 'about', label: 'About' },
      { id: 'projects', label: 'Projects' },
      { id: 'skills', label: 'Skills' },
      { id: 'contact', label: 'Contact' },
    ];
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const audio2Ref = useRef<HTMLAudioElement | null>(null);
    useEffect(() => {
        
        // create both audio tracks
        const audio = new Audio(headlines);
        const audio2 = new Audio(headlinesBaby);
        audio.volume = 0;
        audio.loop = false;

        
        audio2.volume = 0;
        audio.loop = false;

        // store them
        audioRef.current = audio;
        audio2Ref.current = audio2;
      
        const handleUserInteraction = () => {
          audio.play().catch((err) => console.warn("Playback error:", err));
          audio2.play().catch((err) => console.warn("Playback error:", err));
          // remove listener so it only runs once
          document.removeEventListener("click", handleUserInteraction);
        };
      
        // wait for a click (could also use 'keydown' or 'touchstart')
        document.addEventListener("click", handleUserInteraction);
      
        return () => {
          document.removeEventListener("click", handleUserInteraction);
          audio.pause();
          audio2.pause();
        };
      }, []);
  

    const handleProfileClick = () => {
      resetTo();

      const a1 = audioRef.current;
      const a2 = audio2Ref.current;
      if (!a1 || !a2) return;

      if (!isBaby) {
        // Switch to baby
        a1.volume = 0;
        a2.volume = 0.8;
      } else {
        // Switch to normal
        a1.volume = 0.8;
        a2.volume = 0;
      }

      setIsBaby(!isBaby);
    };
      
    return (
      <motion.nav 
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center gap-8 py-4 
        bg-white/10 backdrop-blur-xl border-b border-white/10
        shadow-[0_0_30px_rgba(255,255,255,0.15)]
      "
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="absolute left-8 flex items-center gap-3 ">
          <motion.img
            src={isBaby ? babyPfp : profile2}
            alt="Profile"
            className="w-14 h-14 rounded-full border border-white/20 
              shadow-[0_0_20px_rgba(255,255,255,0.3)]
              object-cover object-center hover:cursor-pointer"
            whileHover={{ scale: 1.08, boxShadow: "0 0 25px rgba(255,255,255,0.6)" }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            onClick={() => {
              handleProfileClick();
              
            }}
          />
          {
            isBaby ? (
              <span className="text-white/90 font-large font-bold tracking-wide">Baby</span>
            ) : 
            (

              <span className="text-white/90 font-large font-bold tracking-wide">Randy Pahang II</span>
            )
          }
        </div>

      {/* --- Center Navigation Buttons --- */}
      <div className="flex gap-6">
        {sections.map((section, index) => (
          
          <motion.button
            key={section.id}
            onClick={() => jumpTo(section.id)}
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
      </div>
      </motion.nav>
    );
};

export default Navbar;