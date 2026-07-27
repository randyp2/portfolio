import { useEffect, useRef } from "react";

const COMMAND_TEXT = "$ whoami";
const HEADLINE_TEXT = "Coding is a love-hate relationship.";
const PUNCHLINE_TEXT = "Ironically, I chose to do it for a living.";
const NAME_TEXT = "Randy Pahang II";
const ROLE_TEXT = "Software Engineer";
const INITIAL_REVEAL_DELAY_MS = 100;
const MIN_REVEAL_GAP_MS = 8;
const REVEAL_GAP_VARIANCE_MS = 16;

interface HeroCopyProps {
  className?: string;
  onRevealComplete?: () => void;
}

interface RevealTextProps {
  text: string;
}

const RevealText: React.FC<RevealTextProps> = ({ text }) => {
  const words = text.split(" ");

  return (
    <span aria-hidden="true">
      {words.map((word, wordIndex) => (
        <span key={`${word}-${wordIndex}`}>
          <span className="hero-reveal-word">
            {Array.from(word).map((character, characterIndex) => (
              <span
                key={`${character}-${characterIndex}`}
                className="hero-reveal-character"
                data-hero-reveal-character
              >
                {character}
              </span>
            ))}
          </span>
          {wordIndex < words.length - 1 ? " " : null}
        </span>
      ))}
    </span>
  );
};

const shuffleCharacters = (characters: HTMLElement[]): HTMLElement[] => {
  const shuffledCharacters = [...characters];

  for (let index = shuffledCharacters.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffledCharacters[index], shuffledCharacters[randomIndex]] = [
      shuffledCharacters[randomIndex],
      shuffledCharacters[index],
    ];
  }

  return shuffledCharacters;
};

/**
 * Reveals the primary hero statement in a shuffled character sequence.
 */
const HeroCopy: React.FC<HeroCopyProps> = ({
  className = "",
  onRevealComplete,
}) => {
  const copyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const copyElement = copyRef.current;
    if (!copyElement) return;

    const characters = Array.from(
      copyElement.querySelectorAll<HTMLElement>("[data-hero-reveal-character]"),
    );

    characters.forEach((character) => {
      character.classList.remove("is-visible");
    });

    const shuffledCharacters = shuffleCharacters(characters);
    const revealSchedule = shuffledCharacters.map((character, index) => {
      const previousRevealTime = index === 0 ? INITIAL_REVEAL_DELAY_MS : 0;
      const randomGap =
        MIN_REVEAL_GAP_MS + Math.random() * REVEAL_GAP_VARIANCE_MS;

      return {
        character,
        revealAt: previousRevealTime + randomGap,
      };
    });

    for (let index = 1; index < revealSchedule.length; index += 1) {
      revealSchedule[index].revealAt += revealSchedule[index - 1].revealAt;
    }

    if (revealSchedule.length === 0) {
      onRevealComplete?.();
      return;
    }

    let animationFrameId = 0;
    let nextCharacterIndex = 0;
    let startTime: number | undefined;

    const revealCharacters = (timestamp: number) => {
      startTime ??= timestamp;
      const elapsedTime = timestamp - startTime;

      while (
        nextCharacterIndex < revealSchedule.length &&
        elapsedTime >= revealSchedule[nextCharacterIndex].revealAt
      ) {
        revealSchedule[nextCharacterIndex].character.classList.add(
          "is-visible",
        );
        nextCharacterIndex += 1;
      }

      if (nextCharacterIndex >= revealSchedule.length) {
        onRevealComplete?.();
        return;
      }

      animationFrameId = requestAnimationFrame(revealCharacters);
    };

    animationFrameId = requestAnimationFrame(revealCharacters);

    return () => cancelAnimationFrame(animationFrameId);
  }, [onRevealComplete]);

  return (
    <div ref={copyRef} className={`hero-copy ${className}`.trim()}>
      <p className="hero-command" aria-label={COMMAND_TEXT}>
        <RevealText text={COMMAND_TEXT} />
      </p>
      <h1
        className="hero-headline"
        aria-label={`${HEADLINE_TEXT} ${PUNCHLINE_TEXT}`}
      >
        <span className="hero-headline-line">
          <RevealText text={HEADLINE_TEXT} />
        </span>
        <span className="hero-headline-line hero-headline-punchline">
          <RevealText text={PUNCHLINE_TEXT} />
        </span>
      </h1>
      <div className="hero-identity">
        <p aria-label={NAME_TEXT}>
          <RevealText text={NAME_TEXT} />
        </p>
        <p aria-label={ROLE_TEXT}>
          <RevealText text={ROLE_TEXT} />
        </p>
      </div>
    </div>
  );
};

export default HeroCopy;
