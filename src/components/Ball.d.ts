import React from "react";
import { SimplePhysics } from "../physics/SimplePhysics";
interface BallProps {
    physics: SimplePhysics;
    onLaunch: (vx: number, vy: number) => void;
    isLaunching: boolean;
    ballRef: React.RefObject<HTMLDivElement | null>;
    isScrolling?: boolean;
}
declare const Ball: React.FC<BallProps>;
export default Ball;
