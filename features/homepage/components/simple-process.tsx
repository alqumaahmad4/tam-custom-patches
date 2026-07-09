import { ArrowDown, ArrowRight } from "lucide-react";

import { HomeSection } from "@/features/homepage/components/home-section";
import { processSteps } from "@/features/homepage/data";

export function SimpleProcess() {
  return (
    <HomeSection
      id="simple-process"
      eyebrow="Simple Process"
      title="From idea to worldwide delivery."
      description="A simple four-step path helps customers understand how a custom manufacturing request moves forward."
    >
      <ol className="grid gap-5 md:grid-cols-4">
        {processSteps.map((step, index) => (
          <li key={step.step} className="relative">
            <article className="bg-card min-h-full rounded-lg border p-6 shadow-sm">
              <p className="text-primary text-xs font-semibold tracking-[var(--letter-spacing-uppercase)] uppercase">
                {step.step}
              </p>
              <h3 className="mt-4 text-xl font-semibold">{step.title}</h3>
              <p className="text-muted-foreground mt-3 text-sm leading-6">{step.description}</p>
            </article>
            {index < processSteps.length - 1 ? (
              <span
                aria-hidden="true"
                className="text-primary bg-surface absolute -bottom-5 left-1/2 z-[var(--z-raised)] flex size-10 -translate-x-1/2 items-center justify-center rounded-full border shadow-sm md:top-1/2 md:-right-7 md:bottom-auto md:left-auto md:translate-x-0 md:-translate-y-1/2"
              >
                <ArrowDown className="size-4 md:hidden" />
                <ArrowRight className="hidden size-4 md:block" />
              </span>
            ) : null}
          </li>
        ))}
      </ol>
    </HomeSection>
  );
}
