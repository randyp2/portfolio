import { useEffect, useRef, type RefObject } from "react";
import { UNLV_ASCII_LINES } from "../content/educationAsciiArt";
import { BALL_RADIUS, type BallCoordinates } from "../typesConstants";

const REACTION_PADDING_PX = 14;
const POSITION_QUANTIZATION_PX = 2;
const FRAME_INTERVAL_MS = 1000 / 30;
const ART_WIDTH_CHARACTERS = Math.max(
  ...UNLV_ASCII_LINES.map((line) => line.length),
);

interface DynamicEducationAsciiArtProps {
  ballPositionRef: RefObject<BallCoordinates>;
  sectionCenterX: number;
  sectionRef: RefObject<HTMLElement | null>;
  viewportCenterX: number;
}

const quantizePosition = (position: number): number =>
  Math.round(position / POSITION_QUANTIZATION_PX) *
  POSITION_QUANTIZATION_PX;

const carveLineAroundBall = (
  line: string,
  ballX: number,
  characterWidth: number,
  horizontalRadius: number,
): string => {
  const startIndex = Math.max(
    0,
    Math.floor((ballX - horizontalRadius) / characterWidth),
  );
  const endIndex = Math.min(
    line.length,
    Math.ceil((ballX + horizontalRadius) / characterWidth),
  );

  if (startIndex >= endIndex) return line;

  return `${line.slice(0, startIndex)}${" ".repeat(
    endIndex - startIndex,
  )}${line.slice(endIndex)}`;
};

/**
 * Carves a temporary circular pocket through the UNLV ASCII art around the ball.
 */
const DynamicEducationAsciiArt: React.FC<
  DynamicEducationAsciiArtProps
> = ({
  ballPositionRef,
  sectionCenterX,
  sectionRef,
  viewportCenterX,
}) => {
  const artRef = useRef<HTMLPreElement>(null);
  const lineRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const art = artRef.current;
    const section = sectionRef.current;
    if (!art || !section) return;

    let animationFrameId = 0;
    let lastRenderTime = 0;
    let lastObstacleKey = "";
    let artOffsetX = 0;
    let artTop = 0;
    let characterWidth = 1;
    let lineHeight = 1;

    const restoreArtwork = () => {
      lineRefs.current.forEach((lineElement, index) => {
        if (lineElement) {
          lineElement.textContent = UNLV_ASCII_LINES[index];
        }
      });
    };

    const updateMetrics = () => {
      const sectionRect = section.getBoundingClientRect();
      const artRect = art.getBoundingClientRect();
      const styles = window.getComputedStyle(art);
      const measuredLineHeight = Number.parseFloat(styles.lineHeight);

      artOffsetX = artRect.left - sectionRect.left;
      artTop = artRect.top;
      characterWidth =
        ART_WIDTH_CHARACTERS > 0
          ? artRect.width / ART_WIDTH_CHARACTERS
          : 1;
      lineHeight = Number.isFinite(measuredLineHeight)
        ? measuredLineHeight
        : 1;
      lastObstacleKey = "";
    };

    const renderFrame = (timestamp: number) => {
      if (timestamp - lastRenderTime >= FRAME_INTERVAL_MS) {
        lastRenderTime = timestamp;

        const ballPosition = ballPositionRef.current;
        const ballX = quantizePosition(
          ballPosition.x +
            viewportCenterX -
            sectionCenterX -
            artOffsetX,
        );
        const ballY = quantizePosition(ballPosition.y - artTop);
        const reactionRadius = BALL_RADIUS + REACTION_PADDING_PX;
        const obstacleKey = `${ballX}:${ballY}`;

        if (obstacleKey !== lastObstacleKey) {
          const intersectsArtwork =
            ballX >= -reactionRadius &&
            ballX <= art.clientWidth + reactionRadius &&
            ballY >= -reactionRadius &&
            ballY <= art.clientHeight + reactionRadius;

          if (!intersectsArtwork) {
            if (lastObstacleKey !== "none") restoreArtwork();
            lastObstacleKey = "none";
          } else {
            lineRefs.current.forEach((lineElement, index) => {
              if (!lineElement) return;

              const lineCenterY = index * lineHeight + lineHeight / 2;
              const verticalDistance = Math.abs(
                ballY - lineCenterY,
              );

              if (verticalDistance >= reactionRadius) {
                lineElement.textContent = UNLV_ASCII_LINES[index];
                return;
              }

              const horizontalRadius = Math.sqrt(
                reactionRadius * reactionRadius -
                  verticalDistance * verticalDistance,
              );
              lineElement.textContent = carveLineAroundBall(
                UNLV_ASCII_LINES[index],
                ballX,
                characterWidth,
                horizontalRadius,
              );
            });
            lastObstacleKey = obstacleKey;
          }
        }
      }

      animationFrameId = requestAnimationFrame(renderFrame);
    };

    const resizeObserver = new ResizeObserver(updateMetrics);
    resizeObserver.observe(art);
    updateMetrics();
    animationFrameId = requestAnimationFrame(renderFrame);

    return () => {
      resizeObserver.disconnect();
      cancelAnimationFrame(animationFrameId);
      restoreArtwork();
    };
  }, [
    ballPositionRef,
    sectionCenterX,
    sectionRef,
    viewportCenterX,
  ]);

  return (
    <pre
      ref={artRef}
      className="about-education-ascii"
      role="img"
      aria-label="UNLV rendered as reactive ASCII artwork"
    >
      {UNLV_ASCII_LINES.map((line, index) => (
        <span
          key={index}
          ref={(lineElement) => {
            lineRefs.current[index] = lineElement;
          }}
          className="block"
        >
          {line}
        </span>
      ))}
    </pre>
  );
};

export default DynamicEducationAsciiArt;
