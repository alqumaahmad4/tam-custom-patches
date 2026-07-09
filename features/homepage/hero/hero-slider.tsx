"use client";

import type { KeyboardEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import { heroSlides } from "@/features/homepage/hero/data";
import { HeroContent } from "@/features/homepage/hero/hero-content";
import { HeroScene } from "@/features/homepage/hero/hero-scene";
import { HeroTexture } from "@/features/homepage/hero/hero-texture";
import { SlideControls } from "@/features/homepage/hero/slide-controls";
import { useHeroSlider } from "@/features/homepage/hero/use-hero-slider";
import { motionTokens } from "@/lib/design-tokens";
import { cn } from "@/lib/utils";

const titleId = "home-hero-title";
const descriptionId = "home-hero-description";

const themeClasses = {
  dark: "bg-dark-bg text-surface",
  warm: "bg-warm text-foreground",
  martial: "bg-dark-bg text-surface",
} as const;

type DragInfo = {
  offset: {
    x: number;
  };
  velocity: {
    x: number;
  };
};

export function HeroSlider() {
  const prefersReducedMotion = useReducedMotion() ?? false;
  const {
    activeIndex,
    autoAdvanceMs,
    isPaused,
    goToSlide,
    goToNext,
    goToPrevious,
    pauseForInteraction,
  } = useHeroSlider({
    slideCount: heroSlides.length,
    reducedMotion: prefersReducedMotion,
  });
  const activeSlide = heroSlides[activeIndex];
  const isDark = activeSlide.theme !== "warm";

  function handleKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.defaultPrevented) {
      return;
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      goToNext();
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      goToPrevious();
    }

    if (event.key === "Home") {
      event.preventDefault();
      goToSlide(0);
    }

    if (event.key === "End") {
      event.preventDefault();
      goToSlide(heroSlides.length - 1);
    }
  }

  function handleDragEnd(_: MouseEvent | TouchEvent | PointerEvent, info: DragInfo) {
    pauseForInteraction();

    if (info.offset.x < -80 || info.velocity.x < -300) {
      goToNext();
      return;
    }

    if (info.offset.x > 80 || info.velocity.x > 300) {
      goToPrevious();
    }
  }

  return (
    <section
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      aria-roledescription="carousel"
      className={cn("relative isolate overflow-hidden", themeClasses[activeSlide.theme])}
      onKeyDownCapture={handleKeyDown}
      onPointerDownCapture={pauseForInteraction}
      onFocusCapture={pauseForInteraction}
    >
      <HeroTexture theme={activeSlide.theme} />
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={activeSlide.id}
          className="relative"
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={prefersReducedMotion ? undefined : { opacity: 0 }}
          transition={{
            duration: prefersReducedMotion
              ? motionTokens.duration.base
              : motionTokens.duration.hero,
            ease: motionTokens.easing.out,
          }}
          drag={prefersReducedMotion ? false : "x"}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.08}
          onDragEnd={handleDragEnd}
        >
          <div className="mx-auto grid min-h-[calc(100svh-4rem)] max-w-[var(--container-xl)] grid-rows-[auto_auto] items-center gap-8 px-4 pt-8 pb-24 sm:px-6 md:min-h-[calc(100svh-5rem)] md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:grid-rows-1 md:gap-8 md:py-16 lg:min-h-[calc(100svh-6rem)] lg:gap-12 lg:px-10">
            <HeroContent
              slide={activeSlide}
              isDark={isDark}
              titleId={titleId}
              descriptionId={descriptionId}
              onInteract={pauseForInteraction}
            />
            <div className="relative min-h-72 md:min-h-[30rem]">
              <HeroScene scene={activeSlide.scene} reducedMotion={prefersReducedMotion} />
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
      <SlideControls
        activeIndex={activeIndex}
        isDark={isDark}
        isPaused={isPaused}
        onPrevious={() => goToPrevious()}
        onNext={() => goToNext()}
        onSelect={(index) => goToSlide(index)}
      />
      <div className="sr-only" aria-live={isPaused ? "polite" : "off"}>
        Slide {activeIndex + 1} of {heroSlides.length}: {activeSlide.title}.{" "}
        {prefersReducedMotion
          ? "Automatic slide movement is disabled because reduced motion is enabled."
          : `Slides advance every ${autoAdvanceMs / 1000} seconds until interaction pauses them.`}
      </div>
    </section>
  );
}
