import { BriefcaseBusiness, Trophy } from "lucide-react";

export type LinkedInPreviewDestination =
  | "experience"
  | "projects";

interface LinkedInPreviewProps {
  onNavigate: (destination: LinkedInPreviewDestination) => void;
}

const RECENT_EXPERIENCE = [
  {
    description:
      "Built a real-time C++ telemetry simulator and PySide6 dashboard for 100+ channels, replacing roughly $30K in hardware-dependent range testing.",
    location: "Las Vegas, NV",
    organization: "JT4, LLC",
    period: "May 2026 - Present",
    role: "Software / Systems Engineer Intern",
  },
  {
    description:
      "Built and scaled a Spring Boot backend for a 3.5K+ user pilot, using RabbitMQ, SSE, and Redis to accelerate AI-powered career guidance.",
    location: "Las Vegas, NV",
    organization: "STARS Solution LLC",
    period: "Nov 2025 - Present",
    role: "Software Engineer Intern",
  },
] as const;

/**
 * Renders the Recent Win as an authored social post beneath FIND ME.
 */
export const LinkedInRecentWinPost: React.FC<
  LinkedInPreviewProps
> = ({ onNavigate }) => {
  const profileImage = `${import.meta.env.BASE_URL}profile-pic.png`;

  return (
    <article className="linkedin-post-card">
      <header className="linkedin-post-author">
        <img src={profileImage} alt="" />
        <span>
          <strong>Randy Pahang II</strong>
          <small>
            Full-Stack Developer • Computer Science @ UNLV
          </small>
          <small>Recent win</small>
        </span>
        <span aria-hidden="true">•••</span>
      </header>

      <div className="linkedin-post-body">
        <p>
          We built fast. It worked. We won.
        </p>
        <p>
          My team took 1st place at Rebel Hacks 2026 after
          turning an ambitious hackathon idea into a working
          project under the clock.
        </p>
      </div>

      <div className="linkedin-post-award">
        <Trophy aria-hidden="true" />
        <span>
          <small>Rebel Hacks 2026</small>
          <strong>1st Place</strong>
        </span>
      </div>

      <footer className="linkedin-post-footer">
        <span>Hackathon project • Team build</span>
        <button
          type="button"
          onClick={() => onNavigate("projects")}
        >
          See project <span aria-hidden="true">&gt;</span>
        </button>
      </footer>
    </article>
  );
};

/**
 * Renders an expanded work-history preview beneath the social links.
 */
export const LinkedInExperiencePreview: React.FC<
  LinkedInPreviewProps
> = ({ onNavigate }) => (
  <section
    id="social-link-preview"
    className="linkedin-experience-panel"
  >
    <header>
      <span className="linkedin-preview-icon" aria-hidden="true">
        <BriefcaseBusiness />
      </span>
      <span>
        <small>Experience snapshot</small>
        <strong>Beyond the commit history.</strong>
      </span>
      <button
        type="button"
        onClick={() => onNavigate("experience")}
      >
        View more <span aria-hidden="true">&gt;</span>
      </button>
    </header>

    <ol>
      {RECENT_EXPERIENCE.map((experience, index) => (
        <li key={`${experience.organization}-${experience.role}`}>
          <span>
            {String(index + 1).padStart(2, "0")} /{" "}
            {experience.period}
          </span>
          <strong>{experience.role}</strong>
          <small>
            {experience.organization} / {experience.location}
          </small>
          <p>{experience.description}</p>
        </li>
      ))}
    </ol>
  </section>
);
