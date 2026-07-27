const LOW_GRAVITY_SCALE = 0.28;
const CHAMBER_CENTER_OFFSET_PX = -100;
const MINIMUM_HALF_WIDTH_PX = 360;
const MAXIMUM_HALF_WIDTH_PX = 540;
const VIEWPORT_WIDTH_RATIO = 0.44;
const TRANSITION_WIDTH_PX = 140;

const clamp = (value: number, minimum: number, maximum: number): number =>
  Math.min(maximum, Math.max(minimum, value));

const smoothstep = (progress: number): number =>
  progress * progress * (3 - 2 * progress);

/**
 * Returns the ball's gravity multiplier for the About chamber.
 *
 * Gravity eases between normal and low gravity near the chamber rails so
 * crossing the boundary does not create an abrupt trajectory change.
 */
export const getAboutGravityScale = (
  ballX: number,
  sectionCenterX: number,
  viewportWidth: number,
): number => {
  const chamberCenterX =
    sectionCenterX + CHAMBER_CENTER_OFFSET_PX;
  const chamberHalfWidth = clamp(
    viewportWidth * VIEWPORT_WIDTH_RATIO,
    MINIMUM_HALF_WIDTH_PX,
    MAXIMUM_HALF_WIDTH_PX,
  );
  const distanceFromCenter = Math.abs(ballX - chamberCenterX);
  const transitionProgress = clamp(
    (chamberHalfWidth - distanceFromCenter) /
      TRANSITION_WIDTH_PX,
    0,
    1,
  );
  const chamberInfluence = smoothstep(transitionProgress);

  return 1 - chamberInfluence * (1 - LOW_GRAVITY_SCALE);
};
