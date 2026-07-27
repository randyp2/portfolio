import type { ReactNode } from "react";
import {
  ABOUT_EDUCATION,
  ABOUT_LINKS,
  type AboutPanelId,
} from "../content/about";
import { UNLV_ASCII_ART } from "../content/educationAsciiArt";
import AboutMeContent from "./AboutMeContent";
import EducationPixelIcon from "./EducationPixelIcon";

interface AboutPanelContentProps {
  educationArtwork?: ReactNode;
  educationDetails?: ReactNode;
  nowDetails?: ReactNode;
  panelId: AboutPanelId;
}

const getLinkHref = (
  href: string,
  usesBasePath: boolean,
): string =>
  usesBasePath ? `${import.meta.env.BASE_URL}${href}` : href;

interface EducationDetailsProps {
  artwork?: ReactNode;
  details?: ReactNode;
}

const EducationDetails: React.FC<EducationDetailsProps> = ({
  artwork,
  details,
}) => (
  <div className="about-education-panel">
    <figure className="about-education-artwork">
      {artwork ?? (
        <pre
          className="about-education-ascii"
          role="img"
          aria-label="UNLV rendered as ASCII artwork"
        >
          {UNLV_ASCII_ART}
        </pre>
      )}
    </figure>

    <div className="about-education-content">
      {details ?? (
        <div className="about-education-list">
          <article className="about-education-entry">
            <div className="about-education-entry-heading">
              <EducationPixelIcon variant="degree" />
              <p className="about-panel-eyebrow">Degree</p>
            </div>
            <p className="about-education-period">
              Expected graduation
            </p>
            <h3 className="about-education-institution">
              {ABOUT_EDUCATION.expectedGraduation}
            </h3>
            <p className="about-education-program">
              {ABOUT_EDUCATION.degree}
            </p>
            <p className="about-education-detail">
              {ABOUT_EDUCATION.institution}
            </p>
            <p className="about-education-detail">
              {ABOUT_EDUCATION.honorsCollege}
            </p>
          </article>

          <article className="about-education-entry">
            <div className="about-education-entry-heading">
              <EducationPixelIcon variant="leadership" />
              <p className="about-panel-eyebrow">Leadership</p>
            </div>
            <h3 className="about-education-institution">
              {ABOUT_EDUCATION.leadership.role}
            </h3>
            <p className="about-education-program">
              {ABOUT_EDUCATION.leadership.organization}
            </p>
            <p className="about-education-detail">
              {ABOUT_EDUCATION.leadership.affiliation}
            </p>
            <p className="about-education-detail">
              {ABOUT_EDUCATION.leadership.workshops}
            </p>
            <p className="about-education-detail">
              {ABOUT_EDUCATION.leadership.teamLeadership}
            </p>
          </article>

          <article className="about-education-entry">
            <div className="about-education-entry-heading">
              <EducationPixelIcon variant="achievement" />
              <p className="about-panel-eyebrow">Achievements</p>
            </div>
            <h3 className="about-education-institution">
              {ABOUT_EDUCATION.achievements.gpa}
            </h3>
            <p className="about-education-program">
              {ABOUT_EDUCATION.achievements.deansList}
            </p>
            <p className="about-education-detail">
              {ABOUT_EDUCATION.achievements.deansListFrequency}
            </p>
            <h3 className="about-education-institution">
              {ABOUT_EDUCATION.achievements.hackathonPlacement}
            </h3>
            <p className="about-education-program">
              {ABOUT_EDUCATION.achievements.hackathonResult}
            </p>
          </article>
        </div>
      )}
    </div>
  </div>
);

const LinksDetails: React.FC = () => (
  <div className="about-panel-static-details">
    <p className="about-panel-eyebrow">Elsewhere on the internet</p>
    <div className="about-links-list">
      {ABOUT_LINKS.map((link) => (
        <a
          key={link.label}
          className="about-social-link"
          href={getLinkHref(link.href, link.usesBasePath)}
          target={link.newTab ? "_blank" : undefined}
          rel={link.newTab ? "noreferrer" : undefined}
        >
          <span>
            <strong>{link.label}</strong>
            <small>{link.detail}</small>
          </span>
          <span className="about-social-link-arrow" aria-hidden="true">
            &gt;
          </span>
        </a>
      ))}
    </div>
  </div>
);

/**
 * Renders the complete chamber content for the selected About view.
 */
const AboutPanelContent: React.FC<AboutPanelContentProps> = ({
  educationArtwork,
  educationDetails,
  nowDetails,
  panelId,
}) => {
  if (panelId === "education") {
    return (
      <EducationDetails
        artwork={educationArtwork}
        details={educationDetails}
      />
    );
  }

  if (panelId === "links") {
    return (
      <AboutMeContent
        heading={["FIND", "ME"]}
        details={<LinksDetails />}
      />
    );
  }

  return <AboutMeContent details={nowDetails} />;
};

export default AboutPanelContent;
