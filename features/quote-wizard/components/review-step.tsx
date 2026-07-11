"use client";

import { QuoteSummaryDetails } from "@/features/quote-wizard/components/quote-summary";
import type { QuotePricingResult } from "@/features/quote-wizard/pricing";
import type { QuoteWizardValues } from "@/features/quote-wizard/validation";

type ReviewStepProps = {
  values: QuoteWizardValues;
  pricing: QuotePricingResult;
  onEdit: (stepIndex: number) => void;
};

export function ReviewStep({ values, pricing, onEdit }: ReviewStepProps) {
  return (
    <div>
      <div className="border-border bg-card rounded-lg border p-5">
        <QuoteSummaryDetails values={values} pricing={pricing} onEdit={onEdit} />
      </div>
    </div>
  );
}
