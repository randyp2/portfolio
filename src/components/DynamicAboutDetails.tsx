import type {
  LayoutCursor,
  PreparedTextWithSegments,
} from "@chenglou/pretext";
import {
  useEffect,
  useRef,
  type ReactNode,
  type RefObject,
} from "react";
import { BALL_RADIUS, type BallCoordinates } from "../typesConstants";
import {
  ABOUT_IDENTITY,
  ABOUT_PARAGRAPHS,
} from "../content/about";

const WRAP_PADDING_PX = 24;
const MINIMUM_SLOT_WIDTH_PX = 160;
const POSITION_QUANTIZATION_PX = 2;
const MAX_PROJECTED_LINES = 100;

const NAME_CLASS_NAME =
  "about-details-name text-xl font-bold text-[var(--terminal-text)] md:text-2xl";
const EDUCATION_CLASS_NAME =
  "about-details-meta text-sm font-semibold uppercase tracking-[0.12em] text-[var(--terminal-muted)]";
const ROLE_CLASS_NAME =
  "about-details-meta text-sm font-semibold uppercase tracking-[0.12em] text-[var(--terminal-green)]";
const PRIMARY_BIOGRAPHY_CLASS_NAME =
  "about-details-body text-base leading-relaxed text-[var(--terminal-text)] md:text-lg";
const SECONDARY_BIOGRAPHY_CLASS_NAME =
  "about-details-body text-base leading-relaxed text-[var(--terminal-muted)] md:text-lg";

/**
 * Describes one styled text block in a dynamic Pretext flow.
 */
export interface DynamicTextBlock {
  readonly className: string;
  readonly gapBefore: number;
  readonly id: string;
  readonly text: string;
}

const ABOUT_TEXT_BLOCKS: readonly DynamicTextBlock[] = [
  {
    id: "name",
    className: NAME_CLASS_NAME,
    gapBefore: 0,
    text: ABOUT_IDENTITY.name,
  },
  {
    id: "education",
    className: EDUCATION_CLASS_NAME,
    gapBefore: 8,
    text: ABOUT_IDENTITY.education.toUpperCase(),
  },
  {
    id: "role",
    className: ROLE_CLASS_NAME,
    gapBefore: 4,
    text: ABOUT_IDENTITY.role.toUpperCase(),
  },
  {
    id: "biography-primary",
    className: PRIMARY_BIOGRAPHY_CLASS_NAME,
    gapBefore: 32,
    text: ABOUT_PARAGRAPHS[0],
  },
  {
    id: "biography-secondary",
    className: SECONDARY_BIOGRAPHY_CLASS_NAME,
    gapBefore: 20,
    text: ABOUT_PARAGRAPHS[1],
  },
] as const;

interface DynamicAboutDetailsProps {
  ballPositionRef: RefObject<BallCoordinates>;
  blocks?: readonly DynamicTextBlock[];
  initializationLabel?: string;
  screenReaderContent?: ReactNode;
  sectionCenterX: number;
  sectionRef: RefObject<HTMLElement | null>;
  visualClassName?: string;
  viewportCenterX: number;
}

interface TypographyMetrics {
  font: string;
  letterSpacing: number;
  lineHeight: number;
}

interface TextSlot {
  x: number;
  width: number;
}

interface ProjectedLine {
  className: string;
  text: string;
  x: number;
  y: number;
}

interface PreparedTextBlock {
  className: string;
  gapBefore: number;
  prepared: PreparedTextWithSegments;
  typography: TypographyMetrics;
}

interface PreparedAboutDetails {
  blocks: PreparedTextBlock[];
  width: number;
}

type PretextModule = typeof import("@chenglou/pretext");

const readPixelValue = (value: string, fallback: number): number => {
  const parsedValue = Number.parseFloat(value);
  return Number.isFinite(parsedValue) ? parsedValue : fallback;
};

const readTypography = (element: HTMLElement): TypographyMetrics => {
  const styles = window.getComputedStyle(element);
  const fontSize = readPixelValue(styles.fontSize, 18);
  const lineHeight = readPixelValue(styles.lineHeight, fontSize * 1.5);
  const letterSpacing = readPixelValue(styles.letterSpacing, 0);

  return {
    font: `${styles.fontWeight} ${styles.fontSize} ${styles.fontFamily}`,
    letterSpacing,
    lineHeight,
  };
};

const prepareAboutDetails = (
  width: number,
  metricsContainer: HTMLElement,
  blocks: readonly DynamicTextBlock[],
  prepareWithSegments: PretextModule["prepareWithSegments"],
): PreparedAboutDetails => {
  const preparedBlocks = blocks.map((block) => {
    const metricsElement =
      metricsContainer.querySelector<HTMLElement>(
        `[data-pretext-metrics="${block.id}"]`,
      );
    if (!metricsElement) {
      throw new Error(`Missing typography metrics for ${block.id}.`);
    }

    const typography = readTypography(metricsElement);
    return {
      className: block.className,
      gapBefore: block.gapBefore,
      prepared: prepareWithSegments(
        block.text,
        typography.font,
        {
          letterSpacing: typography.letterSpacing,
        },
      ),
      typography,
    };
  });

  return { blocks: preparedBlocks, width };
};

const getAvailableSlots = (
  width: number,
  lineTop: number,
  lineHeight: number,
  obstacle: BallCoordinates | null,
): TextSlot[] => {
  if (!obstacle) return [{ x: 0, width }];

  const radius = BALL_RADIUS + WRAP_PADDING_PX;
  const lineBottom = lineTop + lineHeight;
  const verticalDistance =
    obstacle.y < lineTop
      ? lineTop - obstacle.y
      : obstacle.y > lineBottom
        ? obstacle.y - lineBottom
        : 0;

  if (verticalDistance >= radius) return [{ x: 0, width }];

  const horizontalRadius = Math.sqrt(
    radius * radius - verticalDistance * verticalDistance,
  );
  const blockedLeft = Math.max(0, obstacle.x - horizontalRadius);
  const blockedRight = Math.min(width, obstacle.x + horizontalRadius);

  if (blockedRight <= 0 || blockedLeft >= width) {
    return [{ x: 0, width }];
  }

  const slots: TextSlot[] = [];
  if (blockedLeft >= MINIMUM_SLOT_WIDTH_PX) {
    slots.push({ x: 0, width: blockedLeft });
  }
  if (width - blockedRight >= MINIMUM_SLOT_WIDTH_PX) {
    slots.push({ x: blockedRight, width: width - blockedRight });
  }

  return slots;
};

const projectParagraph = (
  prepared: PreparedTextWithSegments,
  width: number,
  lineHeight: number,
  startY: number,
  obstacle: BallCoordinates | null,
  className: string,
  layoutNextLine: PretextModule["layoutNextLine"],
): { bottom: number; lines: ProjectedLine[] } => {
  let cursor: LayoutCursor = { segmentIndex: 0, graphemeIndex: 0 };
  let lineTop = startY;
  let paragraphBottom = startY;
  const lines: ProjectedLine[] = [];

  while (lines.length < MAX_PROJECTED_LINES) {
    const slots = getAvailableSlots(
      width,
      lineTop,
      lineHeight,
      obstacle,
    );

    if (slots.length === 0) {
      lineTop += lineHeight;
      continue;
    }

    let paragraphComplete = false;

    for (const slot of slots) {
      const line = layoutNextLine(prepared, cursor, slot.width);
      if (!line) {
        paragraphComplete = true;
        break;
      }

      lines.push({
        className,
        text: line.text,
        x: slot.x,
        y: lineTop,
      });
      cursor = line.end;
      paragraphBottom = lineTop + lineHeight;
    }

    if (paragraphComplete) break;
    lineTop += lineHeight;
  }

  return { bottom: paragraphBottom, lines };
};

const projectAboutDetails = (
  preparedDetails: PreparedAboutDetails,
  obstacle: BallCoordinates | null,
  layoutNextLine: PretextModule["layoutNextLine"],
): ProjectedLine[] => {
  let blockTop = 0;
  const projectedLines: ProjectedLine[] = [];

  preparedDetails.blocks.forEach((block) => {
    blockTop += block.gapBefore;
    const projection = projectParagraph(
      block.prepared,
      preparedDetails.width,
      block.typography.lineHeight,
      blockTop,
      obstacle,
      block.className,
      layoutNextLine,
    );
    projectedLines.push(...projection.lines);
    blockTop = projection.bottom;
  });

  return projectedLines;
};

const projectionsMatch = (
  previousLines: ProjectedLine[],
  nextLines: ProjectedLine[],
): boolean => {
  if (previousLines.length !== nextLines.length) return false;

  return previousLines.every((line, index) => {
    const nextLine = nextLines[index];
    return (
      line.className === nextLine.className &&
      line.text === nextLine.text &&
      line.x === nextLine.x &&
      line.y === nextLine.y
    );
  });
};

const renderProjection = (
  container: HTMLElement,
  lineElements: HTMLSpanElement[],
  lines: ProjectedLine[],
): void => {
  while (lineElements.length < lines.length) {
    const lineElement = document.createElement("span");
    lineElement.className = "absolute left-0 top-0 whitespace-pre";
    container.appendChild(lineElement);
    lineElements.push(lineElement);
  }

  while (lineElements.length > lines.length) {
    lineElements.pop()?.remove();
  }

  lines.forEach((line, index) => {
    const lineElement = lineElements[index];
    lineElement.className = `absolute left-0 top-0 whitespace-pre ${line.className}`;
    lineElement.textContent = line.text;
    lineElement.style.transform = `translate3d(${line.x}px, ${line.y}px, 0)`;
  });
};

const quantizePosition = (position: number): number =>
  Math.round(position / POSITION_QUANTIZATION_PX) *
  POSITION_QUANTIZATION_PX;

/**
 * Reflows structured text around the live physics ball using Pretext.
 */
const DynamicAboutDetails: React.FC<DynamicAboutDetailsProps> = ({
  ballPositionRef,
  blocks = ABOUT_TEXT_BLOCKS,
  initializationLabel = "About",
  screenReaderContent,
  sectionCenterX,
  sectionRef,
  visualClassName =
    "dynamic-about-details relative h-[clamp(24rem,45vh,27rem)] w-full",
  viewportCenterX,
}) => {
  const metricsContainerRef = useRef<HTMLDivElement>(null);
  const visualTextRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const metricsContainer = metricsContainerRef.current;
    const visualText = visualTextRef.current;
    const section = sectionRef.current;
    if (!metricsContainer || !visualText || !section) return;

    let animationFrameId = 0;
    let disposed = false;
    let pretextModule: PretextModule | null = null;
    let lastObstacleKey = "";
    let lastProjection: ProjectedLine[] = [];
    let preparedDetails: PreparedAboutDetails | null = null;
    let textOffsetX = 0;
    let textTop = 0;
    let textHeight = 0;
    const lineElements: HTMLSpanElement[] = [];

    visualText.replaceChildren();

    const updateTypography = () => {
      if (!pretextModule) return;

      const width = visualText.clientWidth;
      if (width <= 0) return;

      const sectionRect = section.getBoundingClientRect();
      const textRect = visualText.getBoundingClientRect();
      textOffsetX = textRect.left - sectionRect.left;
      textTop = textRect.top;
      textHeight = textRect.height;
      preparedDetails = prepareAboutDetails(
        width,
        metricsContainer,
        blocks,
        pretextModule.prepareWithSegments,
      );
      lastObstacleKey = "";
    };

    const renderFrame = () => {
      if (disposed) return;

      const activePretextModule = pretextModule;
      if (preparedDetails && activePretextModule) {
        const ballPosition = ballPositionRef.current;
        const ballX = quantizePosition(
          ballPosition.x +
            viewportCenterX -
            sectionCenterX -
            textOffsetX,
        );
        const ballY = quantizePosition(ballPosition.y - textTop);
        const radius = BALL_RADIUS + WRAP_PADDING_PX;
        const intersectsText =
          ballX >= -radius &&
          ballX <= preparedDetails.width + radius &&
          ballY >= -radius &&
          ballY <= textHeight + radius;
        const obstacle = intersectsText
          ? { x: ballX, y: ballY }
          : null;
        const obstacleKey = obstacle
          ? `${obstacle.x}:${obstacle.y}`
          : "none";

        if (obstacleKey !== lastObstacleKey) {
          const nextProjection = projectAboutDetails(
            preparedDetails,
            obstacle,
            activePretextModule.layoutNextLine,
          );

          if (!projectionsMatch(lastProjection, nextProjection)) {
            renderProjection(
              visualText,
              lineElements,
              nextProjection,
            );
            lastProjection = nextProjection;
          }

          lastObstacleKey = obstacleKey;
        }
      }

      animationFrameId = requestAnimationFrame(renderFrame);
    };

    const resizeObserver = new ResizeObserver(updateTypography);
    resizeObserver.observe(visualText);

    void Promise.all([
      document.fonts.ready,
      import("@chenglou/pretext"),
    ])
      .then(([, loadedPretextModule]) => {
        if (disposed) return;
        pretextModule = loadedPretextModule;
        updateTypography();
        animationFrameId = requestAnimationFrame(renderFrame);
      })
      .catch((error: unknown) => {
        console.error(
          `Failed to initialize dynamic ${initializationLabel} text:`,
          error,
        );
      });

    return () => {
      disposed = true;
      resizeObserver.disconnect();
      cancelAnimationFrame(animationFrameId);
      lineElements.forEach((lineElement) => lineElement.remove());
      lineElements.length = 0;
    };
  }, [
    ballPositionRef,
    blocks,
    initializationLabel,
    sectionCenterX,
    sectionRef,
    viewportCenterX,
  ]);

  return (
    <div className="relative">
      <div
        ref={metricsContainerRef}
        className="pointer-events-none invisible absolute left-0 top-0"
        aria-hidden="true"
      >
        {blocks.map((block) => (
          <span
            key={block.id}
            data-pretext-metrics={block.id}
            className={`block whitespace-nowrap ${block.className}`}
          >
            {block.text}
          </span>
        ))}
      </div>
      <div
        ref={visualTextRef}
        className={visualClassName}
        aria-hidden="true"
      />
      <div className="sr-only">
        {screenReaderContent ?? (
          <>
            <p>{ABOUT_IDENTITY.name}</p>
            <p>{ABOUT_IDENTITY.education}</p>
            <p>{ABOUT_IDENTITY.role}</p>
            <p>{ABOUT_PARAGRAPHS[0]}</p>
            <p>{ABOUT_PARAGRAPHS[1]}</p>
          </>
        )}
      </div>
    </div>
  );
};

export default DynamicAboutDetails;
