import React from "react";
interface AboutProps {
    centerX: number;
    ballX: number;
    cameraX?: number;
    viewportCenterX?: number;
    onBoundsChange?: (bounds: {
        title: string;
        x1: number;
        x2: number;
        y1: number;
        y2: number;
    }) => void;
}
declare const About: React.FC<AboutProps>;
export default About;
