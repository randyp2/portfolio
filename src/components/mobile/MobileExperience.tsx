import ExperienceTimeline from "../ExperienceTimeline";

/**
 * Renders work experience in the mobile document flow.
 */
const MobileExperience: React.FC = () => (
  <section id="experience" className="mobile-experience-section">
    <header className="experience-section-header">
      <p>Work history</p>
      <h2>EXPERIENCE</h2>
      <span>
        A first-pass timeline. We will refine the story and
        interactions next.
      </span>
    </header>

    <ExperienceTimeline />
  </section>
);

export default MobileExperience;
