"use client";

import { useEffect, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import { FormProvider, useForm, type FieldPath } from "react-hook-form";

import { ArtworkStep } from "@/features/quote-wizard/components/artwork-step";
import { CustomizationStep } from "@/features/quote-wizard/components/customization-step";
import { OrderSummary } from "@/features/quote-wizard/components/quote-summary";
import { ProductStep } from "@/features/quote-wizard/components/product-step";
import { QuantityStep } from "@/features/quote-wizard/components/quantity-step";
import { ReviewStep } from "@/features/quote-wizard/components/review-step";
import { SizeStep } from "@/features/quote-wizard/components/size-step";
import { WizardProgress } from "@/features/quote-wizard/components/wizard-progress";
import { quoteSteps } from "@/features/quote-wizard/data";
import { frontendPricingEngine } from "@/features/quote-wizard/pricing";
import { useQuoteWizardStore } from "@/features/quote-wizard/store";
import {
  defaultQuoteWizardValues,
  quoteWizardSchema,
  stepFields,
  type QuoteWizardValues,
} from "@/features/quote-wizard/validation";
import { Button } from "@/components/ui/button";
import { springTransitions } from "@/lib/motion";

function getStepContent(
  stepIndex: number,
  values: QuoteWizardValues,
  setStepIndex: (stepIndex: number) => void,
) {
  switch (quoteSteps[stepIndex]?.id) {
    case "product":
      return <ProductStep />;
    case "quantity":
      return <QuantityStep />;
    case "size":
      return <SizeStep />;
    case "artwork":
      return <ArtworkStep />;
    case "customization":
      return <CustomizationStep />;
    case "review":
      return (
        <ReviewStep values={values} pricing={frontendPricingEngine(values)} onEdit={setStepIndex} />
      );
    default:
      return <ProductStep />;
  }
}

export function QuoteWizard() {
  const prefersReducedMotion = useReducedMotion();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const errorSummaryRef = useRef<HTMLDivElement>(null);
  const hasFocusedStepRef = useRef(false);
  const {
    currentStepIndex,
    resetWizard,
    setCurrentStepIndex,
    updateValues,
    values: storedValues,
  } = useQuoteWizardStore();
  const [direction, setDirection] = useState(1);
  const methods = useForm<QuoteWizardValues>({
    resolver: zodResolver(quoteWizardSchema),
    defaultValues: {
      ...defaultQuoteWizardValues,
      ...storedValues,
    },
    mode: "onChange",
  });
  const [stepErrors, setStepErrors] = useState<string[]>([]);
  const values = methods.watch();
  const currentStep = quoteSteps[currentStepIndex] ?? quoteSteps[0];
  const isFirstStep = currentStepIndex === 0;
  const isReviewStep = currentStep.id === "review";
  const pricing = frontendPricingEngine(values);

  useEffect(() => {
    const subscription = methods.watch((nextValues) => {
      updateValues({
        ...defaultQuoteWizardValues,
        ...nextValues,
      } as QuoteWizardValues);
    });

    return () => subscription.unsubscribe();
  }, [methods, updateValues]);

  useEffect(() => {
    setStepErrors([]);

    if (!hasFocusedStepRef.current) {
      hasFocusedStepRef.current = true;
      return;
    }

    headingRef.current?.focus();
  }, [currentStepIndex]);

  function setStepIndex(stepIndex: number) {
    const nextStepIndex = Math.max(0, Math.min(stepIndex, quoteSteps.length - 1));

    setDirection(nextStepIndex > currentStepIndex ? 1 : -1);
    setCurrentStepIndex(nextStepIndex);
  }

  function getStepErrorMessages(fields: readonly FieldPath<QuoteWizardValues>[]) {
    return Array.from(
      new Set(
        fields
          .map((field) => methods.getFieldState(field).error?.message)
          .filter((message): message is string => Boolean(message)),
      ),
    );
  }

  function focusStepError(fields: readonly FieldPath<QuoteWizardValues>[]) {
    const firstInvalidField = fields.find((field) => methods.getFieldState(field).invalid);

    window.requestAnimationFrame(() => {
      errorSummaryRef.current?.focus();

      if (!firstInvalidField) {
        return;
      }

      const target = document.querySelector<HTMLElement>(
        `[data-quote-field="${firstInvalidField}"]`,
      );

      target?.scrollIntoView?.({
        block: "center",
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });
    });
  }

  async function goNext() {
    const fields = stepFields[currentStep.id];
    const valid = fields.length === 0 || (await methods.trigger(fields, { shouldFocus: false }));

    if (!valid) {
      setStepErrors(getStepErrorMessages(fields));
      focusStepError(fields);
      return;
    }

    if (!isReviewStep) {
      setStepIndex(currentStepIndex + 1);
    }
  }

  function goBack() {
    setStepIndex(currentStepIndex - 1);
  }

  function restart() {
    resetWizard();
    methods.reset(defaultQuoteWizardValues);
    setStepErrors([]);
    setDirection(-1);
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={(event) => event.preventDefault()} noValidate>
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] xl:grid-cols-[minmax(0,1fr)_400px]">
          <div className="min-w-0">
            <WizardProgress currentStepIndex={currentStepIndex} />

            <section
              className="border-border bg-card mt-6 rounded-lg border shadow-lg"
              aria-labelledby="quote-step-heading"
            >
              <div className="border-border border-b p-5 sm:p-6">
                <p className="text-primary text-xs font-semibold tracking-[var(--letter-spacing-uppercase)] uppercase">
                  {currentStep.eyebrow}
                </p>
                <h2
                  ref={headingRef}
                  id="quote-step-heading"
                  tabIndex={-1}
                  className="mt-2 text-3xl font-bold outline-none"
                >
                  {currentStep.title}
                </h2>
                <p className="text-muted-foreground mt-2 max-w-2xl text-base">
                  {currentStep.description}
                </p>
                {stepErrors.length > 0 ? (
                  <div
                    ref={errorSummaryRef}
                    id="quote-step-error-summary"
                    role="alert"
                    tabIndex={-1}
                    className="border-destructive bg-error-light mt-5 rounded-lg border p-4 text-sm outline-none"
                  >
                    <p className="text-foreground font-semibold">Review this step</p>
                    <ul className="text-destructive mt-2 list-disc space-y-1 pl-5 font-medium">
                      {stepErrors.map((message) => (
                        <li key={message}>{message}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>

              <div className="p-5 sm:p-6">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={currentStep.id}
                    initial={
                      prefersReducedMotion
                        ? { opacity: 1, x: 0 }
                        : { opacity: 0, x: direction > 0 ? 40 : -40 }
                    }
                    animate={{ opacity: 1, x: 0 }}
                    exit={
                      prefersReducedMotion
                        ? { opacity: 1, x: 0 }
                        : { opacity: 0, x: direction > 0 ? -40 : 40 }
                    }
                    transition={prefersReducedMotion ? { duration: 0 } : springTransitions.standard}
                  >
                    {getStepContent(currentStepIndex, values, setStepIndex)}
                  </motion.div>
                </AnimatePresence>
              </div>

              <div
                role="group"
                aria-label="Quote actions and mobile summary"
                className="border-border bg-background sticky bottom-0 z-[var(--z-raised)] border-t p-4 pb-[max(var(--space-4),env(safe-area-inset-bottom))] shadow-xl lg:static lg:z-auto lg:p-6 lg:shadow-none"
              >
                <OrderSummary
                  values={values}
                  pricing={pricing}
                  currentStepIndex={currentStepIndex}
                  variant="mobile"
                />
                <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between lg:mt-0">
                  <div className="flex gap-3">
                    <Button type="button" variant="outline" disabled={isFirstStep} onClick={goBack}>
                      <ChevronLeft aria-hidden="true" className="size-4" />
                      Back
                    </Button>
                    {isReviewStep ? (
                      <Button type="button" variant="ghost" onClick={restart}>
                        <RotateCcw aria-hidden="true" className="size-4" />
                        Start over
                      </Button>
                    ) : null}
                  </div>
                  {!isReviewStep ? (
                    <Button type="button" className="min-h-11" onClick={goNext}>
                      Continue
                      <ChevronRight aria-hidden="true" className="size-4" />
                    </Button>
                  ) : null}
                </div>
              </div>
            </section>

            <p className="sr-only" aria-live="polite">
              Step {currentStepIndex + 1} of {quoteSteps.length}: {currentStep.title}
            </p>
          </div>

          <OrderSummary
            values={values}
            pricing={pricing}
            currentStepIndex={currentStepIndex}
            variant="desktop"
          />
        </div>
      </form>
    </FormProvider>
  );
}
