"use client";

import { useFormContext } from "react-hook-form";

import {
  backingOptions,
  borderOptions,
  materialOptions,
  threadColorOptions,
} from "@/features/quote-wizard/data";
import { OptionCard } from "@/features/quote-wizard/components/option-card";
import type { QuoteOption } from "@/features/quote-wizard/types";
import type { QuoteWizardValues } from "@/features/quote-wizard/validation";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type OptionGroupProps = {
  title: string;
  fieldName: "backing" | "border" | "threadColors" | "material";
  options: readonly QuoteOption[];
  compact?: boolean;
};

function OptionGroup({ title, fieldName, options, compact = false }: OptionGroupProps) {
  const {
    clearErrors,
    formState: { errors },
    setValue,
    watch,
  } = useFormContext<QuoteWizardValues>();
  const selectedValue = watch(fieldName);
  const error = errors[fieldName];

  return (
    <fieldset>
      <legend className="text-base font-semibold">{title}</legend>
      {error ? (
        <p role="alert" className="text-destructive mt-2 text-sm font-medium">
          {error.message}
        </p>
      ) : null}
      <div
        className={cn(
          "mt-3 grid gap-3",
          compact ? "sm:grid-cols-2 lg:grid-cols-3" : "sm:grid-cols-2",
        )}
      >
        {options.map((option) => (
          <OptionCard
            key={option.value}
            title={option.label}
            description={option.description}
            selected={selectedValue === option.value}
            className={compact ? "min-h-20" : undefined}
            onSelect={() => {
              setValue(fieldName, option.value, {
                shouldDirty: true,
                shouldValidate: true,
              });
              clearErrors(fieldName);
            }}
          />
        ))}
      </div>
    </fieldset>
  );
}

export function CustomizationStep() {
  const {
    formState: { errors },
    register,
  } = useFormContext<QuoteWizardValues>();

  return (
    <div className="space-y-8">
      <OptionGroup title="Backing" fieldName="backing" options={backingOptions} />
      <OptionGroup title="Border" fieldName="border" options={borderOptions} />
      <OptionGroup
        title="Thread Colors"
        fieldName="threadColors"
        options={threadColorOptions}
        compact
      />
      <OptionGroup title="Material" fieldName="material" options={materialOptions} />
      <div>
        <Label htmlFor="quote-notes">Notes</Label>
        <Textarea
          id="quote-notes"
          className="mt-2 min-h-32"
          placeholder="Share placement details, deadlines, color notes, or anything the artwork team should know."
          {...register("notes")}
        />
        {errors.notes ? (
          <p role="alert" className="text-destructive mt-2 text-sm font-medium">
            {errors.notes.message}
          </p>
        ) : null}
      </div>
    </div>
  );
}
