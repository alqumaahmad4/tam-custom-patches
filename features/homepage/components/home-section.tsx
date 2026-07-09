import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type HomeSectionVariant = "surface" | "muted" | "warm" | "dark";

const sectionVariants: Record<HomeSectionVariant, string> = {
  surface: "bg-background text-foreground",
  muted: "bg-section-bg text-foreground",
  warm: "bg-warm text-foreground",
  dark: "dark bg-background text-foreground",
};

type HomeSectionProps = {
  id: string;
  eyebrow: string;
  title: string;
  description?: string;
  variant?: HomeSectionVariant;
  className?: string;
  headerClassName?: string;
  children: ReactNode;
};

export function HomeSection({
  id,
  eyebrow,
  title,
  description,
  variant = "surface",
  className,
  headerClassName,
  children,
}: HomeSectionProps) {
  const titleId = `${id}-title`;

  return (
    <section
      id={id}
      aria-labelledby={titleId}
      className={cn("py-12 md:py-16 lg:py-24", sectionVariants[variant], className)}
    >
      <div className="mx-auto max-w-[var(--container-xl)] px-4 sm:px-6 lg:px-10">
        <div className={cn("mb-10 max-w-3xl lg:mb-12", headerClassName)}>
          <p className="text-primary mb-3 text-xs font-semibold tracking-[var(--letter-spacing-uppercase)] uppercase">
            {eyebrow}
          </p>
          <h2 id={titleId} className="text-3xl font-bold text-balance md:text-4xl">
            {title}
          </h2>
          {description ? (
            <p className="text-muted-foreground mt-4 max-w-[var(--text-max-measure,70ch)] text-base leading-7">
              {description}
            </p>
          ) : null}
        </div>
        {children}
      </div>
    </section>
  );
}
