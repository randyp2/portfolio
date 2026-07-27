import {
  useEffect,
  useRef,
  type RefObject,
} from "react";
import asciiPortraitSource from "../assets/self-ascii-art.txt?raw";
import {
  BALL_RADIUS,
  type BallCoordinates,
} from "../typesConstants";

const LINES_PER_WAVE = 10;
const WAVE_INTERVAL_MS = 180;
const LINE_STAGGER_MS = 20;
const MIN_CHARACTERS_PER_SECOND = 60;
const SPEED_VARIATION = 30;
const FRAME_INTERVAL_MS = 1000 / 30;
const REACTION_PADDING_PX = 14;
const POSITION_QUANTIZATION_PX = 2;

const formatAsciiPortrait = (source: string): string => {
  const lines = source.replace(/\r/g, "").split("\n");

  while (lines[0]?.trim() === "") lines.shift();
  while (lines.at(-1)?.trim() === "") lines.pop();

  const contentLines = lines.filter((line) => line.trim().length > 0);
  if (contentLines.length === 0) return "";

  const commonIndent = Math.min(
    ...contentLines.map((line) => line.match(/^ */)?.[0].length ?? 0),
  );

  return lines
    .map((line) => line.slice(commonIndent).trimEnd())
    .join("\n");
};

const asciiPortrait = formatAsciiPortrait(asciiPortraitSource);
const portraitLines = asciiPortrait.split("\n");
const emptyPortrait = portraitLines.map(() => "").join("\n");
const portraitWidth =
  Math.max(...portraitLines.map((line) => line.length)) + 1;

interface AsciiPortraitReaction {
  ballPositionRef: RefObject<BallCoordinates>;
  sectionCenterX: number;
  sectionRef: RefObject<HTMLElement | null>;
  viewportCenterX: number;
}

interface AsciiPortraitProps {
  onAnimationComplete?: () => void;
  reaction?: AsciiPortraitReaction;
}

interface AnimatedLine {
  content: string;
  leadingWhitespace: string;
  startTime: number;
  charactersPerSecond: number;
}

const animatedLines: AnimatedLine[] = portraitLines.map((line, index) => {
  const contentStart = line.search(/\S/);
  const leadingWhitespace =
    contentStart === -1 ? line : line.slice(0, contentStart);
  const content = contentStart === -1 ? "" : line.slice(contentStart);
  const wave = Math.floor(index / LINES_PER_WAVE);
  const positionInWave = index % LINES_PER_WAVE;

  return {
    content,
    leadingWhitespace,
    startTime:
      wave * WAVE_INTERVAL_MS + positionInWave * LINE_STAGGER_MS,
    charactersPerSecond:
      MIN_CHARACTERS_PER_SECOND + ((index * 37) % SPEED_VARIATION),
  };
});

const renderAnimationFrame = (
  elapsedMilliseconds: number,
): { complete: boolean; portrait: string } => {
  let complete = true;

  const lines = animatedLines.map((line) => {
    const elapsedSinceStart = elapsedMilliseconds - line.startTime;
    if (elapsedSinceStart < 0) {
      complete = false;
      return "";
    }

    const characterCount = Math.min(
      line.content.length,
      Math.floor(
        (elapsedSinceStart * line.charactersPerSecond) / 1000,
      ),
    );
    const lineComplete = characterCount >= line.content.length;
    if (!lineComplete) complete = false;

    const typedContent = line.content.slice(0, characterCount);
    const cursor = lineComplete || line.content.length === 0 ? "" : "▌";
    return `${line.leadingWhitespace}${typedContent}${cursor}`;
  });

  return { complete, portrait: lines.join("\n") };
};

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
 * Builds the ASCII portrait once, then carves a temporary pocket around the ball.
 */
const AsciiPortrait: React.FC<AsciiPortraitProps> = ({
  onAnimationComplete,
  reaction,
}) => {
  const portraitRef = useRef<HTMLPreElement>(null);
  const onAnimationCompleteRef = useRef(onAnimationComplete);
  const reactionRef = useRef(reaction);

  reactionRef.current = reaction;

  useEffect(() => {
    onAnimationCompleteRef.current = onAnimationComplete;
  }, [onAnimationComplete]);

  useEffect(() => {
    const portraitElement = portraitRef.current;
    if (!portraitElement) return;

    portraitElement.textContent = emptyPortrait;

    let animationFrameId = 0;
    let startTime: number | undefined;
    let lastRenderTime = 0;
    let basePortrait = emptyPortrait;
    let animationComplete = false;
    let completionReported = false;
    let artOffsetX = 0;
    let artTop = 0;
    let characterWidth = 1;
    let lineHeight = 1;
    let lastBasePortrait = "";
    let lastObstacleKey = "";

    const updateMetrics = () => {
      const activeReaction = reactionRef.current;
      const section = activeReaction?.sectionRef.current;
      if (!activeReaction || !section) return;

      const sectionRect = section.getBoundingClientRect();
      const portraitRect = portraitElement.getBoundingClientRect();
      const styles = window.getComputedStyle(portraitElement);
      const measuredLineHeight = Number.parseFloat(styles.lineHeight);

      artOffsetX = portraitRect.left - sectionRect.left;
      artTop = portraitRect.top;
      characterWidth =
        portraitWidth > 0
          ? portraitRect.width / portraitWidth
          : 1;
      lineHeight = Number.isFinite(measuredLineHeight)
        ? measuredLineHeight
        : 1;
      lastObstacleKey = "";
    };

    const renderReactivePortrait = (): {
      obstacleKey: string;
      portrait: string;
    } => {
      const activeReaction = reactionRef.current;
      const section = activeReaction?.sectionRef.current;
      if (!activeReaction || !section) {
        return { obstacleKey: "none", portrait: basePortrait };
      }

      const ballPosition = activeReaction.ballPositionRef.current;
      const ballX = quantizePosition(
        ballPosition.x +
          activeReaction.viewportCenterX -
          activeReaction.sectionCenterX -
          artOffsetX,
      );
      const ballY = quantizePosition(ballPosition.y - artTop);
      const reactionRadius = BALL_RADIUS + REACTION_PADDING_PX;
      const intersectsPortrait =
        ballX >= -reactionRadius &&
        ballX <= portraitElement.clientWidth + reactionRadius &&
        ballY >= -reactionRadius &&
        ballY <= portraitElement.clientHeight + reactionRadius;

      if (!intersectsPortrait) {
        return { obstacleKey: "none", portrait: basePortrait };
      }

      const carvedLines = basePortrait.split("\n").map((line, index) => {
        const lineCenterY = index * lineHeight + lineHeight / 2;
        const verticalDistance = Math.abs(ballY - lineCenterY);

        if (verticalDistance >= reactionRadius) return line;

        const horizontalRadius = Math.sqrt(
          reactionRadius * reactionRadius -
            verticalDistance * verticalDistance,
        );
        return carveLineAroundBall(
          line,
          ballX,
          characterWidth,
          horizontalRadius,
        );
      });

      return {
        obstacleKey: `${ballX}:${ballY}`,
        portrait: carvedLines.join("\n"),
      };
    };

    const animate = (timestamp: number) => {
      startTime ??= timestamp;

      if (timestamp - lastRenderTime >= FRAME_INTERVAL_MS) {
        lastRenderTime = timestamp;

        if (!animationComplete) {
          const frame = renderAnimationFrame(timestamp - startTime);
          basePortrait = frame.complete
            ? asciiPortrait
            : frame.portrait;
          animationComplete = frame.complete;
        }

        const reactiveFrame = renderReactivePortrait();
        if (
          basePortrait !== lastBasePortrait ||
          reactiveFrame.obstacleKey !== lastObstacleKey
        ) {
          portraitElement.textContent = reactiveFrame.portrait;
          lastBasePortrait = basePortrait;
          lastObstacleKey = reactiveFrame.obstacleKey;
        }

        if (animationComplete && !completionReported) {
          completionReported = true;
          onAnimationCompleteRef.current?.();
        }
      }

      if (animationComplete && !reactionRef.current) return;
      animationFrameId = requestAnimationFrame(animate);
    };

    const resizeObserver = new ResizeObserver(updateMetrics);
    resizeObserver.observe(portraitElement);
    updateMetrics();
    animationFrameId = requestAnimationFrame(animate);

    return () => {
      resizeObserver.disconnect();
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <pre
      ref={portraitRef}
      className="ascii-portrait"
      role="img"
      aria-label="ASCII portrait of Randy Pahang II"
      style={{ width: `${portraitWidth}ch` }}
    >
      {emptyPortrait}
    </pre>
  );
};

export default AsciiPortrait;
