interface EducationPixelIconProps {
  variant: "achievement" | "degree" | "leadership";
}

/**
 * Renders a crisp pixel-art icon for an Education detail group.
 */
const EducationPixelIcon: React.FC<EducationPixelIconProps> = ({
  variant,
}) => (
  <span className="education-pixel-icon" aria-hidden="true">
    <svg
      viewBox="0 0 16 16"
      fill="currentColor"
      shapeRendering="crispEdges"
    >
      {variant === "degree" ? (
        <path d="M1 5 8 2l7 3-7 3L1 5Zm3 3h2v3h4V8h2v4H4V8Zm9-1h2v6h-2V7Z" />
      ) : variant === "leadership" ? (
        <path d="M2 1h2v2h10v7H4v5H2V1Zm2 4v3h8V5H4Z" />
      ) : (
        <path d="M4 2h8v2h3v5h-3v2h-2v2h3v2H3v-2h3v-2H4V9H1V4h3V2Zm0 4H3v2h1V6Zm8 0v2h1V6h-1Z" />
      )}
    </svg>
  </span>
);

export default EducationPixelIcon;
