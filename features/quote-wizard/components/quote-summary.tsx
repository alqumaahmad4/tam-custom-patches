"use client";

import { ChevronDown, Pencil } from "lucide-react";

import {
  backingOptions,
  borderOptions,
  getOptionLabel,
  getProductById,
  materialOptions,
  sizeOptionsByFamily,
  threadColorOptions,
} from "@/features/quote-wizard/data";
import type { QuotePricingResult } from "@/features/quote-wizard/pricing";
import type { QuoteWizardValues } from "@/features/quote-wizard/validation";
import { Button } from "@/components/ui/button";

type QuoteSummaryProps = {
  values: QuoteWizardValues;
  pricing: QuotePricingResult;
  currentStepIndex?: number;
  onEdit?: (stepIndex: number) => void;
  variant?: "mobile" | "desktop";
};

function getSizeLabel(values: QuoteWizardValues) {
  const product = getProductById(values.productId);

  if (!product) {
    return "Not selected";
  }

  if (values.size === "custom") {
    return values.customSize?.trim() || "Custom";
  }

  return getOptionLabel(sizeOptionsByFamily[product.sizeFamily], values.size) ?? "Not selected";
}

function getArtworkLabel(values: QuoteWizardValues) {
  if (values.artworkStatus === "uploaded") {
    return `${values.artworkFiles.length} file${values.artworkFiles.length === 1 ? "" : "s"} added`;
  }

  if (values.artworkStatus === "later") {
    return "Send later";
  }

  return "Not selected";
}

function SummaryRow({
  label,
  value,
  onEdit,
}: {
  label: string;
  value: string;
  onEdit?: () => void;
}) {
  return (
    <div className="border-border flex items-start justify-between gap-4 border-b py-3 last:border-b-0">
      <div>
        <dt className="text-muted-foreground text-xs font-semibold tracking-[var(--letter-spacing-uppercase)] uppercase">
          {label}
        </dt>
        <dd className="mt-1 text-sm font-semibold">{value}</dd>
      </div>
      {onEdit ? (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={`Edit ${label}`}
          onClick={onEdit}
        >
          <Pencil aria-hidden="true" className="size-4" />
        </Button>
      ) : null}
    </div>
  );
}

export function QuoteSummaryDetails({ values, pricing, onEdit }: QuoteSummaryProps) {
  const product = getProductById(values.productId);

  return (
    <div>
      <div className="bg-tag-bg rounded-lg p-4">
        <p className="text-muted-foreground text-xs font-semibold tracking-[var(--letter-spacing-uppercase)] uppercase">
          Estimated range
        </p>
        <p className="mt-2 text-2xl font-bold">{pricing.formattedRange}</p>
        <p className="text-muted-foreground mt-2 text-xs leading-5">
          Frontend estimate only. Final quote is confirmed by the sales team.
        </p>
      </div>

      <dl className="mt-5">
        <SummaryRow
          label="Product"
          value={product?.label ?? "Not selected"}
          onEdit={onEdit ? () => onEdit(0) : undefined}
        />
        <SummaryRow
          label="Quantity"
          value={values.quantity > 0 ? `${values.quantity} units` : "Not selected"}
          onEdit={onEdit ? () => onEdit(1) : undefined}
        />
        <SummaryRow
          label="Size"
          value={getSizeLabel(values)}
          onEdit={onEdit ? () => onEdit(2) : undefined}
        />
        <SummaryRow
          label="Artwork"
          value={getArtworkLabel(values)}
          onEdit={onEdit ? () => onEdit(3) : undefined}
        />
        <SummaryRow
          label="Backing"
          value={getOptionLabel(backingOptions, values.backing) ?? "Not selected"}
          onEdit={onEdit ? () => onEdit(4) : undefined}
        />
        <SummaryRow
          label="Border"
          value={getOptionLabel(borderOptions, values.border) ?? "Not selected"}
          onEdit={onEdit ? () => onEdit(4) : undefined}
        />
        <SummaryRow
          label="Thread colors"
          value={getOptionLabel(threadColorOptions, values.threadColors) ?? "Not selected"}
          onEdit={onEdit ? () => onEdit(4) : undefined}
        />
        <SummaryRow
          label="Material"
          value={getOptionLabel(materialOptions, values.material) ?? "Not selected"}
          onEdit={onEdit ? () => onEdit(4) : undefined}
        />
        <SummaryRow label="Turnaround" value={pricing.turnaround} />
        <SummaryRow label="Shipping" value={pricing.shipping} />
      </dl>
    </div>
  );
}

export function OrderSummary({
  values,
  pricing,
  currentStepIndex,
  variant = "desktop",
}: QuoteSummaryProps) {
  const product = getProductById(values.productId);

  if (variant === "mobile") {
    return (
      <details className="border-border bg-card rounded-lg border shadow-sm lg:hidden">
        <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 px-4">
          <span>
            <span className="block text-sm font-semibold">
              Step {(currentStepIndex ?? 0) + 1} of 6{product ? ` - ${product.label}` : ""}
            </span>
            <span className="text-muted-foreground text-xs">
              {values.quantity > 0 ? `${values.quantity} units` : "View summary"}
            </span>
          </span>
          <ChevronDown aria-hidden="true" className="size-5" />
        </summary>
        <div className="border-border max-h-[min(60svh,28rem)] overflow-y-auto border-t p-4">
          <QuoteSummaryDetails values={values} pricing={pricing} />
        </div>
      </details>
    );
  }

  return (
    <aside className="hidden lg:block">
      <div className="border-border bg-card sticky top-28 rounded-lg border p-5 shadow-lg">
        <div className="mb-5">
          <p className="text-primary text-xs font-semibold tracking-[var(--letter-spacing-uppercase)] uppercase">
            Live order summary
          </p>
          <h2 className="mt-2 text-xl font-semibold">Quote snapshot</h2>
        </div>
        <QuoteSummaryDetails values={values} pricing={pricing} />
      </div>
    </aside>
  );
}
