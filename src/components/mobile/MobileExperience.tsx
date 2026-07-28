import journeyCharacterSrc from "../../assets/journey-character.png";
import ExperiencePath from "../ExperiencePath";

/**
 * Renders work experience in the mobile document flow.
 */
const MobileExperience: React.FC = () => (
  <section id="experience" className="mobile-experience-section">
    <header className="experience-wave-header">
      <h2>EXPERIENCE</h2>
      <p>There was no straight line. That was the point.</p>
    </header>

    <p className="experience-wave-mobile-hint">
      Tap a checkpoint for detail.
    </p>
    <img
      className="experience-mobile-character"
      src={journeyCharacterSrc}
      alt="Pixel adventurer looking toward the experience path"
      draggable={false}
    />
    <ExperiencePath />
  </section>
);

export default MobileExperience;
