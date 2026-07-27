import { useRef, type RefObject } from "react";
import { motion } from "framer-motion";
import AboutInfoSwitcher from "../components/AboutInfoSwitcher";
import AboutPanelContent from "../components/AboutPanelContent";
import DynamicAboutDetails from "../components/DynamicAboutDetails";
import DynamicEducationAsciiArt from "../components/DynamicEducationAsciiArt";
import DynamicEducationDetails from "../components/DynamicEducationDetails";
import type { AboutPanelId } from "../content/about";
import { useRandomizedPanelTransition } from "../hooks/useRandomizedPanelTransition";
import { getAboutGravityScale } from "../physics/aboutGravityZone";
import {
  FADE_RADIUS,
  type BallCoordinates,
} from "../typesConstants";

interface AboutProps {
  centerX: number;
  ballX: number;
  ballPositionRef: RefObject<BallCoordinates>;
  viewportCenterX: number;
}

/**
 * Positions the inline About Me content within the horizontal world.
 */
const About: React.FC<AboutProps> = ({
  centerX,
  ballX,
  ballPositionRef,
  viewportCenterX,
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const {
    activeValue: activePanelId,
    isTransitioning,
    panelRef,
    requestValue: setActivePanelId,
    selectedValue: selectedPanelId,
  } = useRandomizedPanelTransition<AboutPanelId>("now");
  const distanceFromSection = Math.abs(ballX - centerX);
  const opacity = Math.max(0, 1 - distanceFromSection / FADE_RADIUS);
  const gravityScale = getAboutGravityScale(
    ballX,
    centerX,
    viewportCenterX * 2,
  );
  const isLowGravityActive = gravityScale < 0.95;

  return (
    <motion.section
      ref={sectionRef}
      className="absolute top-1/2 -translate-y-1/2 px-10"
      style={{
        left: `${centerX}px`,
        width: "min(1180px, calc(100vw - 120px))",
      }}
      animate={{ opacity }}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 20,
        mass: 0.5,
      }}
    >
      <div
        className={`gravity-chamber ${
          isLowGravityActive ? "is-active" : ""
        }`}
      >
        <div className="gravity-chamber-label">
          <span className="gravity-chamber-symbol" aria-hidden="true">
            ↑
          </span>
          <span>Low gravity</span>
        </div>

        <span
          className="gravity-chamber-corner gravity-chamber-corner-top-left"
          aria-hidden="true"
        />
        <span
          className="gravity-chamber-corner gravity-chamber-corner-top-right"
          aria-hidden="true"
        />
        <span
          className="gravity-chamber-corner gravity-chamber-corner-bottom-left"
          aria-hidden="true"
        />
        <span
          className="gravity-chamber-corner gravity-chamber-corner-bottom-right"
          aria-hidden="true"
        />

        <span
          className="gravity-chamber-drift gravity-chamber-drift-left"
          aria-hidden="true"
        />
        <span
          className="gravity-chamber-drift gravity-chamber-drift-right"
          aria-hidden="true"
        />

        <AboutInfoSwitcher
          disabled={isTransitioning}
          value={selectedPanelId}
          onChange={setActivePanelId}
        />

        <div className="about-panel-transition-host">
          <div
            ref={panelRef}
            className="about-panel-view"
            aria-live="polite"
            aria-busy={isTransitioning}
          >
            <AboutPanelContent
              panelId={activePanelId}
              educationArtwork={
                <DynamicEducationAsciiArt
                  ballPositionRef={ballPositionRef}
                  sectionCenterX={centerX}
                  sectionRef={sectionRef}
                  viewportCenterX={viewportCenterX}
                />
              }
              educationDetails={
                <DynamicEducationDetails
                  ballPositionRef={ballPositionRef}
                  sectionCenterX={centerX}
                  sectionRef={sectionRef}
                  viewportCenterX={viewportCenterX}
                />
              }
              nowDetails={
                <DynamicAboutDetails
                  ballPositionRef={ballPositionRef}
                  sectionCenterX={centerX}
                  sectionRef={sectionRef}
                  viewportCenterX={viewportCenterX}
                />
              }
            />
          </div>
        </div>

        <p className="gravity-chamber-tagline">
          Built to orbit, not to stall.
        </p>
      </div>
    </motion.section>
  );
};

export default About;
