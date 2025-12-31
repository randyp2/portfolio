import React from "react";
import { SimplePhysics } from "../physics/SimplePhysics";
interface BallProps {
    physics: SimplePhysics;
    viewportCenterX: number;
    cameraX: number;
    onLaunch: (vx: number, vy: number) => void;
    isLaunching: boolean;
    ballRef: React.RefObject<HTMLDivElement | null>;
}
declare const Ball: React.FC<BallProps>;
export default Ball;
