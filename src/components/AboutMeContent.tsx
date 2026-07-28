import type { ReactNode } from "react";
import {
  ABOUT_IDENTITY,
  ABOUT_PARAGRAPHS,
} from "../content/about";

interface AboutMeContentProps {
  details?: ReactNode;
  heading?: readonly string[];
  headingDetails?: ReactNode;
}

/**
 * Renders the shared About Me copy without a visible container.
 */
const AboutMeContent: React.FC<AboutMeContentProps> = ({
  details,
  heading = ["ABOUT", "ME"],
  headingDetails,
}) => {
  return (
    <div className="grid w-full gap-10 md:grid-cols-[minmax(14rem,0.7fr)_minmax(0,1.3fr)] md:gap-16">
      <header>
        <h2 className="about-section-title text-[clamp(3.5rem,7vw,6.5rem)] font-semibold leading-[0.82] tracking-[-0.04em] text-[var(--terminal-green)]">
          {heading.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h2>
        {headingDetails}
      </header>

      <div className="max-w-2xl md:pt-8">
        {details ?? (
          <>
            <p className="about-details-name text-xl font-bold text-[var(--terminal-text)] md:text-2xl">
              {ABOUT_IDENTITY.name}
            </p>
            <p className="about-details-meta mt-2 text-sm font-semibold uppercase tracking-[0.12em] text-[var(--terminal-muted)]">
              {ABOUT_IDENTITY.education}
            </p>
            <p className="about-details-meta mt-1 text-sm font-semibold uppercase tracking-[0.12em] text-[var(--terminal-green)]">
              {ABOUT_IDENTITY.role}
            </p>

            <div className="about-readable-copy mt-8 space-y-5 text-base leading-relaxed text-[var(--terminal-text)] md:text-lg">
              <p>{ABOUT_PARAGRAPHS[0]}</p>
              <p className="text-[var(--terminal-muted)]">
                {ABOUT_PARAGRAPHS[1]}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AboutMeContent;
