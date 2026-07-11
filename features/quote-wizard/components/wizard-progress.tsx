import { quoteSteps } from "@/features/quote-wizard/data";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

type WizardProgressProps = {
  currentStepIndex: number;
};

export function WizardProgress({ currentStepIndex }: WizardProgressProps) {
  const progressValue = ((currentStepIndex + 1) / quoteSteps.length) * 100;

  return (
    <div aria-label="Quote progress">
      <div className="mb-3 flex items-center justify-between gap-4 lg:hidden">
        <p className="text-sm font-semibold">
          Step {currentStepIndex + 1} of {quoteSteps.length}
        </p>
        <p className="text-muted-foreground text-sm">{quoteSteps[currentStepIndex].title}</p>
      </div>
      <Progress value={progressValue} aria-label="Quote wizard progress" />
      <ol className="mt-5 hidden grid-cols-6 gap-2 lg:grid">
        {quoteSteps.map((step, index) => {
          const isCurrent = index === currentStepIndex;
          const isComplete = index < currentStepIndex;

          return (
            <li key={step.id}>
              <div
                className={cn(
                  "border-border bg-card flex min-h-16 flex-col justify-center rounded-lg border px-3 text-xs transition-colors duration-200",
                  isCurrent ? "border-primary bg-tag-bg text-primary" : null,
                  isComplete ? "border-primary/40" : null,
                )}
                aria-current={isCurrent ? "step" : undefined}
              >
                <span className="font-semibold">{step.eyebrow}</span>
                <span className="text-muted-foreground mt-1 leading-4">{step.title}</span>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
