"use client";

import { useFormContext } from "react-hook-form";

import { getProductById, quoteProductOptions } from "@/features/quote-wizard/data";
import { OptionCard } from "@/features/quote-wizard/components/option-card";
import type { QuoteWizardValues } from "@/features/quote-wizard/validation";

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

  return (
    <fieldset>
      <legend className="sr-only">Choose product category</legend>
      {errors.productId ? (
        <p role="alert" className="text-destructive mb-4 text-sm font-medium">
          {errors.productId.message}
        </p>
      ) : null}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {quoteProductOptions.map((product) => {
          const selected = product.id === selectedProductId;

          return (
            <OptionCard
              key={product.id}
              title={product.label}
              description={product.description}
              selected={selected}
              onSelect={() => {
                const previousFamily = selectedProduct?.sizeFamily;

                setValue("productId", product.id, {
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
              <span className="text-primary bg-surface inline-flex rounded-full px-3 py-1 text-xs font-semibold">
                {categoryLabels[product.category]}
              </span>
            </OptionCard>
          );
        })}
      </div>
    </fieldset>
  );
}
