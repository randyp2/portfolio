import { create } from "zustand";
import { type SectionId } from "../typesConstants";

interface WorldState {
    ballX: number;
    ballY: number;
    cameraX: number;
    isJumping: boolean;
    isLightboxOpen: boolean;
    sections: Record<SectionId, { x: number }>;

    // Actions
    setBallPosition: (x: number, y: number) => void;
    setCameraX: (x: number) => void;
    setSections: (sections: Record<SectionId, { x: number }>) => void;
    setLightboxOpen: (isOpen: boolean) => void;
    reset: () => void;
    jumpTo: (section: SectionId) => void;
}
  
export const useWorldStore = create<WorldState>((set, get) => ({
    ballX: 100,
    ballY: window.innerHeight - 100,
    cameraX: 0,
    isJumping: false,
    isLightboxOpen: false,
    sections: {
        intro: { x: 0 },
        about: { x: 0 },
        projects: { x: 0 },
        languages: { x: 0 },
        tools: { x: 0 },
        frameworks: { x: 0 },
        contact: { x: 0 },
        thanks: { x: 0 },
    },
    setBallPosition: (x, y) => set({ ballX: x, ballY: y, isJumping: false }),
    setCameraX: (x) => set({ cameraX: x }),
    setSections: (sections: Record<SectionId, { x: number }>) => set({ sections }),
    setLightboxOpen: (isOpen: boolean) => set({ isLightboxOpen: isOpen }),
    reset: () => set({ ballX: 0, ballY: window.innerHeight - 100, cameraX: 0, isJumping: true }),
    jumpTo: (section) => {
        const { sections } = get(); // Get sections of current state
        // const targetX: number = SECTION_X[section];
        const targetX: number = sections[section]?.x ?? 0;
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