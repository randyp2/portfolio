/**
 * Reports whether a circle touches or overlaps an axis-aligned rectangle.
 *
 * The closest-point check avoids the corner false positives produced by
 * comparing horizontal and vertical overlap independently.
 */
export const circleIntersectsRect = (
  circleX: number,
  circleY: number,
  radius: number,
  left: number,
  right: number,
  top: number,
  bottom: number,
): boolean => {
  const closestX = Math.max(left, Math.min(circleX, right));
  const closestY = Math.max(top, Math.min(circleY, bottom));
  const distanceX = circleX - closestX;
  const distanceY = circleY - closestY;

  return distanceX * distanceX + distanceY * distanceY <= radius * radius;
};
