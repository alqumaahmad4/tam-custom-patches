"use client";

import { useFormContext } from "react-hook-form";

import { getProductById, sizeOptionsByFamily } from "@/features/quote-wizard/data";
import type { QuoteWizardValues } from "@/features/quote-wizard/validation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export function SizeStep() {
  const {
    clearErrors,
    formState: { errors },
    register,
    setValue,
    watch,
  } = useFormContext<QuoteWizardValues>();
  const product = getProductById(watch("productId"));
  const selectedSize = watch("size");
  const options = product ? sizeOptionsByFamily[product.sizeFamily] : sizeOptionsByFamily.patch;

  return (
    <fieldset>
      <legend className="sr-only">Choose size</legend>
      {errors.size ? (
        <p role="alert" className="text-destructive mb-4 text-sm font-medium">
          {errors.size.message}
        </p>
      ) : null}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {options.map((option) => {
          const selected = selectedSize === option.value;

          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={selected}
              className={cn(
                "border-border bg-card hover:border-primary/50 min-h-14 rounded-lg border px-4 text-base font-semibold transition-colors duration-150 focus-visible:outline-none",
                selected ? "border-primary bg-tag-bg text-primary" : null,
              )}
              onClick={() => {
                setValue("size", option.value, {
                  shouldDirty: true,
                  shouldValidate: true,
                });
                clearErrors("size");

                if (option.value !== "custom") {
                  setValue("customSize", "", { shouldDirty: true });
                  clearErrors("customSize");
                }
              }}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      {selectedSize === "custom" ? (
        <div className="mt-6 max-w-md">
          <Label htmlFor="custom-size">Custom size</Label>
          <Input
            id="custom-size"
            className="mt-2 h-12"
            placeholder='Example: 3.5" wide or 32 x 32 in'
            {...register("customSize")}
          />
          {errors.customSize ? (
            <p role="alert" className="text-destructive mt-2 text-sm font-medium">
              {errors.customSize.message}
            </p>
          ) : null}
        </div>
      ) : null}
    </fieldset>
  );
}
