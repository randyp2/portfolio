import React from "react";
import { type COLLIDERES_RECT } from "../typesConstants";
interface ContactProps {
    centerX: number;
    ballX: number;
    ballY?: number;
    cameraX: number;
    viewportCenterX: number;
    onBoundsChange?: (bounds: COLLIDERES_RECT) => void;
}
declare const Contact: React.FC<ContactProps>;
export default Contact;
