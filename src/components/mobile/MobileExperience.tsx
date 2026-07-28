import { useEffect, useRef } from "react";
import journeyCharacterClimbASrc from "../../assets/journey-character-climb-a.png";
import journeyCharacterClimbBSrc from "../../assets/journey-character-climb-b.png";
import ExperiencePath from "../ExperiencePath";

/**
 * Renders work experience in the mobile document flow.
 */
const MobileExperience: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const climberRef = useRef<HTMLDivElement>(null);
  const frameIndexRef = useRef(0);

  useEffect(() => {
    const section = sectionRef.current;
    const climber = climberRef.current;
    const route =
      section?.querySelector<HTMLOListElement>(
        ".experience-mobile-route",
      );

    if (!section || !climber || !route) return;

    const shouldReduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    let animationFrame = 0;

    const updateClimber = () => {
      animationFrame = 0;

      const sectionRect = section.getBoundingClientRect();
      const routeRect = route.getBoundingClientRect();
      const climberRect = climber.getBoundingClientRect();
      const ropeStyles = window.getComputedStyle(route, "::after");
      const ropeRight = Number.parseFloat(ropeStyles.right);
      const ropeWidth = Number.parseFloat(ropeStyles.width);
      const ropeCenterInset =
        Number.isFinite(ropeRight) && Number.isFinite(ropeWidth)
          ? ropeRight + ropeWidth / 2
          : 40;
      const routeDocumentTop = routeRect.top + window.scrollY;
      const startScroll =
        routeDocumentTop - window.innerHeight * 0.55;
      const endScroll =
        routeDocumentTop +
        routeRect.height -
        window.innerHeight * 0.45;
      const progressRange = Math.max(endScroll - startScroll, 1);
      const progress = Math.min(
        Math.max(
          (window.scrollY - startScroll) / progressRange,
          0,
        ),
        1,
      );
      const routeTopWithinSection =
        routeRect.top - sectionRect.top;
      const travelDistance = Math.max(
        routeRect.height - climberRect.height,
        0,
      );
      const ropeXWithinSection =
        routeRect.right -
        sectionRect.left -
        ropeCenterInset;
      const climberY =
        routeTopWithinSection + progress * travelDistance;
      const climberX =
        ropeXWithinSection -
        climberRect.width / 2;

      climber.style.transform = `translate3d(${climberX}px, ${climberY}px, 0)`;

      if (!shouldReduceMotion) {
        const nextFrameIndex =
          Math.floor((progress * travelDistance) / 44) % 2;

        if (frameIndexRef.current !== nextFrameIndex) {
          frameIndexRef.current = nextFrameIndex;
          climber.dataset.frame =
            nextFrameIndex === 0 ? "a" : "b";
        }
      }
    };

    const scheduleUpdate = () => {
      if (animationFrame !== 0) return;
      animationFrame = window.requestAnimationFrame(updateClimber);
    };

    const resizeObserver = new ResizeObserver(scheduleUpdate);
    resizeObserver.observe(section);
    resizeObserver.observe(route);
    resizeObserver.observe(climber);
    window.addEventListener("scroll", scheduleUpdate, {
      passive: true,
    });
    window.addEventListener("resize", scheduleUpdate);
    scheduleUpdate();

    return () => {
      if (animationFrame !== 0) {
        window.cancelAnimationFrame(animationFrame);
      }
      resizeObserver.disconnect();
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="experience"
      className="mobile-experience-section"
    >
      <header className="experience-wave-header">
        <h2>EXPERIENCE</h2>
        <p>There was no straight line. That was the point.</p>
      </header>

      <p className="experience-wave-mobile-hint">
        Tap a checkpoint for detail. Scroll to climb.
      </p>
      <div
        ref={climberRef}
        className="experience-mobile-climber"
        data-frame="a"
        aria-hidden="true"
      >
        <img
          className="experience-mobile-climber-frame experience-mobile-climber-frame-a"
          src={journeyCharacterClimbASrc}
          alt=""
          draggable={false}
        />
        <img
          className="experience-mobile-climber-frame experience-mobile-climber-frame-b"
          src={journeyCharacterClimbBSrc}
          alt=""
          draggable={false}
        />
      </div>
      <ExperiencePath />
    </section>
  );
};

export default MobileExperience;
