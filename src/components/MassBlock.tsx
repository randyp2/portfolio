import { motion } from "framer-motion";
import React from "react";


interface MassBlockProps {
    label: string;
    index: number;
}


const MassBlock: React.FC<MassBlockProps> = ({ label, index }) => {
    return (
        <motion.div
        initial={{ y: -400, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
            type: "spring",
            stiffness: 180,
            damping: 12,
            mass: 0.8,
            delay: index * 0.25,
        }}
        className="w-16 h-16 rounded-xl bg-cyan-500/60 border border-cyan-400/40
                flex items-center justify-center text-white font-semibold
                shadow-[0_0_15px_#00ffff90] select-none"
        >
            {label}
        </motion.div>
  );
}

export default MassBlock;