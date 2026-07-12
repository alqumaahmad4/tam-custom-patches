"use client";

import { useFormContext } from "react-hook-form";

import {
  backingOptions,
  borderOptions,
  materialOptions,
  threadColorOptions,
} from "@/features/quote-wizard/data";
import { OptionCard } from "@/features/quote-wizard/components/option-card";
import { handleRadioGroupArrowNavigation } from "@/features/quote-wizard/components/radio-keyboard-navigation";
import type { QuoteOption } from "@/features/quote-wizard/types";
import type { QuoteWizardValues } from "@/features/quote-wizard/validation";
import { Label } from "@/components/ui/label";
import { RadioGroup } from "@/components/ui/radio-group";
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
  const legendId = `quote-${fieldName}-legend`;
  const errorId = `quote-error-${fieldName}`;

  return (
    <fieldset>
      <legend id={legendId} className="text-base font-semibold">
        {title}
      </legend>
      {error ? (
        <p id={errorId} role="alert" className="text-destructive mt-2 text-sm font-medium">
          {error.message}
        </p>
      ) : null}
      <RadioGroup
        value={selectedValue}
        aria-labelledby={legendId}
        aria-describedby={error ? errorId : undefined}
        data-quote-field={fieldName}
        className={cn(
          "mt-3 grid gap-3",
          compact ? "sm:grid-cols-2 lg:grid-cols-3" : "sm:grid-cols-2",
        )}
        onKeyDownCapture={handleRadioGroupArrowNavigation}
        onValueChange={(value) => {
          setValue(fieldName, value, {
            shouldDirty: true,
            shouldValidate: true,
          });
          clearErrors(fieldName);
        }}
      >
        {options.map((option) => (
          <OptionCard
            key={option.value}
            value={option.value}
            title={option.label}
            description={option.description}
            selected={selectedValue === option.value}
            className={compact ? "min-h-20" : undefined}
          />
        ))}
      </RadioGroup>
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
          data-quote-field="notes"
          aria-describedby={errors.notes ? "quote-error-notes" : undefined}
          className="mt-2 min-h-32"
          placeholder="Share placement details, deadlines, color notes, or anything the artwork team should know."
          {...register("notes")}
        />
        {errors.notes ? (
          <p
            id="quote-error-notes"
            role="alert"
            className="text-destructive mt-2 text-sm font-medium"
          >
            {errors.notes.message}
          </p>
        ) : null}
      </div>
    </div>
  );
}
