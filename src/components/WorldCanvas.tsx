import { motion } from "framer-motion";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { SimplePhysics, type ColliderRect, type PhysicsEntity } from "../physics/SimplePhysics";
import { useWorldStore } from "../state/useWorldStore";
import { BALL_RADIUS, CAMERA_LERP, type COLLIDERES_RECT, SECTION_SPACING_MULTIPLIER, type SectionId, SECTION_ORDER } from "../typesConstants";
import Ball from "./Ball";
import StarField from "./StarField";
import Intro from "../sections/Intro";
import About from "../sections/About";
import Projects from "../sections/Projects";
import MassBlock from "./MassBlock";

const WorldCanvas: React.FC = () => {
    /* ====== PHYSICS AND LAUNCHING LOGIC VARIABLES ====== */
    // use useRef to persist between renders (retain values between renders and dont re-render when changed)
    const physicsRef = useRef<SimplePhysics | null>(null);
    const animationFrameRef = useRef<number>(0);
    const lastTimeRef = useRef<number>(Date.now());
    const [isLaunching, setIsLaunching] = useState(false);
    const launchTimeoutRef = useRef<number>(0);
    
    /* ====== BALL POSITIONING AND CAMERA POSITION LOGIC VARIABLES ====== */
    const { ballX, ballY, cameraX, isJumping, setBallPosition, setCameraX, setSections, sections } = useWorldStore(); // Pull the zustand store
    const [viewportWidth, setViewportWidth] = useState(window.innerWidth);
    const [viewportHeight, setViewportHeight] = useState(window.innerHeight);
    const viewportCenterX = viewportWidth / 2;
    const [colliders, setColliders] = useState<COLLIDERES_RECT []>([]); // Store bounds of glass cards for collision detection

    const [, forceUpdate] = useState({}); // Call force update to re-render compnent and sub components

    
    /**
     * @brief Set up dynamic sections based on viewport width
     * @dependencies viewportWidth - recalculate on resize
     */
    const SECTION_SPACING: number = viewportWidth * SECTION_SPACING_MULTIPLIER; // Section spacing
    const dynamicSections = useMemo(() => {
        let x: number = 0;
        const map: Record<SectionId, { x: number }> = {} as any; // Map section ids to x positions
        for (const id of SECTION_ORDER) {
            map[id] = { x };
            x += SECTION_SPACING; // Move over by screen-dependent spacing
        }

        return map;

    }, [viewportWidth]);

    

    /**
     * @brief Initialize physics engine and run animation loop
     * @dependencies 
     *  - viewportHeight 
     *  - setCameraX 
     *  - dynamicSections
     */
    useEffect(() => {

        
        // Bound world width by last section position or viewport width
        const worldWidth: number = Object.values(dynamicSections).at(-1)?.x ?? viewportWidth;

        // Initialize physics engine
        physicsRef.current = new SimplePhysics(
            0, // start ballX
            viewportHeight - 80, // start ballY
            BALL_RADIUS, // ball radius
            worldWidth + 400, // ending world position
            viewportHeight - 80, // world height
            viewportCenterX, // center of viewpointX
        );
        
        // Camera initial position x
        let currentCameraX: number = viewportCenterX;
        

        // Physics/animation loop
        const update = (): void => {
            const now: number = Date.now();

            // Determine how many "frames" have passed since last time (capped to avoid large jumps)
            const dt: number = Math.min((now - lastTimeRef.current) / 16.67, 2); 
            lastTimeRef.current = now; // Reset last time
            
            if (physicsRef.current) {
                physicsRef.current.update(dt); // Update position/physics of ball
                
                const pos: PhysicsEntity = physicsRef.current.body; // Get new position of ball
                setBallPosition(pos.x, pos.y); // Store it in zustand store
                
                // target camera x is x position of the ball
                const targetCameraX: number = pos.x;

                // Add to camerax or decrement to camera x to reach ball final position
                currentCameraX += (targetCameraX - currentCameraX) * CAMERA_LERP; 
                const clampedCameraX: number = Math.max(0, Math.min(currentCameraX, dynamicSections.thanks.x)); // Maybe change?
                setCameraX(clampedCameraX);
                
                // Update and reload this component and child components
                forceUpdate({});
            }
            
            animationFrameRef.current = requestAnimationFrame(update);
        };
  
        update();
        

        // Cleanup on unmount & cancel animation frame
        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };

    }, [viewportHeight, setCameraX, dynamicSections]);

    /**
     * @brief Update sections in zustand store when dynamicSections change
     * @dependencies dynamicSections, setSections
     */
    useEffect(() => {
        setSections(dynamicSections);
      }, [dynamicSections, setSections]);



    /**
     * @brief If isJumping is true, set position of ball in physics engine to match zustand store
     * @dependencies ballX, ballY, isJumping
     */
    useEffect(() => {
        if(isJumping && physicsRef.current) {
            physicsRef.current.setPosition(ballX, ballY);
        }
    }, [ballX, ballY, isJumping]);


    /**
     * @brief Update viewport dimensions and physics world height on window resize
     * @dependencies none
     */
    useEffect(() => {
      const handleResize = () => {
        
        setViewportWidth(window.innerWidth);
        setViewportHeight(window.innerHeight);
        if (physicsRef.current) {
          physicsRef.current.worldHeight = window.innerHeight;
        }
      };
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize); // Cleanup
    }, []);
  
    /* Add rectangles of possible colliders */
    /**
     * @brief Handle bounds reported by GlassCard components
     * @dependencies none
     */
    const handleCardBounds = useCallback((bounds: COLLIDERES_RECT) => {
        setColliders((prev: COLLIDERES_RECT[]) => {
            // Replace existing entry for this card
            const filtered = prev.filter((b) => b.title !== bounds.title);
            return [...filtered, bounds];
        });
    }, []);
    

    /**
     * @brief Update colliders in physics engine when colliders state changes
     * @dependencies colliders
     */
    useEffect(() => {
        // Update colliders in physics engine to handle collisions
        if (physicsRef.current) {
            const simplifiedColliders: ColliderRect[] = colliders.map(({x1: leftX, x2: rightX, y1: topY, y2: bottomY}) => ({
                leftX, rightX, topY, bottomY,
            }));

            physicsRef.current.setColliders(simplifiedColliders);
        }
      }, [colliders]);


    /**
     * @brief Handle launch event from Ball component
     * @dependencies none
     */
    const handleLaunch = useCallback((vx: number, vy: number) => {
      if (physicsRef.current) {
        // Set velocities computed by Ball component
        physicsRef.current.setVelocity(vx, vy);

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


    /**
     * @brief Spawn in mass blocks
     * @dependencies none
     */
    const handleSpawnMasses = useCallback(() => {
        const physics = physicsRef.current;
        if (!physics) return;
      
        // Only spawn once
        if (physics.blocks.length > 0) return;
        
        // Add blocks 
        physics.addBlock("block-5N-1", dynamicSections.projects.x + 200, -200, 60, 60, 5, "5kg");
        physics.addBlock("block-5N-2", dynamicSections.projects.x + 300, -250, 60, 60, 5, "5kg");
        physics.addBlock("block-10N", dynamicSections.projects.x + 450, -300, 60, 60, 5, "5kg");
        physics.addBlock("block-20N", dynamicSections.projects.x + 600, -350, 60, 60, 5, "5kg");
    }, [dynamicSections.projects.x]);
    
    if (!physicsRef.current) return null; // Edge case - wait for physics to initialize
  
    return (
        <div className="fixed inset-0 overflow-hidden">

            {/* World container with camera transform */}
            <motion.div
            className="absolute inset-0 border-2 border-solid border-red-800"
            style={{
                // Shift world to left and center it based on cameraX
                transform: `translateX(${-cameraX}px)`, 
            }}
            >

                {/* Starfield background */}
                <StarField worldWidth={physicsRef.current?.worldWidth} viewportHeight={viewportHeight} />

                <Intro />

                <About
                    centerX={dynamicSections.about.x}
                    ballX={ballX}
                    cameraX={cameraX}
                    viewportCenterX={viewportCenterX}
                    onBoundsChange={handleCardBounds}
                />

                <Projects
                    centerX={dynamicSections.projects.x}
                    ballX={ballX}
                    cameraX={cameraX}
                    viewportCenterX={viewportCenterX}
                    onBoundsChange={handleCardBounds}
                    onSpawnMasses={handleSpawnMasses}
                />
                


            </motion.div>
                
            {/* Block masses */}
            {physicsRef.current?.blocks.map((block) => (
                <MassBlock
                    key={block.id}
                    physics={physicsRef.current!}
                    entity={block}
                    viewportCenterX={viewportCenterX}
                    cameraX={cameraX}
                />
            ))}
            
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