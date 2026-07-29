import {
  useState,
  type MouseEvent,
  type ReactNode,
} from "react";
import {
  ExternalLink,
  FileText,
  Github,
  Linkedin,
  Youtube,
  type LucideIcon,
} from "lucide-react";
import {
  ABOUT_EDUCATION,
  ABOUT_LINKS,
  type AboutPanelId,
} from "../content/about";
import { UNLV_ASCII_ART } from "../content/educationAsciiArt";
import { useMediaQuery } from "../hooks/useMediaQuery";
import { useWorldStore } from "../state/useWorldStore";
import AboutMeContent from "./AboutMeContent";
import EducationPixelIcon from "./EducationPixelIcon";
import GitHubActivityChart from "./GitHubActivityChart";
import GitHubRecentRepositories from "./GitHubRecentRepositories";
import {
  LinkedInExperiencePreview,
  LinkedInRecentWinPost,
  type LinkedInPreviewDestination,
} from "./LinkedInPreview";
import {
  YouTubeChannelPreview,
  YouTubeHeadingPreview,
} from "./YouTubePreview";

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

const LINK_ICONS: Record<
  (typeof ABOUT_LINKS)[number]["label"],
  LucideIcon
> = {
  GitHub: Github,
  LinkedIn: Linkedin,
  Resume: FileText,
  YouTube: Youtube,
};

type AboutLink = (typeof ABOUT_LINKS)[number];
type AboutLinkLabel = AboutLink["label"];

const SOCIAL_PREVIEW_COPY: Record<
  Extract<AboutLinkLabel, "Resume">,
  {
    action: string;
    description: string;
    eyebrow: string;
    title: string;
  }
> = {
  Resume: {
    action: "View resume",
    description:
      "A quick look at my engineering work, leadership, and education.",
    eyebrow: "Current resume",
    title: "Experience, in one file.",
  },
};

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

interface LinksDetailsProps {
  activeLink: AboutLink | null;
  handleLinkClick: (
    event: MouseEvent<HTMLAnchorElement>,
    label: AboutLinkLabel,
  ) => void;
  navigateFromLinkedIn: (
    destination: LinkedInPreviewDestination,
  ) => void;
  isTouchInput: boolean;
  selectLink: (label: AboutLinkLabel) => void;
}

interface SocialLinkPreviewProps {
  link: Extract<AboutLink, { label: "Resume" }>;
}

const SocialLinkPreview: React.FC<SocialLinkPreviewProps> = ({
  link,
}) => {
  const LinkIcon = LINK_ICONS[link.label];
  const copy = SOCIAL_PREVIEW_COPY[link.label];

  return (
    <a
      id="social-link-preview"
      className="about-social-selection-preview"
      href={getLinkHref(link.href, link.usesBasePath)}
      target={link.newTab ? "_blank" : undefined}
      rel={link.newTab ? "noreferrer" : undefined}
    >
      <span className="about-social-selection-icon" aria-hidden="true">
        <LinkIcon />
      </span>
      <span className="about-social-selection-copy">
        <small>{copy.eyebrow}</small>
        <strong>{copy.title}</strong>
        <span>{copy.description}</span>
      </span>
      <span className="about-social-selection-action">
        {copy.action} <span aria-hidden="true">&gt;</span>
      </span>
    </a>
  );
};

const LinksDetails: React.FC<LinksDetailsProps> = ({
  activeLink,
  handleLinkClick,
  navigateFromLinkedIn,
  isTouchInput,
  selectLink,
}) => (
  <div className="about-panel-static-details">
    <p className="about-panel-eyebrow">Elsewhere on the internet</p>
    <div className="about-links-list">
      {ABOUT_LINKS.map((link) => {
        const LinkIcon = LINK_ICONS[link.label];
        const isGitHubLink = link.label === "GitHub";
        const isLinkedInLink = link.label === "LinkedIn";
        const isSelected = activeLink?.label === link.label;

        return (
          <div
            key={link.label}
            className="about-social-link-region"
            onMouseEnter={() => {
              if (!isTouchInput) selectLink(link.label);
            }}
          >
            <a
              className={`about-social-link ${
                isSelected ? "is-selected" : ""
              }`}
              href={getLinkHref(link.href, link.usesBasePath)}
              target={link.newTab ? "_blank" : undefined}
              rel={link.newTab ? "noreferrer" : undefined}
              aria-controls={
                isGitHubLink
                  ? "github-repository-preview github-activity-preview"
                  : isLinkedInLink
                    ? "linkedin-post-preview social-link-preview"
                    : link.label === "YouTube"
                      ? "youtube-channel-card youtube-channel-preview"
                      : "social-link-preview"
              }
              aria-expanded={isSelected}
              onClick={(event) =>
                handleLinkClick(event, link.label)
              }
              onFocus={() => selectLink(link.label)}
            >
              <span className="about-social-link-content">
                <span
                  className="about-social-link-icon"
                  aria-hidden="true"
                >
                  <LinkIcon />
                </span>
                <span>
                  <strong>{link.label}</strong>
                  <small>
                    {isGitHubLink
                      ? "Preview repository + activity"
                      : link.detail}
                  </small>
                </span>
              </span>
              <span
                className="about-social-link-arrow"
                aria-hidden="true"
              >
                &gt;
              </span>
            </a>
          </div>
        );
      })}
    </div>

    {isTouchInput && activeLink ? (
      <a
        className="about-social-mobile-action"
        href={getLinkHref(
          activeLink.href,
          activeLink.usesBasePath,
        )}
        target={activeLink.newTab ? "_blank" : undefined}
        rel={activeLink.newTab ? "noreferrer" : undefined}
      >
        <span>Open {activeLink.label}</span>
        <ExternalLink aria-hidden="true" />
      </a>
    ) : null}

    {activeLink?.label === "GitHub" ? (
      <div
        id="github-activity-preview"
        className="github-activity-preview"
      >
        <GitHubActivityChart username="randyp2" />
      </div>
    ) : activeLink?.label === "LinkedIn" ? (
      <LinkedInExperiencePreview
        onNavigate={navigateFromLinkedIn}
      />
    ) : activeLink?.label === "YouTube" ? (
      <YouTubeChannelPreview />
    ) : activeLink ? (
      <SocialLinkPreview link={activeLink} />
    ) : (
      <p className="about-social-hover-prompt">
        {isTouchInput ? "Tap a link to preview:" : "Hover over a link:"}
        <span className="terminal-cursor" />
      </p>
    )}
  </div>
);

const LinksPanel: React.FC = () => {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const isTouchInput = useMediaQuery(
    "(hover: none), (pointer: coarse)",
  );
  const jumpTo = useWorldStore((state) => state.jumpTo);
  const [activeLinkLabel, setActiveLinkLabel] =
    useState<AboutLinkLabel | null>(null);
  const activeLink =
    ABOUT_LINKS.find((link) => link.label === activeLinkLabel) ??
    null;

  const handleLinkClick = (
    event: MouseEvent<HTMLAnchorElement>,
    label: AboutLinkLabel,
  ) => {
    if (isTouchInput) {
      event.preventDefault();
      setActiveLinkLabel(label);
    }
  };

  const handleLinkedInNavigation = (
    destination: LinkedInPreviewDestination,
  ) => {
    if (isDesktop) {
      jumpTo(destination);
      return;
    }

    const section = document.getElementById(destination);
    if (!section) return;

    const navbarOffset = 72;
    const offsetPosition =
      section.getBoundingClientRect().top +
      window.scrollY -
      navbarOffset;
    window.scrollTo({ top: offsetPosition, behavior: "smooth" });
  };

  return (
    <div className="about-social-panel">
      <AboutMeContent
        heading={["FIND", "ME"]}
        headingDetails={
          activeLinkLabel === "GitHub" ? (
            <div
              id="github-repository-preview"
              className="github-repository-preview"
            >
              <GitHubRecentRepositories username="randyp2" />
            </div>
          ) : activeLinkLabel === "LinkedIn" ? (
            <div
              id="linkedin-post-preview"
              className="linkedin-post-preview"
            >
              <LinkedInRecentWinPost
                onNavigate={handleLinkedInNavigation}
              />
            </div>
          ) : activeLinkLabel === "YouTube" ? (
            <YouTubeHeadingPreview />
          ) : null
        }
        details={
          <LinksDetails
            activeLink={activeLink}
            handleLinkClick={handleLinkClick}
            navigateFromLinkedIn={handleLinkedInNavigation}
            isTouchInput={isTouchInput}
            selectLink={setActiveLinkLabel}
          />
        }
      />
    </div>
  );
};

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
    return <LinksPanel />;
  }

  return <AboutMeContent details={nowDetails} />;
};

export default AboutPanelContent;
