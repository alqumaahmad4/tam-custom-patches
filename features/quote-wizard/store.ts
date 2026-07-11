import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import {
  defaultQuoteWizardValues,
  type QuoteWizardValues,
} from "@/features/quote-wizard/validation";

type QuoteWizardStore = {
  currentStepIndex: number;
  values: QuoteWizardValues;
  setCurrentStepIndex: (stepIndex: number) => void;
  updateValues: (values: Partial<QuoteWizardValues>) => void;
  resetWizard: () => void;
};

const memoryStorage = new Map<string, string>();

const sessionStorageProvider = () => {
  if (typeof window === "undefined") {
    return {
      getItem: (name: string) => memoryStorage.get(name) ?? null,
      setItem: (name: string, value: string) => {
        memoryStorage.set(name, value);
      },
      removeItem: (name: string) => {
        memoryStorage.delete(name);
      },
    };
  }

  return window.sessionStorage;
};

export const useQuoteWizardStore = create<QuoteWizardStore>()(
  persist(
    (set) => ({
      currentStepIndex: 0,
      values: defaultQuoteWizardValues,
      setCurrentStepIndex: (stepIndex) =>
        set({
          currentStepIndex: stepIndex,
        }),
      updateValues: (values) =>
        set((state) => ({
          values: {
            ...state.values,
            ...values,
          },
        })),
      resetWizard: () =>
        set({
          currentStepIndex: 0,
          values: defaultQuoteWizardValues,
        }),
    }),
    {
      name: "tam-quote-wizard-session",
      storage: createJSONStorage(sessionStorageProvider),
    },
  ),
);
