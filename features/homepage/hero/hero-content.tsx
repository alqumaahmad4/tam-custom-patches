import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { HeroSlide } from "@/features/homepage/hero/data";
import { cn } from "@/lib/utils";

type HeroContentProps = {
  slide: HeroSlide;
  isDark: boolean;
  titleId: string;
  descriptionId: string;
  onInteract: () => void;
};

export function HeroContent({
  slide,
  isDark,
  titleId,
  descriptionId,
  onInteract,
}: HeroContentProps) {
  return (
    <div className="relative z-[var(--z-raised)] max-w-2xl">
      <p
        className={cn(
          "mb-3 text-xs font-semibold tracking-[var(--letter-spacing-uppercase)] uppercase md:mb-4",
          isDark ? "text-surface/80" : "text-primary",
        )}
      >
        {slide.eyebrow}
      </p>
      <h1
        id={titleId}
        className={cn(
          "text-4xl leading-[var(--line-height-4xl)] font-extrabold tracking-normal text-balance md:text-5xl md:leading-[var(--line-height-5xl)] lg:text-6xl lg:leading-[var(--line-height-6xl)]",
          isDark ? "text-surface" : "text-foreground",
        )}
      >
        <span className="sr-only">{slide.title}</span>
        <span aria-hidden="true">
          <span className="block">{slide.titleLines[0]}</span>
          <span className="block">{slide.titleLines[1]}</span>
        </span>
      </h1>
      <p
        id={descriptionId}
        className={cn(
          "mt-4 max-w-[var(--text-max-measure,70ch)] text-base leading-7 md:mt-6 md:text-lg md:leading-8",
          isDark ? "text-surface/80" : "text-muted-foreground",
        )}
      >
        {slide.description}
      </p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row md:mt-8">
        <Button asChild variant="premiumPrimary">
          <Link href={slide.primaryCta.href} onClick={onInteract}>
            {slide.primaryCta.label}
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </Button>
        <Button
          asChild
          variant="premiumOutline"
          className={cn(isDark ? "premium-button-on-dark" : null)}
        >
          <Link href={slide.secondaryCta.href} onClick={onInteract}>
            {slide.secondaryCta.label}
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </Button>
      </div>
      <ul
        className="mt-5 grid gap-3 sm:grid-cols-3 md:mt-8"
        aria-label={`${slide.title} trust points`}
      >
        {slide.trustItems.map((item) => (
          <li
            key={item}
            className={cn(
              "flex items-center gap-2 text-sm font-medium",
              isDark ? "text-surface/85" : "text-muted-foreground",
            )}
          >
            <CheckCircle2
              aria-hidden="true"
              className={cn("size-4 shrink-0", isDark ? "text-surface" : "text-primary")}
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
