import type { HeroTheme } from "@/features/homepage/hero/data";
import { cn } from "@/lib/utils";

type HeroTextureProps = {
  theme: HeroTheme;
};

export function HeroTexture({ theme }: HeroTextureProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 -z-10 overflow-hidden",
        theme === "warm" ? "text-primary" : theme === "martial" ? "text-gold" : "text-primary",
      )}
    >
      <svg className="h-full w-full opacity-[var(--opacity-overlay-subtle)]" focusable="false">
        <defs>
          <pattern
            id={`hero-pattern-${theme}`}
            width="48"
            height="48"
            patternUnits="userSpaceOnUse"
          >
            <path d="M48 0H0v48" fill="none" stroke="currentColor" strokeWidth="1" />
            <circle cx="24" cy="24" r="3" fill="currentColor" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#hero-pattern-${theme})`} />
      </svg>
      <div className="bg-primary/10 absolute -top-24 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full blur-[var(--blur-glass)]" />
      {theme === "martial" ? (
        <div className="bg-gold/10 absolute right-0 bottom-0 h-96 w-96 rounded-full blur-[var(--blur-glass)]" />
      ) : null}
    </div>
  );
}
