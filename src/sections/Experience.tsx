import { motion, useReducedMotion } from "framer-motion";
import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import journeyCharacterSrc from "../assets/journey-character.png";
import journeyCharacterSprintASrc from "../assets/journey-character-sprint-a.png";
import journeyCharacterSprintBSrc from "../assets/journey-character-sprint-b.png";
import { ExperienceCheckpoint } from "../components/ExperiencePath";
import { EXPERIENCE_PATH } from "../content/experience";
import { useWorldStore } from "../state/useWorldStore";
import {
  EXPERIENCE_SECTION_IDS,
  FADE_RADIUS,
  type BallCoordinates,
} from "../typesConstants";

interface ExperienceProps {
  ballPositionRef: React.RefObject<BallCoordinates>;
  ballX: number;
  centerX: number;
  viewportWidth: number;
}

const CHECKPOINT_Y_PERCENT = [44, 63, 35, 61, 43] as const;
const JOURNEY_BENDS = [17, -22, 20, -18] as const;
const CHECKPOINT_X_PERCENT = 15;
const BALL_RUN_START_SPEED_PX_PER_SECOND = 90;
const BALL_RUN_STOP_SPEED_PX_PER_SECOND = 45;
const BALL_FULL_SPRINT_SPEED_PX_PER_SECOND = 900;
const CHARACTER_CATCH_RADIUS_PX = 10;
const CHARACTER_ROUTE_SAMPLE_COUNT = 256;
const CHARACTER_START_X_PX = 32;
const CHARACTER_VIEWBOX_HEIGHT = 100;
const CHARACTER_FAST_RUN_CYCLE_MS = 220;
const CHARACTER_SLOW_RUN_CYCLE_MS = 420;

const getCheckpointY = (index: number): number =>
  CHECKPOINT_Y_PERCENT[index % CHECKPOINT_Y_PERCENT.length];

const buildJourneyPath = (checkpointCount: number): string => {
  if (checkpointCount === 0) {
    return "";
  }

  const points = Array.from(
    { length: checkpointCount },
    (_, index) => ({
      x: index * 100 + CHECKPOINT_X_PERCENT,
      y: getCheckpointY(index),
    }),
  );
  const firstPoint = points[0];
  let path = `M 0 66 C 5 66, 9 ${firstPoint.y}, ${firstPoint.x} ${firstPoint.y}`;

  for (let index = 0; index < points.length - 1; index += 1) {
    const currentPoint = points[index];
    const nextPoint = points[index + 1];
    const bend = JOURNEY_BENDS[index % JOURNEY_BENDS.length];

    path += ` C ${currentPoint.x + 30} ${currentPoint.y + bend}, ${nextPoint.x - 30} ${nextPoint.y + bend}, ${nextPoint.x} ${nextPoint.y}`;
  }

  const finalPoint = points.at(-1);

  if (finalPoint) {
    path += ` C ${finalPoint.x + 24} ${finalPoint.y}, ${checkpointCount * 100 - 8} 58, ${checkpointCount * 100} 58`;
  }

  return path;
};

const getCheckpointOpacity = (
  ballX: number,
  checkpointStartX: number,
  viewportWidth: number,
): number => {
  const checkpointEndX = checkpointStartX + viewportWidth;

  if (ballX < checkpointStartX) {
    return Math.max(
      0,
      1 - (checkpointStartX - ballX) / FADE_RADIUS,
    );
  }

  if (ballX > checkpointEndX) {
    return Math.max(
      0,
      1 - (ballX - checkpointEndX) / FADE_RADIUS,
    );
  }

  return 1;
};

interface ExperienceJourneyCharacterProps {
  ballPositionRef: React.RefObject<BallCoordinates>;
  centerX: number;
  isActive: boolean;
  journeyWidth: number;
  routePathRef: React.RefObject<SVGPathElement | null>;
  viewportWidth: number;
}

type CharacterDirection = "left" | "right";

interface RouteSample {
  x: number;
  y: number;
}

const sampleRoute = (path: SVGPathElement): readonly RouteSample[] => {
  const totalLength = path.getTotalLength();

  return Array.from(
    { length: CHARACTER_ROUTE_SAMPLE_COUNT + 1 },
    (_, index) => {
      const point = path.getPointAtLength(
        (index / CHARACTER_ROUTE_SAMPLE_COUNT) * totalLength,
      );
      return { x: point.x, y: point.y };
    },
  );
};

const getRouteY = (
  routeSamples: readonly RouteSample[],
  localX: number,
  journeyWidth: number,
  renderedHeight: number,
): number => {
  const targetViewBoxX =
    (localX / journeyWidth) * EXPERIENCE_PATH.length * 100;
  let lowerIndex = 0;
  let upperIndex = routeSamples.length - 1;

  while (upperIndex - lowerIndex > 1) {
    const middleIndex = Math.floor(
      (lowerIndex + upperIndex) / 2,
    );

    if (routeSamples[middleIndex].x < targetViewBoxX) {
      lowerIndex = middleIndex;
    } else {
      upperIndex = middleIndex;
    }
  }

  const lowerSample = routeSamples[lowerIndex];
  const upperSample = routeSamples[upperIndex];
  const sampleWidth = upperSample.x - lowerSample.x;
  const interpolation =
    sampleWidth === 0
      ? 0
      : (targetViewBoxX - lowerSample.x) / sampleWidth;
  const routeY =
    lowerSample.y +
    (upperSample.y - lowerSample.y) * interpolation;

  return (
    (routeY / CHARACTER_VIEWBOX_HEIGHT) * renderedHeight
  );
};

const getRunCycleDuration = (horizontalSpeed: number): number => {
  const speedRange =
    BALL_FULL_SPRINT_SPEED_PX_PER_SECOND -
    BALL_RUN_STOP_SPEED_PX_PER_SECOND;
  const normalizedSpeed = Math.min(
    Math.max(
      (horizontalSpeed - BALL_RUN_STOP_SPEED_PX_PER_SECOND) /
        speedRange,
      0,
    ),
    1,
  );

  return (
    CHARACTER_SLOW_RUN_CYCLE_MS -
    normalizedSpeed *
      (CHARACTER_SLOW_RUN_CYCLE_MS -
        CHARACTER_FAST_RUN_CYCLE_MS)
  );
};

/**
 * Chases the ball along the dotted route and matches its run cycle to the
 * ball's horizontal speed. Separate start and stop thresholds prevent the
 * character from flickering between running and idle near rest.
 */
const ExperienceJourneyCharacter: React.FC<
  ExperienceJourneyCharacterProps
> = ({
  ballPositionRef,
  centerX,
  isActive,
  journeyWidth,
  routePathRef,
  viewportWidth,
}) => {
  const runnerRef = useRef<HTMLDivElement>(null);
  const currentXRef = useRef(CHARACTER_START_X_PX);
  const runningRef = useRef(false);
  const directionRef = useRef<CharacterDirection>("right");
  const previousFrameTimeRef = useRef<number | null>(null);
  const previousBallXRef = useRef(ballPositionRef.current.x);
  const runCycleDurationRef = useRef(
    CHARACTER_FAST_RUN_CYCLE_MS,
  );
  const [isRunning, setIsRunning] = useState(false);
  const [direction, setDirection] =
    useState<CharacterDirection>("right");
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (!isActive) {
      previousFrameTimeRef.current = null;
      return;
    }

    let animationFrame = 0;
    const runSpeed = Math.max(960, viewportWidth * 1.25);
    const routePath = routePathRef.current;
    const routeSamples = routePath ? sampleRoute(routePath) : [];
    previousBallXRef.current = ballPositionRef.current.x;

    const updateMotionState = (
      nextRunning: boolean,
      nextDirection: CharacterDirection,
    ) => {
      if (runningRef.current !== nextRunning) {
        runningRef.current = nextRunning;
        setIsRunning(nextRunning);
      }

      if (directionRef.current !== nextDirection) {
        directionRef.current = nextDirection;
        setDirection(nextDirection);
      }
    };

    const updateCharacter = (now: number) => {
      const previousFrameTime = previousFrameTimeRef.current ?? now;
      const deltaTime = Math.min(
        (now - previousFrameTime) / 1000,
        0.05,
      );
      previousFrameTimeRef.current = now;

      const ballPosition = ballPositionRef.current;
      const ballDeltaX =
        ballPosition.x - previousBallXRef.current;
      const horizontalBallSpeed =
        deltaTime > 0
          ? Math.abs(ballDeltaX) / deltaTime
          : 0;
      const isBallMoving =
        horizontalBallSpeed >
        (runningRef.current
          ? BALL_RUN_STOP_SPEED_PX_PER_SECOND
          : BALL_RUN_START_SPEED_PX_PER_SECOND);
      previousBallXRef.current = ballPosition.x;

      const targetX = Math.min(
        Math.max(
          ballPosition.x + viewportWidth / 2 - centerX,
          CHARACTER_START_X_PX,
        ),
        journeyWidth - CHARACTER_START_X_PX,
      );
      const deltaX = targetX - currentXRef.current;
      const chaseDirection: CharacterDirection =
        deltaX < 0 ? "left" : "right";
      const isOutsideCatchRadius =
        Math.abs(deltaX) > CHARACTER_CATCH_RADIUS_PX;
      const movementDirection: CharacterDirection =
        Math.abs(ballDeltaX) > 0.01
          ? ballDeltaX < 0
            ? "left"
            : "right"
          : directionRef.current;

      if (shouldReduceMotion) {
        currentXRef.current = targetX;
        updateMotionState(false, chaseDirection);
      } else if (isOutsideCatchRadius) {
        const step = Math.min(
          Math.abs(deltaX),
          runSpeed * deltaTime,
        );
        currentXRef.current += Math.sign(deltaX) * step;
        updateMotionState(true, chaseDirection);
      } else {
        currentXRef.current = targetX;
        updateMotionState(isBallMoving, movementDirection);
      }

      const runner = runnerRef.current;
      const animationSpeed = isOutsideCatchRadius
        ? runSpeed
        : horizontalBallSpeed;
      const nextRunCycleDuration = Math.round(
        getRunCycleDuration(animationSpeed) / 20,
      ) * 20;

      if (
        runner &&
        runCycleDurationRef.current !== nextRunCycleDuration
      ) {
        runCycleDurationRef.current = nextRunCycleDuration;
        runner.style.setProperty(
          "--experience-run-cycle-duration",
          `${nextRunCycleDuration}ms`,
        );
      }

      const journeyHeight =
        runner?.parentElement?.clientHeight ?? window.innerHeight;
      const routeY = routeSamples.length > 1
        ? getRouteY(
            routeSamples,
            currentXRef.current,
            journeyWidth,
            journeyHeight,
          )
        : journeyHeight * 0.66;

      if (runner) {
        runner.style.transform = `translate3d(${currentXRef.current}px, ${routeY}px, 0)`;
      }

      animationFrame = window.requestAnimationFrame(updateCharacter);
    };

    animationFrame = window.requestAnimationFrame(updateCharacter);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      previousFrameTimeRef.current = null;
    };
  }, [
    ballPositionRef,
    centerX,
    isActive,
    journeyWidth,
    routePathRef,
    shouldReduceMotion,
    viewportWidth,
  ]);

  return (
    <div
      ref={runnerRef}
      className="experience-journey-character-runner"
      data-active={isActive}
      data-direction={direction}
      data-running={isActive && isRunning}
      aria-hidden="true"
    >
      <span className="experience-journey-character-cycle">
        <img
          className="experience-journey-character experience-journey-character-idle"
          src={journeyCharacterSrc}
          alt=""
          draggable={false}
        />
        <img
          className="experience-journey-character experience-journey-character-sprint experience-journey-character-sprint-a"
          src={journeyCharacterSprintASrc}
          alt=""
          draggable={false}
        />
        <img
          className="experience-journey-character experience-journey-character-sprint experience-journey-character-sprint-b"
          src={journeyCharacterSprintBSrc}
          alt=""
          draggable={false}
        />
      </span>
    </div>
  );
};

/**
 * Spans five viewport-wide experience checkpoints across the desktop world.
 */
const Experience: React.FC<ExperienceProps> = ({
  ballPositionRef,
  ballX,
  centerX,
  viewportWidth,
}) => {
  const jumpTo = useWorldStore((state) => state.jumpTo);
  const expansionFrameRef = useRef<number>(0);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(
    null,
  );
  const journeyPath = useMemo(
    () => buildJourneyPath(EXPERIENCE_PATH.length),
    [],
  );
  const routePathRef = useRef<SVGPathElement>(null);
  const journeyWidth = EXPERIENCE_PATH.length * viewportWidth;
  const journeyStartX = centerX - viewportWidth / 2;
  const journeyEndX =
    centerX + journeyWidth - viewportWidth / 2;
  const isJourneyActive =
    ballX >= journeyStartX && ballX <= journeyEndX;
  const firstCheckpointOpacity = getCheckpointOpacity(
    ballX,
    centerX,
    viewportWidth,
  );

  useEffect(
    () => () =>
      window.cancelAnimationFrame(expansionFrameRef.current),
    [],
  );

  const openCheckpoint = (index: number) => {
    window.cancelAnimationFrame(expansionFrameRef.current);
    setExpandedIndex(null);
    jumpTo(EXPERIENCE_SECTION_IDS[index]);

    expansionFrameRef.current = window.requestAnimationFrame(() => {
      setExpandedIndex(index);
    });
  };

  return (
    <section
      className="experience-journey"
      data-checkpoint-open={expandedIndex !== null}
      style={{
        left: `${centerX}px`,
        width: `${journeyWidth}px`,
      }}
      aria-label="Experience journey"
    >
      <motion.header
        className="experience-journey-header"
        animate={{
          opacity:
            expandedIndex === null ? firstCheckpointOpacity : 0,
        }}
        transition={{ duration: 0.2 }}
      >
        <h2>EXPERIENCE</h2>
        <p>There was no straight line. That was the point.</p>
      </motion.header>

      <ExperienceJourneyCharacter
        ballPositionRef={ballPositionRef}
        centerX={centerX}
        isActive={isJourneyActive}
        journeyWidth={journeyWidth}
        routePathRef={routePathRef}
        viewportWidth={viewportWidth}
      />

      <svg
        className="experience-journey-route"
        viewBox={`0 0 ${EXPERIENCE_PATH.length * 100} 100`}
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path ref={routePathRef} d={journeyPath} />
      </svg>

      <ol className="experience-journey-checkpoints">
        {EXPERIENCE_PATH.map((item, index) => {
          const checkpointStartX =
            centerX + index * viewportWidth;
          const opacity = getCheckpointOpacity(
            ballX,
            checkpointStartX,
            viewportWidth,
          );

          return (
            <motion.li
              key={`${item.organization}-${item.role}`}
              className="experience-journey-checkpoint"
              style={{
                left: `${index * viewportWidth}px`,
                width: `${viewportWidth}px`,
                "--experience-checkpoint-y": `${getCheckpointY(index)}%`,
              } as React.CSSProperties}
              animate={{
                opacity,
                scale: 0.96 + opacity * 0.04,
              }}
              transition={{
                damping: 20,
                mass: 0.5,
                stiffness: 100,
                type: "spring",
              }}
            >
              <ExperienceCheckpoint
                expanded={expandedIndex === index}
                index={index}
                item={item}
                onSelect={() => openCheckpoint(index)}
                onToggle={() => {
                  setExpandedIndex((currentIndex) =>
                    currentIndex === index ? null : index,
                  );
                }}
                total={EXPERIENCE_PATH.length}
              />
            </motion.li>
          );
        })}
      </ol>
    </section>
  );
};

export default Experience;
