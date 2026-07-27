import {
  EXPERIENCE_TIMELINE,
  type ExperienceTimelineItem,
} from "../content/experience";

interface ExperienceTimelineProps {
  items?: readonly ExperienceTimelineItem[];
}

/**
 * Renders the shared desktop and mobile work-experience timeline.
 */
const ExperienceTimeline: React.FC<ExperienceTimelineProps> = ({
  items = EXPERIENCE_TIMELINE,
}) => (
  <ol className="experience-timeline">
    {items.map((item, index) => (
      <li key={`${item.organization}-${item.role}`}>
        <span className="experience-timeline-period">
          {item.period}
        </span>
        <span className="experience-timeline-marker" aria-hidden="true">
          {String(index + 1).padStart(2, "0")}
        </span>
        <article className="experience-timeline-entry">
          <p>{item.organization}</p>
          <h3>{item.role}</h3>
          <span>{item.summary}</span>
          <ul aria-label={`${item.role} technologies`}>
            {item.technologies.map((technology) => (
              <li key={technology}>{technology}</li>
            ))}
          </ul>
        </article>
      </li>
    ))}
  </ol>
);

export default ExperienceTimeline;
