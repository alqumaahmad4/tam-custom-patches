import type { PlaceholderTone } from "@/features/homepage/data";
import { cn } from "@/lib/utils";

const toneClasses: Record<PlaceholderTone, string> = {
  neutral: "border-border bg-section-bg text-foreground",
  accent: "border-primary/20 bg-tag-bg text-foreground",
  gold: "border-gold/30 bg-warm text-foreground",
  dark: "border-border bg-dark-bg text-surface",
  success: "border-success/20 bg-success-light text-foreground",
  info: "border-info/20 bg-info-light text-foreground",
};

const detailClasses: Record<PlaceholderTone, string> = {
  neutral: "border-surface/60 bg-surface/70",
  accent: "border-surface/60 bg-surface/70",
  gold: "border-surface/60 bg-surface/70",
  dark: "border-surface/10 bg-surface/10",
  success: "border-surface/60 bg-surface/70",
  info: "border-surface/60 bg-surface/70",
};

type PlaceholderVisualProps = {
  label: string;
  tone?: PlaceholderTone;
  className?: string;
};

export function PlaceholderVisual({ label, tone = "neutral", className }: PlaceholderVisualProps) {
  return (
    <div
      role="img"
      aria-label={`${label} placeholder image`}
      className={cn(
        "relative flex aspect-[4/3] min-h-40 overflow-hidden rounded-lg border",
        toneClasses[tone],
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "absolute top-6 left-6 h-16 w-28 rounded-md border shadow-xs",
          detailClasses[tone],
        )}
      />
      <span
        aria-hidden="true"
        className={cn(
          "absolute right-6 bottom-7 h-20 w-20 rounded-full border shadow-sm",
          detailClasses[tone],
        )}
      />
      <span
        aria-hidden="true"
        className={cn(
          "absolute right-12 bottom-14 left-12 h-3 rounded-full border",
          detailClasses[tone],
        )}
      />
      <span className="bg-surface/85 text-foreground relative m-auto rounded-full border border-current/10 px-4 py-2 text-center text-xs font-semibold tracking-[var(--letter-spacing-uppercase)] uppercase shadow-sm backdrop-blur-[var(--blur-glass)]">
        {label}
      </span>
    </div>
  );
}
