import React from "react";
import type { SimplePhysics } from "../physics/SimplePhysics";
interface SkillColumnProps {
    centerX: number;
    ballX: number;
    title: string;
    skills: string[];
    physics: SimplePhysics | null;
    onSpawn: () => void;
    showArrow?: boolean;
}
declare const SkillColumn: React.FC<SkillColumnProps>;
export default SkillColumn;
