import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  SimplePhysics,
  type ColliderRect,
  type PhysicsEntity,
} from "../physics/SimplePhysics";
import { useWorldStore } from "../state/useWorldStore";
import {
  BALL_RADIUS,
  CAMERA_LERP,
  type COLLIDERES_RECT,
  SECTION_SPACING_MULTIPLIER,
  SKILL_SECTION_SPACING_MULTIPLIER,
  type SectionId,
  SECTION_ORDER,
} from "../typesConstants";
import Ball from "./Ball";
import StarField from "./StarField";
import Intro from "../sections/Intro";
import About from "../sections/About";
import Projects from "../sections/Projects";

import MassBlock from "./MassBlock";
import SkillColumn from "@/sections/SkillColumn";

const WorldCanvas: React.FC = () => {
  /* ====== PHYSICS AND LAUNCHING LOGIC VARIABLES ====== */
  // use useRef to persist between renders (retain values between renders and dont re-render when changed)
  const physicsRef = useRef<SimplePhysics | null>(null);
  const animationFrameRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(Date.now());
  const [isLaunching, setIsLaunching] = useState(false);
  const launchTimeoutRef = useRef<number>(0);

  // Ref for direct DOM manipulation of camera and ball (avoids re-renders)
  const worldContainerRef = useRef<HTMLDivElement>(null);
  const ballRef = useRef<HTMLDivElement>(null);
  const cameraXRef = useRef<number>(0);
  const lastStoreUpdateRef = useRef<number>(0);

  // Ref map for block DOM elements (for direct DOM manipulation)
  const blockRefsMap = useRef<Map<string, HTMLDivElement>>(new Map());

  // Force update state to trigger re-render when blocks spawn
  const [, forceUpdate] = useState({});

  /* ====== BALL POSITIONING AND CAMERA POSITION LOGIC VARIABLES ====== */
  const {
    ballX,
    ballY,
    cameraX,
    isJumping,
    setBallPosition,
    setCameraX,
    setSections,
  } = useWorldStore(); // Pull the zustand store
  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);
  const viewportCenterX = viewportWidth / 2;
  const [colliders, setColliders] = useState<COLLIDERES_RECT[]>([]); // Store bounds of glass cards for collision detection

  /**
   * @brief Set up dynamic sections based on viewport width
   * @dependencies viewportWidth - recalculate on resize
   */
  const SECTION_SPACING: number = viewportWidth * SECTION_SPACING_MULTIPLIER; // Section spacing
  const SKILL_SECTION_SPACING: number =
    viewportWidth * SKILL_SECTION_SPACING_MULTIPLIER; // Smaller spacing for skill sections
  const dynamicSections = useMemo(() => {
    let x: number = 0;
    const map: Record<SectionId, { x: number }> = {} as any; // Map section ids to x positions
    for (const id of SECTION_ORDER) {
      map[id] = { x };

      // Use smaller spacing for skill sections (languages, tools) so they're closer together
      if (id === "languages" || id === "tools") {
        x += SKILL_SECTION_SPACING;
      } else {
        x += SECTION_SPACING;
      }
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
    const worldWidth: number =
      Object.values(dynamicSections).at(-1)?.x ?? viewportWidth;

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

    // Set initial ball position immediately (before first animation frame)
    // This prevents the ball from briefly appearing at (0,0)
    if (ballRef.current) {
      const initialBallScreenX = 0 + viewportCenterX - currentCameraX;
      ballRef.current.style.transform = `translate(${initialBallScreenX - BALL_RADIUS}px, ${viewportHeight - 80 - BALL_RADIUS}px)`;
    }

    // Physics/animation loop
    const update = (): void => {
      const now: number = Date.now();

      // Determine how many "frames" have passed since last time (capped to avoid large jumps)
      const dt: number = Math.min((now - lastTimeRef.current) / 16.67, 2);
      lastTimeRef.current = now; // Reset last time

      if (physicsRef.current) {
        physicsRef.current.update(dt); // Update position/physics of ball

        const pos: PhysicsEntity = physicsRef.current.body; // Get new position of ball

        // target camera x is x position of the ball
        const targetCameraX: number = pos.x;

        // Add to camerax or decrement to camera x to reach ball final position
        currentCameraX += (targetCameraX - currentCameraX) * CAMERA_LERP;
        const clampedCameraX: number = Math.max(
          0,
          Math.min(currentCameraX, dynamicSections.thanks.x),
        );

        // Store in ref for direct DOM manipulation
        cameraXRef.current = clampedCameraX;

        // Direct DOM manipulation - bypasses React re-renders for smooth animation
        if (worldContainerRef.current) {
          worldContainerRef.current.style.transform = `translateX(${-clampedCameraX}px)`;
        }

        // Update ball position directly via DOM using transform (GPU-accelerated)
        if (ballRef.current) {
          const ballScreenX = pos.x + viewportCenterX - clampedCameraX;
          ballRef.current.style.transform = `translate(${ballScreenX - BALL_RADIUS}px, ${pos.y - BALL_RADIUS}px)`;
        }

        // Update block positions directly via DOM (60fps smooth animation)
        physicsRef.current.blocks.forEach((block) => {
          const blockEl = blockRefsMap.current.get(block.id);
          if (blockEl) {
            const screenX =
              block.x + viewportCenterX - clampedCameraX - block.width! / 2;
            const screenY = block.y - block.height! / 2;
            blockEl.style.transform = `translate(${screenX}px, ${screenY}px)`;
          }
        });

        // Update Zustand store less frequently (every 50ms) for components that need it
        if (now - lastStoreUpdateRef.current > 50) {
          lastStoreUpdateRef.current = now;
          setBallPosition(pos.x, pos.y);
          setCameraX(clampedCameraX);
        }
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
    if (isJumping && physicsRef.current) {
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
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize); // Cleanup
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
      const simplifiedColliders: ColliderRect[] = colliders.map(
        ({ x1: leftX, x2: rightX, y1: topY, y2: bottomY }) => ({
          leftX,
          rightX,
          topY,
          bottomY,
        }),
      );

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

  // Skill categories for each SkillColumn
  const languageSkills = [
    "java",
    "typescript",
    "cpp",
    "c",
    "csharp",
    "python",
    "sql",
    "swift",
  ];

  const toolSkills = ["git", "docker", "aws", "supabase", "postman"];

  const frameworkSkills = [
    "springboot",
    "react",
    "nextjs",
    "nodejs",
    "django",
    "postgresql",
  ];

  // Callback to force re-render when blocks spawn
  const handleSpawn = useCallback(() => {
    forceUpdate({});
  }, []);

  if (!physicsRef.current) return null; // Edge case - wait for physics to initialize

  return (
    <div className="fixed inset-0 overflow-hidden">
      {/* World container with camera transform - using direct DOM manipulation for smooth animation */}
      <div
        ref={worldContainerRef}
        className="absolute inset-0"
        style={{ willChange: "transform" }}
      >
        {/* Starfield background */}
        <StarField
          worldWidth={physicsRef.current?.worldWidth}
          viewportHeight={viewportHeight}
        />

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
          ballY={ballY}
          cameraX={cameraX}
          viewportCenterX={viewportCenterX}
          onBoundsChange={handleCardBounds}
        />

        <SkillColumn
          centerX={dynamicSections.languages.x}
          ballX={ballX}
          title="LANGUAGES"
          skills={languageSkills}
          physics={physicsRef.current}
          onSpawn={handleSpawn}
        />

        <SkillColumn
          centerX={dynamicSections.tools.x}
          ballX={ballX}
          title="DEVELOPER TOOLS"
          skills={toolSkills}
          physics={physicsRef.current}
          onSpawn={handleSpawn}
        />

        <SkillColumn
          centerX={dynamicSections.frameworks.x}
          ballX={ballX}
          title="FRAMEWORKS"
          skills={frameworkSkills}
          physics={physicsRef.current}
          onSpawn={handleSpawn}
          showArrow={false}
        />
      </div>

      {/* Block masses - using direct DOM manipulation for smooth 60fps animation */}
      {physicsRef.current?.blocks.map((block) => (
        <MassBlock
          key={block.id}
          entity={block}
          blockRef={(el) => {
            if (el) {
              blockRefsMap.current.set(block.id, el);
            } else {
              blockRefsMap.current.delete(block.id);
            }
          }}
        />
      ))}

      {/* Ball */}
      <Ball
        physics={physicsRef.current}
        viewportCenterX={viewportCenterX}
        cameraX={cameraX}
        onLaunch={handleLaunch}
        isLaunching={isLaunching}
        ballRef={ballRef}
      />
    </div>
  );
};

export default WorldCanvas;
