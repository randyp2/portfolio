import React, { useState, useEffect, useCallback } from "react";
import Arrow from "./Arrow";
import { SimplePhysics } from "../physics/SimplePhysics";
import { BALL_RADIUS, MAX_LAUNCH_SPEED } from "../typesConstants";
import thudSound from "../assets/ball-thud.mp3";
import { useWorldStore } from "../state/useWorldStore";

interface BallProps {
  physics: SimplePhysics;
  viewportCenterX: number;
  cameraX: number;
  onLaunch: (vx: number, vy: number) => void;
  isLaunching: boolean;
  ballRef: React.RefObject<HTMLDivElement | null>;
}

const Ball: React.FC<BallProps> = ({
  physics,
  viewportCenterX,
  cameraX,
  onLaunch,
  isLaunching,
  ballRef,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 });
  const [currentMouse, setCurrentMouse] = useState({ x: 0, y: 0 });
  const isLightboxOpen = useWorldStore((state) => state.isLightboxOpen);

  // Coordinate of ball (in respect to WorldCanvas) - cameraX + viewportCenterX
  const ballScreenX: number = physics.body.x + viewportCenterX - cameraX;
  const ballScreenY: number = physics.body.y;

  const handlePointerDown = (e: React.PointerEvent) => {
    // Disable dragging when lightbox is open
    if (isLightboxOpen) return;

    setIsDragging(true);

    // Save start position (ball center in screen coords)
    // Save current mouse position
    setDragStartPos({ x: ballScreenX, y: ballScreenY });
    setCurrentMouse({ x: e.clientX, y: e.clientY });
  };

  const handlePointerMove = useCallback(
    (e: PointerEvent) => {
      if (!isDragging) return;
      setCurrentMouse({ x: e.clientX, y: e.clientY }); // Update current mouse position
    },
    [isDragging],
  );

  const handlePointerUp = useCallback(() => {
    if (!isDragging) return;

    // Calculate launch vector (opposite of drag direction)
    const dx: number = dragStartPos.x - currentMouse.x; // vx = x0 - x1
    const dy: number = dragStartPos.y - currentMouse.y; // vy = y0 - y1

    // Magnitude of velocity vector
    let magnitude: number = Math.sqrt(dx * dx + dy * dy); // v = sqrt(vx^2 + vy^2)
    magnitude = Math.min(magnitude, MAX_LAUNCH_SPEED * 10); // Cap the velocity
    const theta: number = Math.atan2(dy, dx); // angle of vector

    const vx = (magnitude * Math.cos(theta)) / 5;
    const vy = (magnitude * Math.sin(theta)) / 5;

    onLaunch(vx, vy);
    setIsDragging(false);
  }, [isDragging, dragStartPos, currentMouse, onLaunch]);

  // Sound effect on collision
  useEffect(() => {
    // Initialize audio effect
    const audio: HTMLAudioElement = new Audio(thudSound);
    let impactVolume: number = 1; // Base value
    const impactDamper: number = 0.7; // Reduce volume of subsequent impacts

    // Connect to physics launch event to reset volume
    physics.onLaunch = () => {
      impactVolume = 1; // Reset volume on launch
    };

    // Connect to physics collision event
    physics.onCollision = () => {
      audio.volume = impactVolume;
      audio.currentTime = 0; // Rewind to start
      audio.play().catch((err) => console.warn("Playback error:", err));

      impactVolume *= impactDamper; // Reduce volume for next impact
      if (impactVolume <= 0.1) impactVolume = 0;
    };

    // Cleanup
    return () => {
      physics.onLaunch = undefined;
      physics.onCollision = undefined;
    };
  }, [physics]);

  // Attach/detach global pointer move/up listeners when dragging
  useEffect(() => {
    if (!isDragging) return;
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [isDragging, handlePointerMove, handlePointerUp]);

  // Calculate arrow end point (opposite to drag direction, from ball center)
  const arrowEndX = dragStartPos.x - (currentMouse.x - dragStartPos.x);
  const arrowEndY = dragStartPos.y - (currentMouse.y - dragStartPos.y);
  return (
    <>
      <div
        ref={ballRef}
        className="absolute rounded-full bg-white cursor-grab active:cursor-grabbing select-none"
        style={{
          width: `${BALL_RADIUS * 2}px`,
          height: `${BALL_RADIUS * 2}px`,
          left: 0,
          top: 0,
          willChange: "transform",
          // NO transform here - animation loop controls it exclusively to prevent ghost image on re-render
          boxShadow: isLaunching
            ? "0 0 60px rgba(255,255,255,0.8), 0 0 30px rgba(255,255,255,0.6)"
            : "0 0 40px rgba(255,255,255,0.4)",
          transition: "box-shadow 0.3s",
        }}
        onPointerDown={handlePointerDown}
      />
      {isDragging && (
        <Arrow
          startX={dragStartPos.x}
          startY={dragStartPos.y}
          endX={arrowEndX}
          endY={arrowEndY}
          isVisible={isDragging}
        />
      )}
    </>
  );
};

export default Ball;

