import React, { useMemo } from "react";

interface Star {
  size: number;
  x: number;
  y: number;
}

interface StarFieldProps {
  worldWidth: number;
  viewportHeight: number;
}

/**
 * Renders sharp background stars without haze or bloom effects.
 */
const StarField: React.FC<StarFieldProps> = ({
  worldWidth,
  viewportHeight,
}) => {
  const stars = useMemo<Star[]>(() => {
    return Array.from({ length: 25 }, () => ({
      size: Math.random() * 2 + 1,
      x: Math.random() * (worldWidth + 400),
      y: Math.random() * viewportHeight,
    }));
  }, [viewportHeight, worldWidth]);

  return (
    <div className="pointer-events-none absolute inset-0 z-0">
      {stars.map(({ size, x, y }, index) => (
        <div
          key={index}
          className="absolute bg-[var(--terminal-green)] opacity-50"
          style={{
            width: `${size}px`,
            height: `${size}px`,
            left: `${x}px`,
            top: `${y}px`,
          }}
        />
      ))}
    </div>
  );
};

export default StarField;
