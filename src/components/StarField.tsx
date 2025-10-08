import React, { useMemo } from "react";
import { SECTION_X } from "../typesConstants";

const StarField: React.FC<{ viewportHeight: number }> = ({ viewportHeight }) => {
    // Generate stars only once when the component mounts
    const {stars, orbs} = useMemo(() => {
      const arr: {size: number, x: number, y: number, glow: number}[] = [];
      const orbsArr = [];

      for (let i = 0; i < 25; i++) {
        const size: number = Math.random() * 3 + 1;
        const x: number = Math.random() * (SECTION_X.thanks + 400);
        const y: number = Math.random() * viewportHeight;
        const glow: number = size * 4;
        arr.push({ size, x, y, glow });
      }

      // Large glow orbs (soft white gradients)
      for (let i = 0; i < 6; i++) {
        const radius = Math.random() * 400 + 300; // big soft light
        const x = Math.random() * (SECTION_X.thanks + 400);
        const y = Math.random() * viewportHeight;
        orbsArr.push({ radius, x, y });
      }

      return {stars: arr, orbs: orbsArr};
    }, [viewportHeight]); // re-generate only if the screen height changes
  
    return (
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Background white gradient haze */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.08), rgba(255,255,255,0) 70%)",
            mixBlendMode: "screen",
          }}
        />


        {orbs.map(({ radius, x, y }, i) => (
                <div
                  key={`orb-${i}`}
                  className="absolute rounded-full"
                  style={{
                    left: `${x - radius / 2}px`,
                    top: `${y - radius / 2}px`,
                    width: `${radius}px`,
                    height: `${radius}px`,
                    background:
                      "radial-gradient(circle, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0) 70%)",
                    filter: "blur(60px)",
                    opacity: 0.6,
                    mixBlendMode: "screen",
                  }}
                />
          ))}

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