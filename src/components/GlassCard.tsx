import React, { useEffect, useRef } from 'react';
import { FADE_RADIUS } from '../typesConstants';
import { motion } from 'framer-motion';

interface GlassCardProps {
  title: string;
  children: React.ReactNode;
  centerX: number;
  ballX: number;
  cameraX: number;
  viewportCenterX: number;

  // Update bounds of glasscard
  onBoundsChange?: (bounds: {
    title: string;
    x1: number;
    x2: number;
    y1: number;
    y2: number;
  }) => void;

  }
  
const GlassCard: React.FC<GlassCardProps> = ({ title, children, centerX, ballX, cameraX, viewportCenterX, onBoundsChange }) => {
    const distance = Math.abs(ballX - centerX);
    const opacity = Math.max(0, Math.min(1, 1 - distance / FADE_RADIUS));
    const scale = 0.96 + 0.04 * opacity;


    const cardRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
      if(!cardRef.current) return;

      const rect: DOMRect = cardRef.current.getBoundingClientRect();
      const worldLeft: number = cameraX - viewportCenterX + rect.left;
      const worldRight: number = cameraX - viewportCenterX + rect.right;
      onBoundsChange?.({
        title,
        x1: worldLeft,
        x2: worldRight,
        y1: rect.top,
        y2: rect.bottom
      });

    }, [centerX, onBoundsChange, title]);

  
    return (
      <motion.div
        ref={cardRef}
        className="absolute top-1/2 left-1/2 -translate-y-1/2  w-[500px]  bg-white/5 border border-white/10 rounded-3xl shadow-2xl p-10"
        style={{
          left: `${centerX}px`,
        }}
        animate={{
          opacity,
          scale,
        }}
        transition={{
          type: 'spring',
          stiffness: 100,
          damping: 20,
          mass: 0.5,
        }}
      >
        <motion.h2 
          className="text-3xl font-bold mb-6 tracking-tight"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: opacity > 0.3 ? 1 : 0, y: opacity > 0.3 ? 0 : 10 }}
          transition={{ duration: 0.3 }}
        >
          {title}
        </motion.h2>
        <motion.div 
          className="text-gray-300 space-y-3 leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: opacity > 0.3 ? 1 : 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          {children}
        </motion.div>
      </motion.div>
    );
};

export default GlassCard;