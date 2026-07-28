import {
  motion,
  useReducedMotion,
} from "framer-motion";
import React, { useState } from "react";
import {
  EXPERIENCE_PATH,
  type ExperiencePathItem,
} from "../content/experience";
import { EXPERIENCE_SECTION_IDS } from "../typesConstants";

interface ExperienceCheckpointProps {
  expanded: boolean;
  index: number;
  item: ExperiencePathItem;
  onSelect: () => void;
  onToggle: () => void;
  total: number;
}

interface ExperiencePathProps {
  items?: readonly ExperiencePathItem[];
}

interface CheckpointMarkerProps {
  checkpointNumber: string;
}

const CheckpointMarker: React.FC<CheckpointMarkerProps> = ({
  checkpointNumber,
}) => (
  <span className="experience-stop-marker">
    <span>{checkpointNumber}</span>
  </span>
);

/**
 * Renders one interactive stop on the experience journey.
 */
export const ExperienceCheckpoint: React.FC<
  ExperienceCheckpointProps
> = ({
  expanded,
  index,
  item,
  onSelect,
  onToggle,
  total,
}) => {
  const checkpointNumber = String(index + 1).padStart(2, "0");
  const shouldReduceMotion = useReducedMotion();
  const markerTransition = shouldReduceMotion
    ? { duration: 0 }
    : {
        layout: {
          duration: 0.44,
          ease: [0.22, 1, 0.36, 1] as const,
          type: "tween" as const,
        },
      };

  return (
    <div
      className="experience-stop-layout"
      data-expanded={expanded}
    >
      <motion.button
        layout="position"
        className={
          expanded
            ? "experience-stop-panel-marker"
            : "experience-stop-marker-button"
        }
        type="button"
        aria-expanded={expanded}
        aria-label={`${expanded ? "Collapse" : "Expand"} ${item.role} details`}
        onClick={expanded ? onToggle : onSelect}
        transition={markerTransition}
      >
        <CheckpointMarker checkpointNumber={checkpointNumber} />
        {!expanded ? (
          <>
            <span
              className="experience-stop-dot"
              aria-hidden="true"
            />
            <span className="experience-stop-inspect">
              Inspect
            </span>
          </>
        ) : null}
      </motion.button>

      {expanded ? (
        <motion.article
          key={`${item.role}-panel`}
          className="experience-stop-card"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : {
                  delay: 0.44,
                  duration: 0.3,
                  ease: "easeOut",
                }
          }
        >
          <header className="experience-stop-meta">
            <span>
              Checkpoint {checkpointNumber} /{" "}
              {String(total).padStart(2, "0")}
            </span>
            <span className="experience-stop-status">
              <i aria-hidden="true" />
              Log active
            </span>
            <time>{item.period}</time>
          </header>

          <p className="experience-stop-organization">
            {item.organization}
          </p>
          <h3 className="experience-stop-role">{item.role}</h3>
          <p className="experience-stop-summary">{item.summary}</p>

          <div className="experience-stop-expanded">
            <ul className="experience-stop-details">
              {item.details.map((detail) => (
                <li key={detail}>{detail}</li>
              ))}
            </ul>
            <ul
              className="experience-stop-tags"
              aria-label={`${item.role} technologies and outcomes`}
            >
              {item.tags.map((tag) => (
                <li key={tag}>{tag}</li>
              ))}
            </ul>
          </div>

          <button
            className="experience-stop-toggle"
            type="button"
            aria-expanded="true"
            onClick={onToggle}
          >
            Collapse checkpoint [-]
          </button>
        </motion.article>
      ) : null}
    </div>
  );
};

/**
 * Renders the experience journey as a vertical route on mobile.
 */
const ExperiencePath: React.FC<ExperiencePathProps> = ({
  items = EXPERIENCE_PATH,
}) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(
    null,
  );

  return (
    <ol className="experience-mobile-route">
      {items.map((item, index) => (
        <li
          key={`${item.organization}-${item.role}`}
          id={
            index === 0
              ? undefined
              : EXPERIENCE_SECTION_IDS[index]
          }
        >
          <ExperienceCheckpoint
            expanded={expandedIndex === index}
            index={index}
            item={item}
            onSelect={() => {
              setExpandedIndex((currentIndex) =>
                currentIndex === index ? null : index,
              );
            }}
            onToggle={() => {
              setExpandedIndex((currentIndex) =>
                currentIndex === index ? null : index,
              );
            }}
            total={items.length}
          />
        </li>
      ))}
    </ol>
  );
};

export default ExperiencePath;
