import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';


interface GlassCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  opacity?: number;
  scale?: number;
}

const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ title, children, className, opacity = 1, scale = 1 }, ref) => (
    <motion.div
      ref={ref}
      className={`bg-white/5 border border-white/10 rounded-3xl w-[500px] shadow-2xl p-10 ${className}`}
      animate={{ opacity, scale }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
    >
      <motion.h2
        className="text-3xl font-bold mb-6 tracking-tight"
        animate={{ opacity: opacity > 0.3 ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        {title}
      </motion.h2>
      <motion.div
        className="text-gray-300 space-y-3 leading-relaxed"
        animate={{ opacity: opacity > 0.3 ? 1 : 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        {children}
      </motion.div>
    </motion.div>
  )
);

export default GlassCard;