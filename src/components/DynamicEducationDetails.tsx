import type { RefObject } from "react";
import { ABOUT_EDUCATION } from "../content/about";
import type { BallCoordinates } from "../typesConstants";
import DynamicAboutDetails, {
  type DynamicTextBlock,
} from "./DynamicAboutDetails";
import EducationPixelIcon from "./EducationPixelIcon";

const LABEL_CLASS_NAME =
  "about-education-period text-[0.68rem] font-bold tracking-[0.12em] text-[var(--terminal-muted)]";
const PRIMARY_CLASS_NAME =
  "about-education-institution text-[clamp(1.15rem,1.7vw,1.55rem)] font-bold text-[var(--terminal-text)]";
const ACCENT_CLASS_NAME =
  "about-education-program text-[0.78rem] font-bold uppercase tracking-[0.1em] text-[var(--terminal-green)]";
const DETAIL_CLASS_NAME =
  "about-readable-copy text-[0.95rem] leading-[1.55] text-[var(--terminal-muted)]";

const DEGREE_TEXT_BLOCKS: readonly DynamicTextBlock[] = [
  {
    id: "education-graduation-label",
    className: LABEL_CLASS_NAME,
    gapBefore: 0,
    text: "EXPECTED GRADUATION",
  },
  {
    id: "education-graduation",
    className: PRIMARY_CLASS_NAME,
    gapBefore: 6,
    text: ABOUT_EDUCATION.expectedGraduation,
  },
  {
    id: "education-degree",
    className: ACCENT_CLASS_NAME,
    gapBefore: 8,
    text: ABOUT_EDUCATION.degree.toUpperCase(),
  },
  {
    id: "education-institution",
    className: DETAIL_CLASS_NAME,
    gapBefore: 8,
    text: ABOUT_EDUCATION.institution,
  },
  {
    id: "education-honors-college",
    className: ACCENT_CLASS_NAME,
    gapBefore: 8,
    text: ABOUT_EDUCATION.honorsCollege.toUpperCase(),
  },
];

const ACHIEVEMENT_TEXT_BLOCKS: readonly DynamicTextBlock[] = [
  {
    id: "education-gpa",
    className: PRIMARY_CLASS_NAME,
    gapBefore: 0,
    text: ABOUT_EDUCATION.achievements.gpa,
  },
  {
    id: "education-deans-list",
    className: ACCENT_CLASS_NAME,
    gapBefore: 8,
    text: ABOUT_EDUCATION.achievements.deansList.toUpperCase(),
  },
  {
    id: "education-deans-list-frequency",
    className: DETAIL_CLASS_NAME,
    gapBefore: 8,
    text: ABOUT_EDUCATION.achievements.deansListFrequency,
  },
  {
    id: "education-hackathon-placement",
    className: PRIMARY_CLASS_NAME,
    gapBefore: 14,
    text: ABOUT_EDUCATION.achievements.hackathonPlacement,
  },
  {
    id: "education-hackathon-result",
    className: ACCENT_CLASS_NAME,
    gapBefore: 8,
    text: ABOUT_EDUCATION.achievements.hackathonResult.toUpperCase(),
  },
];

const LEADERSHIP_TEXT_BLOCKS: readonly DynamicTextBlock[] = [
  {
    id: "education-leadership-role",
    className: PRIMARY_CLASS_NAME,
    gapBefore: 0,
    text: ABOUT_EDUCATION.leadership.role,
  },
  {
    id: "education-leadership-organization",
    className: ACCENT_CLASS_NAME,
    gapBefore: 8,
    text: ABOUT_EDUCATION.leadership.organization.toUpperCase(),
  },
  {
    id: "education-leadership-affiliation",
    className: DETAIL_CLASS_NAME,
    gapBefore: 8,
    text: ABOUT_EDUCATION.leadership.affiliation,
  },
  {
    id: "education-leadership-workshops",
    className: DETAIL_CLASS_NAME,
    gapBefore: 8,
    text: ABOUT_EDUCATION.leadership.workshops,
  },
  {
    id: "education-leadership-team",
    className: DETAIL_CLASS_NAME,
    gapBefore: 8,
    text: ABOUT_EDUCATION.leadership.teamLeadership,
  },
];

const EDUCATION_GROUPS = [
  {
    id: "degree",
    label: "Degree",
    icon: "degree",
    blocks: DEGREE_TEXT_BLOCKS,
    screenReaderLines: [
      "Expected graduation",
      ABOUT_EDUCATION.expectedGraduation,
      ABOUT_EDUCATION.degree,
      ABOUT_EDUCATION.institution,
      ABOUT_EDUCATION.honorsCollege,
    ],
  },
  {
    id: "leadership",
    label: "Leadership",
    icon: "leadership",
    blocks: LEADERSHIP_TEXT_BLOCKS,
    screenReaderLines: [
      ABOUT_EDUCATION.leadership.role,
      ABOUT_EDUCATION.leadership.organization,
      ABOUT_EDUCATION.leadership.affiliation,
      ABOUT_EDUCATION.leadership.workshops,
      ABOUT_EDUCATION.leadership.teamLeadership,
    ],
  },
  {
    id: "achievements",
    label: "Achievements",
    icon: "achievement",
    blocks: ACHIEVEMENT_TEXT_BLOCKS,
    screenReaderLines: [
      ABOUT_EDUCATION.achievements.gpa,
      ABOUT_EDUCATION.achievements.deansList,
      ABOUT_EDUCATION.achievements.deansListFrequency,
      ABOUT_EDUCATION.achievements.hackathonPlacement,
      ABOUT_EDUCATION.achievements.hackathonResult,
    ],
  },
] as const;

interface DynamicEducationDetailsProps {
  ballPositionRef: RefObject<BallCoordinates>;
  sectionCenterX: number;
  sectionRef: RefObject<HTMLElement | null>;
  viewportCenterX: number;
}

/**
 * Reflows the Education records around the live physics ball.
 */
const DynamicEducationDetails: React.FC<
  DynamicEducationDetailsProps
> = ({
  ballPositionRef,
  sectionCenterX,
  sectionRef,
  viewportCenterX,
}) => (
  <div className="dynamic-education-grid">
    {EDUCATION_GROUPS.map((group) => (
      <div
        key={group.id}
        className="dynamic-education-record"
      >
        <div className="about-education-entry-heading">
          <EducationPixelIcon variant={group.icon} />
          <p className="about-panel-eyebrow">{group.label}</p>
        </div>
        <DynamicAboutDetails
          ballPositionRef={ballPositionRef}
          blocks={group.blocks}
          initializationLabel={`Education ${group.label}`}
          screenReaderContent={
            <article>
              <h2>{group.label}</h2>
              {group.screenReaderLines.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </article>
          }
          sectionCenterX={sectionCenterX}
          sectionRef={sectionRef}
          visualClassName="dynamic-education-details relative h-[10rem] w-full"
          viewportCenterX={viewportCenterX}
        />
      </div>
    ))}
  </div>
);

export default DynamicEducationDetails;
