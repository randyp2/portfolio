import { motion } from "framer-motion";
import ExperienceTimeline from "../components/ExperienceTimeline";
import { FADE_RADIUS } from "../typesConstants";

interface ExperienceProps {
  ballX: number;
  centerX: number;
}

/**
 * Positions the work-experience timeline within the horizontal world.
 */
const Experience: React.FC<ExperienceProps> = ({
  ballX,
  centerX,
}) => {
  const distanceFromSection = Math.abs(ballX - centerX);
  const opacity = Math.max(
    0,
    1 - distanceFromSection / FADE_RADIUS,
  );

  return (
    <motion.section
      className="experience-section"
      style={{
        left: `${centerX}px`,
        width: "min(1180px, calc(100vw - 120px))",
      }}
      animate={{ opacity }}
      transition={{
        damping: 20,
        mass: 0.5,
        stiffness: 100,
        type: "spring",
      }}
    >
      <header className="experience-section-header">
        <p>Work history</p>
        <h2>EXPERIENCE</h2>
        <span>
          A first-pass timeline. We will refine the story and
          interactions next.
        </span>
      </header>

      <ExperienceTimeline />
    </motion.section>
  );
};

export default Experience;
