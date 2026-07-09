import { useCallback, useEffect, useRef, useState } from "react";

const AUTO_ADVANCE_MS = 7000;
const RESUME_AFTER_INTERACTION_MS = 10000;

type UseHeroSliderOptions = {
  slideCount: number;
  reducedMotion: boolean;
};

function normalizeIndex(index: number, slideCount: number) {
  return (index + slideCount) % slideCount;
}

export function useHeroSlider({ slideCount, reducedMotion }: UseHeroSliderOptions) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(reducedMotion);
  const resumeTimerRef = useRef<number | null>(null);

  const clearResumeTimer = useCallback(() => {
    if (resumeTimerRef.current) {
      window.clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = null;
    }
  }, []);

  const pauseForInteraction = useCallback(() => {
    setIsPaused(true);
    clearResumeTimer();

    if (!reducedMotion) {
      resumeTimerRef.current = window.setTimeout(() => {
        setIsPaused(false);
        resumeTimerRef.current = null;
      }, RESUME_AFTER_INTERACTION_MS);
    }
  }, [clearResumeTimer, reducedMotion]);

  const goToSlide = useCallback(
    (index: number, interaction = true) => {
      setActiveIndex(normalizeIndex(index, slideCount));

      if (interaction) {
        pauseForInteraction();
      }
    },
    [pauseForInteraction, slideCount],
  );

  const goToNext = useCallback(
    (interaction = true) => {
      setActiveIndex((currentIndex) => normalizeIndex(currentIndex + 1, slideCount));

      if (interaction) {
        pauseForInteraction();
      }
    },
    [pauseForInteraction, slideCount],
  );

  const goToPrevious = useCallback(
    (interaction = true) => {
      setActiveIndex((currentIndex) => normalizeIndex(currentIndex - 1, slideCount));

      if (interaction) {
        pauseForInteraction();
      }
    },
    [pauseForInteraction, slideCount],
  );

  useEffect(() => {
    clearResumeTimer();
    setIsPaused(reducedMotion);
  }, [clearResumeTimer, reducedMotion]);

  useEffect(() => {
    if (reducedMotion || isPaused) {
      return undefined;
    }

    const autoAdvanceTimer = window.setInterval(() => {
      goToNext(false);
    }, AUTO_ADVANCE_MS);

    return () => {
      window.clearInterval(autoAdvanceTimer);
    };
  }, [goToNext, isPaused, reducedMotion]);

  useEffect(() => clearResumeTimer, [clearResumeTimer]);

  return {
    activeIndex,
    autoAdvanceMs: AUTO_ADVANCE_MS,
    isPaused,
    goToSlide,
    goToNext,
    goToPrevious,
    pauseForInteraction,
  };
}
