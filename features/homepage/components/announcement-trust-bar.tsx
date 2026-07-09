import { Award, BadgeCheck, Globe2, Palette } from "lucide-react";

import { trustSignals } from "@/features/homepage/data";

const icons = {
  artwork: Palette,
  shipping: Globe2,
  quality: Award,
  guarantee: BadgeCheck,
} as const;

export function AnnouncementTrustBar() {
  return (
    <section aria-label="Trust signals" className="border-border bg-surface border-b">
      <div className="mx-auto grid max-w-[var(--container-xl)] gap-px px-4 py-4 sm:px-6 lg:grid-cols-4 lg:px-10">
        {trustSignals.map((signal) => {
          const Icon = icons[signal.icon];

          return (
            <div
              key={signal.title}
              className="bg-background flex items-start gap-4 rounded-lg p-4 sm:items-center"
            >
              <span className="bg-tag-bg text-primary flex size-11 shrink-0 items-center justify-center rounded-full">
                <Icon aria-hidden="true" className="size-5" />
              </span>
              <div>
                <p className="text-base font-semibold">{signal.title}</p>
                <p className="text-muted-foreground mt-1 text-sm leading-6">{signal.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
