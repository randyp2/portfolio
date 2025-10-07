import { create } from "zustand";
import { type SectionId, SECTION_X } from "../typesConstants";

interface WorldState {
    ballX: number;
    ballY: number;
    cameraX: number;
    sections: Record<SectionId, { x: number }>;
    isJumping: boolean;
    setBallPosition: (x: number, y: number) => void;
    setCameraX: (x: number) => void;
    reset: () => void;
    jumpTo: (section: SectionId) => void;
}
  
export const useWorldStore = create<WorldState>((set) => ({
    ballX: 100,
    ballY: window.innerHeight - 100,
    cameraX: 0,
    isJumping: false,
    sections: {
        about: { x: SECTION_X.about },
        projects: { x: SECTION_X.projects },
        skills: { x: SECTION_X.skills },
        contact: { x: SECTION_X.contact },
        thanks: { x: SECTION_X.thanks },
    },
    setBallPosition: (x, y) => set({ ballX: x, ballY: y, isJumping: false }),
    setCameraX: (x) => set({ cameraX: x }),
    reset: () => set({ ballX: 0, ballY: window.innerHeight - 100, cameraX: 0, isJumping: true }),
    jumpTo: (section) => {
        
        const targetX: number = SECTION_X[section];
        console.log(targetX);
        const ballOffset: number = 100;
        // set({ cameraX: targetX, ballX: targetX + 100, ballY: window.innerHeight - 100 });
        // set({ isJumping: true }); // Indicate move done through navbar
        set({
            ballX: targetX - ballOffset,
            ballY: window.innerHeight - 100,
            cameraX: targetX - ballOffset, // Keep camera following ball
            isJumping: true
          });
    },
}));