export declare const GRAVITY_Y = 2880;
export declare const RESTITUTION = 0.6;
export declare const BLOCK_RESTITUTION = 0.5;
export declare const MAX_LAUNCH_SPEED = 3600;
export declare const COEFFICIENT_OF_FRICTION = 0.0005;
export declare const SECTION_SPACING_MULTIPLIER = 1.6;
export declare const SKILL_SECTION_SPACING_MULTIPLIER = 0.5;
export declare const SECTION_ORDER: readonly ["intro", "about", "projects", "languages", "tools", "frameworks", "contact", "thanks"];
export type SectionId = (typeof SECTION_ORDER)[number];
export declare const FADE_RADIUS = 1500;
export declare const BALL_RADIUS = 18;
export declare const CAMERA_LERP = 0.18;
export type COLLIDERES_RECT = {
    title: string;
    x1: number;
    x2: number;
    y1: number;
    y2: number;
};
