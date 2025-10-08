import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { launchFireworks } from "../utils/firework";


const Intro:React.FC = () => {

    const titles: string[] = ["ENGINEER", "CS MAJOR", "BUILDER"]; // Titles to cycle through
    const [index, setIndex] = useState<number>(0); // Current index
    

    // Cycle through titles every 2.5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
        setIndex((prev) => (prev + 1) % titles.length);
        }, 2500);
        return () => clearInterval(interval);
    }, []);

    return (
        <motion.div className="absolute flex flex-col justify-center align-middle text-center 
         font-alfa w-full text-[100px] top-1/2 -translate-y-1/2 "
         initial= {{ scale: 0.1, opacity: 0 }}
         animate ={{ scale: 1, opacity: 1 }}
         transition={{duration: 32, ease: "easeOut"}}
         onAnimationComplete={() => launchFireworks()}
         >
            <span className=" text-white [text-shadow:_0_0_4px_white]">HEY, I'M RANDY</span>
    

            <div className="relative -mt-6 text-border flex items-center justify-center">
            {/* Static part */}
            <span className="text-border">I'M A&nbsp;</span>

            {/* Animated part */}
            <div className="relative h-[110px] overflow-hidden w-[600px] flex items-center">
                <AnimatePresence mode="wait">
                <motion.span
                    key={titles[index]}
                    initial={{ y: "100%", opacity: 0 }}
                    animate={{ y: "-12%", opacity: 1 }}
                    exit={{ y: "-100%", opacity: 0 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    className="absolute left-0 top-0 w-full text-left"
                >
                    {titles[index]}
                </motion.span>
                </AnimatePresence>
            </div>
            </div>



        
        <span className="-mt-5 text-white [text-shadow:_0_0_4px_white]"> HEY, I'M RANDY </span>
        </motion.div>
    );
}


export default Intro;