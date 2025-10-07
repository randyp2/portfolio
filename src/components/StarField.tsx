import React, { useMemo } from "react";
import { SECTION_X } from "../typesConstants";

const StarField: React.FC<{ viewportHeight: number }> = ({ viewportHeight }) => {
    // Generate stars only once when the component mounts
    const stars = useMemo(() => {
      const arr = [];
      for (let i = 0; i < 25; i++) {
        const size = Math.random() * 3 + 1;
        const x = Math.random() * (SECTION_X.thanks + 400);
        const y = Math.random() * viewportHeight;
        const glow = size * 4;
        arr.push({ size, x, y, glow });
      }
      return arr;
    }, [viewportHeight]); // re-generate only if the screen height changes
  
    return (
      <div className="absolute inset-0 z-0 pointer-events-none">
        {stars.map(({ size, x, y, glow }, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white opacity-80"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              left: `${x}px`,
              top: `${y}px`,
              boxShadow: `0 0 ${glow}px ${glow / 3}px rgba(255,255,255,0.8)`,
              filter: "blur(0.5px)",
            }}
          />
        ))}
      </div>
    );
  };
  
  export default StarField;