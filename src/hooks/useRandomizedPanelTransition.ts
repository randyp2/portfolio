import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type RefObject,
} from "react";

const DISSOLVE_DURATION_MS = 520;
const REVEAL_DURATION_MS = 900;
const MAX_CONTENT_READY_WAIT_MS = 800;
const TRANSITION_EXCLUDED_SELECTOR = ".about-education-ascii";

type TransitionPhase = "dissolve" | "reveal";

interface RandomizedPanelTransition<T extends string> {
  activeValue: T;
  isTransitioning: boolean;
  panelRef: RefObject<HTMLDivElement | null>;
  requestValue: (nextValue: T) => void;
  selectedValue: T;
}

const shuffleElements = (
  elements: HTMLElement[],
): HTMLElement[] => {
  const shuffledElements = [...elements];

  for (let index = shuffledElements.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffledElements[index], shuffledElements[randomIndex]] = [
      shuffledElements[randomIndex],
      shuffledElements[index],
    ];
  }

  return shuffledElements;
};

const wrapVisibleCharacters = (root: HTMLElement): HTMLElement[] => {
  const walker = document.createTreeWalker(
    root,
    NodeFilter.SHOW_TEXT,
  );
  const textNodes: Text[] = [];

  while (walker.nextNode()) {
    const textNode = walker.currentNode as Text;
    const parent = textNode.parentElement;
    if (
      !textNode.data.trim() ||
      !parent ||
      parent.closest(
        `.sr-only, .invisible, [hidden], ${TRANSITION_EXCLUDED_SELECTOR}`,
      )
    ) {
      continue;
    }
    textNodes.push(textNode);
  }

  const characters: HTMLElement[] = [];

  textNodes.forEach((textNode) => {
    const fragment = document.createDocumentFragment();
    let word: HTMLSpanElement | null = null;

    Array.from(textNode.data).forEach((character) => {
      if (/\s/.test(character)) {
        word = null;
        fragment.append(character);
        return;
      }

      if (!word) {
        word = document.createElement("span");
        word.className = "about-panel-transition-word";
        fragment.append(word);
      }

      const characterElement = document.createElement("span");
      characterElement.className =
        "about-panel-transition-character";
      characterElement.textContent = character;
      word.append(characterElement);
      characters.push(characterElement);
    });

    textNode.replaceWith(fragment);
  });

  return characters;
};

const createTransitionLayer = (
  panel: HTMLDivElement,
  phase: TransitionPhase,
): {
  characters: HTMLElement[];
  layer: HTMLDivElement;
} | null => {
  const host = panel.parentElement;
  if (!host) return null;

  const layer = panel.cloneNode(true) as HTMLDivElement;
  layer.removeAttribute("aria-live");
  layer.setAttribute("aria-hidden", "true");
  layer.classList.remove("is-transition-hidden");
  layer.classList.add("about-panel-transition-layer");
  layer.dataset.transitionPhase = phase;

  const characters = wrapVisibleCharacters(layer);
  if (phase === "reveal") {
    characters.forEach((character) => {
      character.classList.add("is-hidden");
    });
  }

  host.append(layer);
  panel.classList.add("is-transition-hidden");

  return { characters, layer };
};

const animateCharacters = (
  characters: HTMLElement[],
  duration: number,
  phase: TransitionPhase,
  signal: AbortSignal,
): Promise<void> =>
  new Promise((resolve) => {
    if (characters.length === 0 || signal.aborted) {
      resolve();
      return;
    }

    const shuffledCharacters = shuffleElements(characters);
    let animationFrameId = 0;
    let processedCharacters = 0;
    let startTime: number | undefined;

    const finish = () => {
      cancelAnimationFrame(animationFrameId);
      signal.removeEventListener("abort", finish);
      resolve();
    };

    const renderFrame = (timestamp: number) => {
      startTime ??= timestamp;
      const progress = Math.min(
        1,
        (timestamp - startTime) / duration,
      );
      const targetCount = Math.floor(
        shuffledCharacters.length * progress,
      );

      while (processedCharacters < targetCount) {
        shuffledCharacters[processedCharacters].classList.toggle(
          "is-hidden",
          phase === "dissolve",
        );
        processedCharacters += 1;
      }

      if (progress >= 1) {
        while (processedCharacters < shuffledCharacters.length) {
          shuffledCharacters[processedCharacters].classList.toggle(
            "is-hidden",
            phase === "dissolve",
          );
          processedCharacters += 1;
        }
        finish();
        return;
      }

      animationFrameId = requestAnimationFrame(renderFrame);
    };

    signal.addEventListener("abort", finish, { once: true });
    animationFrameId = requestAnimationFrame(renderFrame);
  });

const waitForPanelContent = (
  panel: HTMLDivElement,
  signal: AbortSignal,
): Promise<void> =>
  new Promise((resolve) => {
    const startTime = performance.now();
    let animationFrameId = 0;

    const finish = () => {
      cancelAnimationFrame(animationFrameId);
      signal.removeEventListener("abort", finish);
      resolve();
    };

    const checkContent = () => {
      const dynamicContainers = Array.from(
        panel.querySelectorAll<HTMLElement>(
          ".dynamic-about-details, .dynamic-education-details",
        ),
      );
      const dynamicContentReady = dynamicContainers.every(
        (container) => container.childElementCount > 0,
      );
      const timedOut =
        performance.now() - startTime >= MAX_CONTENT_READY_WAIT_MS;

      if (
        signal.aborted ||
        dynamicContentReady ||
        timedOut
      ) {
        finish();
        return;
      }

      animationFrameId = requestAnimationFrame(checkContent);
    };

    signal.addEventListener("abort", finish, { once: true });
    animationFrameId = requestAnimationFrame(checkContent);
  });

/**
 * Coordinates randomized character transitions between panel values.
 */
export const useRandomizedPanelTransition = <T extends string>(
  initialValue: T,
): RandomizedPanelTransition<T> => {
  const panelRef = useRef<HTMLDivElement>(null);
  const selectedValueRef = useRef(initialValue);
  const transitionControllerRef = useRef<AbortController | null>(
    null,
  );
  const mountedRef = useRef(true);
  const [activeValue, setActiveValue] = useState(initialValue);
  const [selectedValue, setSelectedValue] = useState(initialValue);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    mountedRef.current = true;
    const panel = panelRef.current;

    return () => {
      mountedRef.current = false;
      transitionControllerRef.current?.abort();
      panel?.classList.remove("is-transition-hidden");
    };
  }, []);

  const requestValue = useCallback((nextValue: T) => {
    if (
      nextValue === selectedValueRef.current ||
      transitionControllerRef.current
    ) {
      return;
    }

    const panel = panelRef.current;
    if (!panel) {
      selectedValueRef.current = nextValue;
      setActiveValue(nextValue);
      setSelectedValue(nextValue);
      return;
    }

    selectedValueRef.current = nextValue;
    setSelectedValue(nextValue);

    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setActiveValue(nextValue);
      return;
    }

    const controller = new AbortController();
    transitionControllerRef.current = controller;
    setIsTransitioning(true);

    void (async () => {
      let transitionLayer: HTMLDivElement | null = null;

      try {
        const dissolve = createTransitionLayer(panel, "dissolve");
        transitionLayer = dissolve?.layer ?? null;
        if (dissolve) {
          await animateCharacters(
            dissolve.characters,
            DISSOLVE_DURATION_MS,
            "dissolve",
            controller.signal,
          );
        }

        transitionLayer?.remove();
        transitionLayer = null;
        if (controller.signal.aborted) return;

        setActiveValue(nextValue);

        await waitForPanelContent(panel, controller.signal);
        if (controller.signal.aborted) return;

        const reveal = createTransitionLayer(panel, "reveal");
        transitionLayer = reveal?.layer ?? null;
        if (reveal) {
          await animateCharacters(
            reveal.characters,
            REVEAL_DURATION_MS,
            "reveal",
            controller.signal,
          );
        }
      } finally {
        transitionLayer?.remove();
        panel.classList.remove("is-transition-hidden");

        if (
          mountedRef.current &&
          transitionControllerRef.current === controller
        ) {
          transitionControllerRef.current = null;
          setIsTransitioning(false);
        }
      }
    })();
  }, []);

  return {
    activeValue,
    isTransitioning,
    panelRef,
    requestValue,
    selectedValue,
  };
};
