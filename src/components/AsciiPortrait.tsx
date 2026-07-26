import { useEffect, useRef } from "react";
import asciiPortraitSource from "../assets/self-ascii-art.txt?raw";

const LINES_PER_WAVE = 10;
const WAVE_INTERVAL_MS = 180;
const LINE_STAGGER_MS = 20;
const MIN_CHARACTERS_PER_SECOND = 60;
const SPEED_VARIATION = 30;
const FRAME_INTERVAL_MS = 1000 / 30;

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

interface AsciiPortraitProps {
  onAnimationComplete?: () => void;
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

/**
 * Builds the portfolio owner's ASCII portrait with concurrent line typewriters.
 */
const AsciiPortrait: React.FC<AsciiPortraitProps> = ({
  onAnimationComplete,
}) => {
  const portraitRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    const portraitElement = portraitRef.current;
    if (!portraitElement) return;

    portraitElement.textContent = emptyPortrait;

    let animationFrameId = 0;
    let wasVisible = false;

    const playAnimation = () => {
      cancelAnimationFrame(animationFrameId);

      portraitElement.textContent = emptyPortrait;

      let startTime: number | undefined;
      let lastRenderTime = 0;

      const animate = (timestamp: number) => {
        startTime ??= timestamp;

        if (timestamp - lastRenderTime >= FRAME_INTERVAL_MS) {
          lastRenderTime = timestamp;
          const frame = renderAnimationFrame(timestamp - startTime);
          portraitElement.textContent = frame.complete
            ? asciiPortrait
            : frame.portrait;

          if (frame.complete) {
            onAnimationComplete?.();
            return;
          }
        }

        animationFrameId = requestAnimationFrame(animate);
      };

      animationFrameId = requestAnimationFrame(animate);
    };

    if (!("IntersectionObserver" in window)) {
      playAnimation();
      return () => cancelAnimationFrame(animationFrameId);
    }

    playAnimation();
    wasVisible = true;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isVisible =
          entry.isIntersecting && entry.intersectionRatio >= 0.15;

        if (isVisible && !wasVisible) {
          playAnimation();
        }

        wasVisible = isVisible;
      },
      { threshold: [0, 0.15] },
    );

    observer.observe(portraitElement);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(animationFrameId);
    };
  }, [onAnimationComplete]);

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
