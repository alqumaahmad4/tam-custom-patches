"use client";

import { useFormContext } from "react-hook-form";

import { quantityPresets } from "@/features/quote-wizard/data";
import type { QuoteWizardValues } from "@/features/quote-wizard/validation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export function QuantityStep() {
  const {
    clearErrors,
    formState: { errors },
    setValue,
    watch,
  } = useFormContext<QuoteWizardValues>();
  const quantity = watch("quantity");

  return (
    <fieldset>
      <legend className="sr-only">Choose quantity</legend>
      {errors.quantity ? (
        <p role="alert" className="text-destructive mb-4 text-sm font-medium">
          {errors.quantity.message}
        </p>
      ) : null}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {quantityPresets.map((preset) => {
          const selected = quantity === preset;

          return (
            <button
              key={preset}
              type="button"
              aria-pressed={selected}
              className={cn(
                "border-border bg-card hover:border-primary/50 min-h-14 rounded-lg border px-4 text-base font-semibold transition-colors duration-150 focus-visible:outline-none",
                selected ? "border-primary bg-tag-bg text-primary" : null,
              )}
              onClick={() => {
                setValue("quantity", preset, {
                  shouldDirty: true,
                  shouldValidate: true,
                });
                clearErrors("quantity");
              }}
            >
              {preset}
            </button>
          );
        })}
      </div>

      <div className="mt-6 max-w-sm">
        <Label htmlFor="custom-quantity">Custom Quantity</Label>
        <Input
          id="custom-quantity"
          type="number"
          min={6}
          inputMode="numeric"
          value={quantity || ""}
          className="mt-2 h-12"
          onChange={(event) => {
            const nextValue = Number(event.target.value);

            setValue("quantity", Number.isFinite(nextValue) ? nextValue : 0, {
              shouldDirty: true,
              shouldValidate: true,
            });
          }}
        />
      </div>
    </fieldset>
  );
}
