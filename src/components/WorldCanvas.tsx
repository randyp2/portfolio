import { motion } from "framer-motion";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { SimplePhysics, type PhysicsBody, type ColliderRect } from "../physics/SimplePhysics";
import { useWorldStore } from "../state/useWorldStore";
import { BALL_RADIUS, SECTION_X, CAMERA_LERP, type COLLIDERES_RECT } from "../typesConstants";
import Ball from "./Ball";
import GlassCard from "./GlassCard";
import StarField from "./StarField";

const WorldCanvas: React.FC = () => {
    const physicsRef = useRef<SimplePhysics | null>(null);
    const animationFrameRef = useRef<number>(0);
    const lastTimeRef = useRef<number>(Date.now());
    const [isLaunching, setIsLaunching] = useState(false);
    const launchTimeoutRef = useRef<number>(0);
    
    const { ballX, ballY, cameraX, isJumping, setBallPosition, setCameraX, sections } = useWorldStore(); // Pull the zustand store
    const [viewportWidth, setViewportWidth] = useState(window.innerWidth);
    const [viewportHeight, setViewportHeight] = useState(window.innerHeight);
    const viewportCenterX = viewportWidth / 2;
    const [, forceUpdate] = useState({}); // Call force update to re-render compnent and sub components
    const [colliders, setColliders] = useState<COLLIDERES_RECT []>([]); // Store bounds of glass cards for collision detection


    // Initialize physics and run animation
    useEffect(() => {

        // Initialize colliders 

        // Initalize physics
        //  - ball position
        //  - world size
        physicsRef.current = new SimplePhysics(
            0,
            viewportHeight - 100,
            BALL_RADIUS,
            SECTION_X.thanks + 400,
            viewportHeight - 100,
            viewportCenterX,
        );
        
        // Camera initial position x
        let currentCameraX = -viewportCenterX;
  
        // Physics/animation loop
        const update = () => {
            const now: number = Date.now();

            // Determine how many "frames" have passed since last time (capped to avoid large jumps)
            const dt: number = Math.min((now - lastTimeRef.current) / 16.67, 2); 
            lastTimeRef.current = now; // Reset last time
            
            if (physicsRef.current) {
                physicsRef.current.update(dt); // Update physics of ball
                
                const pos: PhysicsBody = physicsRef.current.body; // Get new position of ball
                setBallPosition(pos.x, pos.y); // Store it in zustand store
                
                // Smooth camera follow with clamping
                const targetCameraX: number = pos.x;
                // Add to camerax or decrement to camera x to reach ball final position
                currentCameraX += (targetCameraX - currentCameraX) * CAMERA_LERP; 
                const clampedCameraX: number = Math.max(0, Math.min(currentCameraX, SECTION_X.thanks));
                setCameraX(clampedCameraX);
                

                // Update and reload this component and sub components
                forceUpdate({});
            }
            
            animationFrameRef.current = requestAnimationFrame(update);
        };
  
        update();
        

        // Cleanup on unmount
        // Cancel animation frame
        return () => {
            if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
            }
        };

    }, [viewportHeight, setCameraX]);


    // Connect physics engine to zustand store
    useEffect(() => {
        if(isJumping && physicsRef.current) {
            physicsRef.current.setPosition(ballX, ballY);
        }
    }, [ballX, ballY, isJumping]);


  
    // Handle resize, run everytime when compnent renders
    useEffect(() => {
      const handleResize = () => {
        
        setViewportWidth(window.innerWidth);
        setViewportHeight(window.innerHeight);
        if (physicsRef.current) {
          physicsRef.current.worldHeight = window.innerHeight;
        }
      };
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);
  
    /* Add rectangles of possible colliders */
    const handleCardBounds = useCallback((bounds: COLLIDERES_RECT) => {
        setColliders((prev: COLLIDERES_RECT[]) => {

            // Replace existing entry for this card
            const filtered = prev.filter((b) => b.title !== bounds.title);
            return [...filtered, bounds];

        });
    }, []);
    
    // Add colliders to physics engine
    useEffect(() => {
        if (physicsRef.current) {
            const simplifiedColliders: ColliderRect[] = colliders.map(({x1: leftX, x2: rightX, y1: topY, y2: bottomY}) => ({
                leftX, rightX, topY, bottomY,
            }));

            physicsRef.current.setColliders(simplifiedColliders);
        }
      }, [colliders]);


    const handleLaunch = useCallback((vx: number, vy: number) => {
      if (physicsRef.current) {
        physicsRef.current.setVelocity(vx, vy);
        
        // Trigger launch animation styling
        // Slight glow/flare when launching
        setIsLaunching(true);
        
        // Clear any existing timeout
        if (launchTimeoutRef.current) {
          clearTimeout(launchTimeoutRef.current);
        }
        
        // Reset launch state after animation
        launchTimeoutRef.current = window.setTimeout(() => {
          setIsLaunching(false);
        }, 400);
      }
    }, []);
    
    if (!physicsRef.current) return null;
  
    return (
        <div className="fixed inset-0 overflow-hidden">

           
  
            {/* World container with camera transform */}
            <motion.div
            className="absolute inset-0 border-2 border-solid border-amber-600"
            style={{
                // Shift world to left and center it based on cameraX
                transform: `translateX(${0 - cameraX}px)`, 
            }}
            >

                {/* Starfield background */}
                <StarField viewportHeight={viewportHeight} />



                {/* Cards */}
                <GlassCard title="About" centerX={sections.about.x} ballX={ballX} cameraX={cameraX} viewportCenterX={viewportCenterX} onBoundsChange={handleCardBounds}>
                    <p>Hi! I'm a CS/SWE student passionate about building sustainable websites, and a niche interest in physics.</p>
                    <p className="mt-3">I specialize in React, TypeScript, Tailwind CSS, and modern web technologies. I also work with Spring Boot, C++, and enjoy exploring creative coding.</p>
                </GlassCard>
    
                <GlassCard title="Projects" centerX={sections.projects.x} ballX={ballX} cameraX={cameraX} viewportCenterX={viewportCenterX} onBoundsChange={handleCardBounds}>
                    <ul className="space-y-3">
                    <li><span className="font-semibold">Java Solitaire Game</span> - Built with Java, Java Swing.</li>
                    <li><span className="font-semibold">CRJ Website Services</span> - Built with React, Tailwind, Typescript, Springboot</li>
                    <li><span className="font-semibold">DSA Visualizer</span> - C# Winform</li>
                    </ul>
                </GlassCard>
        
                <GlassCard title="Skills" centerX={sections.skills.x} ballX={ballX} cameraX={cameraX} viewportCenterX={viewportCenterX} onBoundsChange={handleCardBounds}>
                    <div className="space-y-4">
                    <div>
                        <h3 className="font-semibold text-white mb-2">Languages</h3>
                        <p>C++, C, C#, JavaScript/TypeScript, Java, Python, SQL</p>
                    </div>
                    <div>
                        <h3 className="font-semibold text-white mb-2">Frameworks & Libraries</h3>
                        <p>React, Next.js, Spring Boot, Tailwind CSS, Framer Motion</p>
                    </div>
                    <div>
                        <h3 className="font-semibold text-white mb-2">Tools & Platforms</h3>
                        <p>Docker, Git, AWS, PostgreSQL, Vite</p>
                    </div>
                    </div>
                </GlassCard>
        
                <GlassCard title="Contact" centerX={sections.contact.x} ballX={ballX} cameraX={cameraX} viewportCenterX={viewportCenterX} onBoundsChange={handleCardBounds}>
                    <p className="text-xl mb-4">XXX</p>
                    <p>XXX</p>
                    <p className="mt-6 font-semibold text-white">XXX</p>
                </GlassCard>
        
                <GlassCard title="Thank You" centerX={sections.thanks.x} ballX={ballX} cameraX={cameraX} viewportCenterX={viewportCenterX} onBoundsChange={handleCardBounds}>
                    <p className="text-4xl font-bold text-center">Thank You.</p>
                    <p className="text-center mt-4 text-gray-400">Thanks for exploring my portfolio!</p>
                </GlassCard>
                </motion.div>
        
                {/* Ball */}
                <Ball 
                physics={physicsRef.current} 
                viewportCenterX={viewportCenterX} 
                cameraX={cameraX}
                onLaunch={handleLaunch}
                isLaunching={isLaunching}
                />
        </div>
    );
};

export default WorldCanvas;