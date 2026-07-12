"use client";

import { useFormContext } from "react-hook-form";

import { getProductById, quoteProductOptions } from "@/features/quote-wizard/data";
import { OptionCard } from "@/features/quote-wizard/components/option-card";
import { handleRadioGroupArrowNavigation } from "@/features/quote-wizard/components/radio-keyboard-navigation";
import type { QuoteWizardValues } from "@/features/quote-wizard/validation";
import { RadioGroup } from "@/components/ui/radio-group";

const categoryLabels = {
  patches: "Patch",
  apparel: "Apparel",
  martialArts: "Martial arts",
  accessories: "Accessory",
} as const;

export function ProductStep() {
  const {
    clearErrors,
    formState: { errors },
    setValue,
    watch,
  } = useFormContext<QuoteWizardValues>();
  const selectedProductId = watch("productId");
  const selectedProduct = getProductById(selectedProductId);
  const errorId = "quote-error-productId";

  return (
    <fieldset>
      <legend className="sr-only">Choose product category</legend>
      {errors.productId ? (
        <p id={errorId} role="alert" className="text-destructive mb-4 text-sm font-medium">
          {errors.productId.message}
        </p>
      ) : null}
      <RadioGroup
        value={selectedProductId}
        aria-describedby={errors.productId ? errorId : undefined}
        data-quote-field="productId"
        className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3"
        onKeyDownCapture={handleRadioGroupArrowNavigation}
        onValueChange={(productId) => {
          const product = getProductById(productId);
          const previousFamily = selectedProduct?.sizeFamily;

          if (!product) {
            return;
          }

          setValue("productId", productId, {
            shouldDirty: true,
            shouldValidate: true,
          });
          clearErrors("productId");

          if (previousFamily && previousFamily !== product.sizeFamily) {
            setValue("size", "", { shouldDirty: true });
            setValue("customSize", "", { shouldDirty: true });
          }
        }}
      >
        {quoteProductOptions.map((product) => {
          const selected = product.id === selectedProductId;

          return (
            <OptionCard
              key={product.id}
              value={product.id}
              title={product.label}
              description={product.description}
              selected={selected}
            >
              <span className="text-primary bg-surface inline-flex rounded-full px-3 py-1 text-xs font-semibold">
                {categoryLabels[product.category]}
              </span>
            </OptionCard>
          );
        })}
      </RadioGroup>
    </fieldset>
  );
}
