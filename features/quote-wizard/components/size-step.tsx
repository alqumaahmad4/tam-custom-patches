"use client";

import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { useFormContext } from "react-hook-form";

import { getProductById, sizeOptionsByFamily } from "@/features/quote-wizard/data";
import { handleRadioGroupArrowNavigation } from "@/features/quote-wizard/components/radio-keyboard-navigation";
import type { QuoteWizardValues } from "@/features/quote-wizard/validation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup } from "@/components/ui/radio-group";
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
  const sizeErrorId = "quote-error-size";
  const customSizeErrorId = "quote-error-customSize";

  return (
    <fieldset>
      <legend className="sr-only">Choose size</legend>
      {errors.size ? (
        <p id={sizeErrorId} role="alert" className="text-destructive mb-4 text-sm font-medium">
          {errors.size.message}
        </p>
      ) : null}
      <RadioGroup
        value={selectedSize}
        aria-describedby={errors.size ? sizeErrorId : undefined}
        data-quote-field="size"
        className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4"
        onKeyDownCapture={handleRadioGroupArrowNavigation}
        onValueChange={(value) => {
          setValue("size", value, {
            shouldDirty: true,
            shouldValidate: true,
          });
          clearErrors("size");

          if (value !== "custom") {
            setValue("customSize", "", { shouldDirty: true });
            clearErrors("customSize");
          }
        }}
      >
        {options.map((option) => {
          const selected = selectedSize === option.value;

          return (
            <RadioGroupPrimitive.Item
              key={option.value}
              value={option.value}
              className={cn(
                "border-border bg-card hover:border-primary/50 data-[state=checked]:border-primary data-[state=checked]:bg-tag-bg data-[state=checked]:text-primary min-h-14 rounded-lg border px-4 text-base font-semibold transition-colors duration-150 focus-visible:outline-none",
                selected ? "border-primary bg-tag-bg text-primary" : null,
              )}
            >
              {option.label}
            </RadioGroupPrimitive.Item>
          );
        })}
      </RadioGroup>

      {selectedSize === "custom" ? (
        <div className="mt-6 max-w-md">
          <Label htmlFor="custom-size">Custom size</Label>
          <Input
            id="custom-size"
            data-quote-field="customSize"
            aria-describedby={errors.customSize ? customSizeErrorId : undefined}
            className="mt-2 h-12"
            placeholder='Example: 3.5" wide or 32 x 32 in'
            {...register("customSize")}
          />
          {errors.customSize ? (
            <p
              id={customSizeErrorId}
              role="alert"
              className="text-destructive mt-2 text-sm font-medium"
            >
              {errors.customSize.message}
            </p>
          ) : null}
        </div>
      ) : null}
    </fieldset>
  );
}
