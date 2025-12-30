export const GRAVITY_Y = 0.8;
export const RESTITUTION = 0.6;
export const BLOCK_RESTITUTION = 0.2;
export const MAX_LAUNCH_SPEED = 60;
export const COEFFICIENT_OF_FRICTION = 0.02; // Friction applied to horizontal movement
// export const SECTION_X = {
//   intro: 0,
//   about: 1600,
//   projects: 3200,
//   skills: 4800,
//   contact: 6400,
//   thanks: 8000,
// } as const;
export const SECTION_SPACING_MULTIPLIER = 1.6; // Multiplier for spacing between sections
export const SKILL_SECTION_SPACING_MULTIPLIER = 0.5; // Smaller spacing for skill sections (closer together)
export const SECTION_ORDER = [
  "intro",
  "about",
  "projects",
  "languages",
  "tools",
  "frameworks",
  "contact",
  "thanks",
] as const;
export type SectionId = (typeof SECTION_ORDER)[number];

export const FADE_RADIUS = 1500; // How far sections shoudl fade in/out based on distance from ball
export const BALL_RADIUS = 18;
export const CAMERA_LERP = 0.18; // Move 18% of distance towards ball for each frame

// export type SectionId = keyof typeof SECTION_X;

export type COLLIDERES_RECT = {
  title: string;
  x1: number;
  x2: number;
  y1: number;
  y2: number;
};

