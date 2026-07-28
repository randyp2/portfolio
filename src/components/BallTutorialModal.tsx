import { motion } from "framer-motion";
import { MousePointer2, X } from "lucide-react";
import { useEffect, useRef } from "react";

const FOCUSABLE_SELECTOR =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

interface BallTutorialModalProps {
  onComplete: () => void;
  variant: "desktop" | "mobile";
}

/**
 * Introduces the desktop ball controls before the portfolio becomes interactive.
 */
const BallTutorialModal: React.FC<BallTutorialModalProps> = ({
  onComplete,
  variant,
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const enterButtonRef = useRef<HTMLButtonElement>(null);
  const isMobile = variant === "mobile";

  useEffect(() => {
    const previouslyFocusedElement =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    enterButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onComplete();
        return;
      }

      if (event.key !== "Tab" || !dialogRef.current) return;

      const focusableElements = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          FOCUSABLE_SELECTOR,
        ),
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements.at(-1);

      if (!firstElement || !lastElement) return;

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (
        !event.shiftKey &&
        document.activeElement === lastElement
      ) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      previouslyFocusedElement?.focus();
    };
  }, [onComplete]);

  return (
    <motion.div
      className="ball-tutorial-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      onPointerDown={(event) => {
        if (event.target === event.currentTarget) {
          onComplete();
        }
      }}
    >
      <motion.div
        ref={dialogRef}
        className="ball-tutorial-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ball-tutorial-title"
        aria-describedby="ball-tutorial-description"
        initial={{ opacity: 0, y: 18, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.24, ease: "easeOut" }}
      >
        <header className="ball-tutorial-header">
          <span>
            {isMobile
              ? "00 // mobile briefing"
              : "00 // navigation protocol"}
          </span>
          <button
            type="button"
            onClick={onComplete}
            aria-label="Close ball controls"
          >
            <X aria-hidden="true" />
          </button>
        </header>

        <div className="ball-tutorial-content">
          <div className="ball-tutorial-copy">
            <p className="ball-tutorial-kicker">
              {isMobile ? "DESKTOP RECOMMENDED" : "HOW TO MOVE"}
            </p>
            <h2 id="ball-tutorial-title">
              {isMobile
                ? "MORE FUN ON A BIG SCREEN."
                : "DRAG. AIM. LAUNCH."}
            </h2>
            <p id="ball-tutorial-description">
              {isMobile
                ? "This mobile version is built for scrolling. Open the portfolio on a desktop for the full ball-powered experience shown below."
                : "Pull away from where you want to go. The vector previews your direction, then releasing launches the ball."}
            </p>
          </div>

          <div className="ball-tutorial-demo" aria-hidden="true">
            <span className="ball-tutorial-grid-label ball-tutorial-grid-label-drag">
              DRAG
            </span>
            <span className="ball-tutorial-grid-label ball-tutorial-grid-label-release">
              RELEASE
            </span>

            <svg
              className="ball-tutorial-vector"
              viewBox="0 0 506 210"
              preserveAspectRatio="none"
            >
              <defs>
                <marker
                  id="tutorial-vector-arrow"
                  markerWidth="7"
                  markerHeight="7"
                  refX="5"
                  refY="3.5"
                  orient="auto"
                >
                  <path d="M 0 0 L 7 3.5 L 0 7 Z" />
                </marker>
              </defs>
              <path
                className="ball-tutorial-drag-line"
                d="M 118 137 L 57 181"
              />
              <path
                className="ball-tutorial-launch-vector"
                d="M 118 137 L 302 50"
                markerEnd="url(#tutorial-vector-arrow)"
              />
            </svg>

            <span className="ball-tutorial-vector-label">
              LAUNCH VECTOR
            </span>
            <span className="ball-tutorial-demo-ball" />
            <span className="ball-tutorial-pointer">
              <MousePointer2 aria-hidden="true" />
            </span>
          </div>

          <div className="ball-tutorial-note">
            <span aria-hidden="true">i</span>
            <p>
              {isMobile
                ? "Everything is still here on mobile. Use the menu or scroll normally."
                : "The ball is a fun way to explore, but every section is still available from the navbar."}
            </p>
          </div>

          <button
            ref={enterButtonRef}
            type="button"
            className="ball-tutorial-enter"
            onClick={onComplete}
          >
            <span>
              {isMobile ? "CONTINUE ON MOBILE" : "OPEN WORLD"}
            </span>
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default BallTutorialModal;
