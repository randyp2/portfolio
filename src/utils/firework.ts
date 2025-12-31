// @ts-expect-error - canvas-confetti lacks type definitions
import confetti from "canvas-confetti"

export const launchFireworks = () => {
  const duration = 2000; // 2 seconds
  const animationEnd = Date.now() + duration;

  const frame = () => {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) return;

    const particleCount = 10 * (timeLeft / duration);
    confetti({
      particleCount,
      spread: 70,
      origin: { y: 0.6 },
    });

    requestAnimationFrame(frame);
  };

  frame();
};