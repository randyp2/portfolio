/**
 * Renders a crisp, block-pixel arrow for horizontal navigation cues.
 */
const PixelArrow: React.FC = () => {
  return (
    <svg
      className="hero-pixel-arrow"
      viewBox="0 0 128 64"
      aria-hidden="true"
      shapeRendering="crispEdges"
    >
      <path
        fill="currentColor"
        d="M0 24h72V8h16v8h16v8h16v8h8v8h-8v8h-16v8H88v8H72V40H0z"
      />
    </svg>
  );
};

export default PixelArrow;
