"use client";

import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { useFormContext } from "react-hook-form";

import { quantityPresets } from "@/features/quote-wizard/data";
import { handleRadioGroupArrowNavigation } from "@/features/quote-wizard/components/radio-keyboard-navigation";
import type { QuoteWizardValues } from "@/features/quote-wizard/validation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

export function QuantityStep() {
  const {
    clearErrors,
    formState: { errors },
    setValue,
    watch,
  } = useFormContext<QuoteWizardValues>();
  const quantity = watch("quantity");
  const errorId = "quote-error-quantity";
  const presetValue = quantityPresets.includes(quantity as (typeof quantityPresets)[number])
    ? String(quantity)
    : "";

  return (
    <fieldset>
      <legend className="sr-only">Choose quantity</legend>
      {errors.quantity ? (
        <p id={errorId} role="alert" className="text-destructive mb-4 text-sm font-medium">
          {errors.quantity.message}
        </p>
      ) : null}
      <RadioGroup
        value={presetValue}
        aria-describedby={errors.quantity ? errorId : undefined}
        data-quote-field="quantity"
        className="grid grid-cols-2 gap-3 sm:grid-cols-4"
        onKeyDownCapture={handleRadioGroupArrowNavigation}
        onValueChange={(value) => {
          setValue("quantity", Number(value), {
            shouldDirty: true,
            shouldValidate: true,
          });
          clearErrors("quantity");
        }}
      >
        {quantityPresets.map((preset) => {
          const selected = quantity === preset;

          return (
            <RadioGroupPrimitive.Item
              key={preset}
              value={String(preset)}
              className={cn(
                "border-border bg-card hover:border-primary/50 data-[state=checked]:border-primary data-[state=checked]:bg-tag-bg data-[state=checked]:text-primary min-h-14 rounded-lg border px-4 text-base font-semibold transition-colors duration-150 focus-visible:outline-none",
                selected ? "border-primary bg-tag-bg text-primary" : null,
              )}
            >
              {preset}
            </RadioGroupPrimitive.Item>
          );
        })}
      </RadioGroup>

      <div className="mt-6 max-w-sm">
        <Label htmlFor="custom-quantity">Custom Quantity</Label>
        <Input
          id="custom-quantity"
          data-quote-field="quantity"
          type="number"
          min={6}
          inputMode="numeric"
          value={quantity || ""}
          aria-describedby={errors.quantity ? errorId : undefined}
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
