import { Award, BadgeDollarSign, Clock3, Factory, Globe2, Headphones, Palette } from "lucide-react";

import { HomeSection } from "@/features/homepage/components/home-section";
import { whyChooseItems } from "@/features/homepage/data";

const icons = {
  manufacturing: Factory,
  shipping: Globe2,
  costs: BadgeDollarSign,
  materials: Award,
  support: Headphones,
  turnaround: Clock3,
  artwork: Palette,
} as const;

export function WhyChooseUs() {
  return (
    <HomeSection
      id="why-choose-us"
      eyebrow="Why Choose Tam Custom Patches"
      title="Built around premium manufacturing clarity."
      description="Every request should feel clear, supported, and ready for careful production from the first conversation."
      variant="muted"
    >
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {whyChooseItems.map((item) => {
          const Icon = icons[item.icon];

          return (
            <article
              key={item.title}
              className="bg-card rounded-lg border p-6 shadow-sm [transition:var(--transition-interactive)] hover:-translate-y-1 hover:shadow-md motion-reduce:[transition:none] motion-reduce:hover:translate-y-0"
            >
              <span className="bg-tag-bg text-primary flex size-12 items-center justify-center rounded-lg">
                <Icon aria-hidden="true" className="size-5" />
              </span>
              <h3 className="mt-5 text-xl font-semibold">{item.title}</h3>
              <p className="text-muted-foreground mt-3 text-sm leading-6">{item.description}</p>
            </article>
          );
        })}
      </div>
    </HomeSection>
  );
}
