import { ChevronLeft, ChevronRight } from "lucide-react";

import { heroSlides } from "@/features/homepage/hero/data";
import { cn } from "@/lib/utils";

type SlideControlsProps = {
  activeIndex: number;
  isDark: boolean;
  isPaused: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onSelect: (index: number) => void;
};

export function SlideControls({
  activeIndex,
  isDark,
  isPaused,
  onPrevious,
  onNext,
  onSelect,
}: SlideControlsProps) {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-5 z-[var(--z-raised)] px-4 sm:px-6 lg:px-10">
      <div className="mx-auto flex max-w-[var(--container-xl)] items-center justify-between gap-4">
        <div
          className="pointer-events-auto flex items-center gap-2"
          aria-label="Hero slide controls"
        >
          <button
            type="button"
            className={cn(
              "grid size-11 place-items-center rounded-full border shadow-sm transition-[background-color,border-color,color,transform] duration-150 ease-out hover:-translate-y-0.5 focus-visible:outline-none motion-reduce:transition-none motion-reduce:hover:translate-y-0",
              isDark
                ? "border-surface/25 bg-surface/10 text-surface hover:bg-surface/15"
                : "border-border bg-surface text-foreground hover:text-primary",
            )}
            aria-label="Show previous hero slide"
            onClick={onPrevious}
          >
            <ChevronLeft aria-hidden="true" className="size-5" />
          </button>
          <button
            type="button"
            className={cn(
              "grid size-11 place-items-center rounded-full border shadow-sm transition-[background-color,border-color,color,transform] duration-150 ease-out hover:-translate-y-0.5 focus-visible:outline-none motion-reduce:transition-none motion-reduce:hover:translate-y-0",
              isDark
                ? "border-surface/25 bg-surface/10 text-surface hover:bg-surface/15"
                : "border-border bg-surface text-foreground hover:text-primary",
            )}
            aria-label="Show next hero slide"
            onClick={onNext}
          >
            <ChevronRight aria-hidden="true" className="size-5" />
          </button>
        </div>
        <div
          className="pointer-events-auto flex items-center gap-2 rounded-full border border-transparent"
          aria-label={isPaused ? "Hero slides paused" : "Hero slides auto advancing"}
        >
          {heroSlides.map((slide, index) => {
            const isActive = activeIndex === index;

            return (
              <button
                key={slide.id}
                type="button"
                aria-label={`Show ${slide.title} slide`}
                aria-current={isActive ? "true" : undefined}
                className="grid min-h-11 min-w-11 place-items-center rounded-full focus-visible:outline-none"
                onClick={() => onSelect(index)}
              >
                <span
                  className={cn(
                    "block h-2 rounded-full transition-[width,background-color] duration-150 ease-out motion-reduce:transition-none",
                    isActive ? "bg-primary w-8" : "w-2",
                    !isActive && isDark ? "bg-surface/45 hover:bg-surface/70" : null,
                    !isActive && !isDark ? "bg-foreground/30 hover:bg-primary/60" : null,
                  )}
                />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
