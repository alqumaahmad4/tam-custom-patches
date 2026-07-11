import { z } from "zod";
import type { FieldPath } from "react-hook-form";

import { getProductById, supportedArtworkExtensions } from "@/features/quote-wizard/data";

const fileMetadataSchema = z.object({
  name: z.string().min(1),
  size: z.number().nonnegative(),
  type: z.string(),
});

export const quoteWizardSchema = z
  .object({
    productId: z
      .string()
      .min(1, "Choose a product category.")
      .refine((value) => Boolean(getProductById(value)), "Choose a valid product category."),
    quantity: z.number().int("Please enter a whole number.").min(6, "Minimum quantity is 6 units."),
    size: z.string().min(1, "Choose a size."),
    customSize: z.string().optional(),
    artworkStatus: z.enum(["notStarted", "uploaded", "later"]),
    artworkFiles: z.array(fileMetadataSchema).max(5, "You can add up to 5 artwork files."),
    backing: z.string().min(1, "Choose a backing option."),
    border: z.string().min(1, "Choose a border option."),
    threadColors: z.string().min(1, "Choose a thread color range."),
    material: z.string().min(1, "Choose a material."),
    notes: z.string().max(1000, "Keep notes under 1,000 characters.").optional(),
  })
  .superRefine((value, context) => {
    if (value.size === "custom" && !value.customSize?.trim()) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["customSize"],
        message: "Describe the custom size.",
      });
    }

    if (value.artworkStatus === "notStarted") {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["artworkStatus"],
        message: "Upload artwork or choose to send it later.",
      });
    }

    for (const file of value.artworkFiles) {
      const extension = file.name.split(".").pop()?.toLowerCase();

      if (
        !extension ||
        !supportedArtworkExtensions.includes(
          extension as (typeof supportedArtworkExtensions)[number],
        )
      ) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["artworkFiles"],
          message: "Supported formats: AI, EPS, PDF, SVG, PNG, and JPG.",
        });
      }

      if (file.size > 50 * 1024 * 1024) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["artworkFiles"],
          message: "Maximum mock file size is 50MB.",
        });
      }
    }
  });

export type QuoteWizardValues = z.infer<typeof quoteWizardSchema>;

export const defaultQuoteWizardValues: QuoteWizardValues = {
  productId: "",
  quantity: 0,
  size: "",
  customSize: "",
  artworkStatus: "notStarted",
  artworkFiles: [],
  backing: "",
  border: "",
  threadColors: "",
  material: "",
  notes: "",
};

export const stepFields = {
  product: ["productId"],
  quantity: ["quantity"],
  size: ["size", "customSize"],
  artwork: ["artworkStatus", "artworkFiles"],
  customization: ["backing", "border", "threadColors", "material", "notes"],
  review: [],
} as const satisfies Record<string, readonly FieldPath<QuoteWizardValues>[]>;

export type QuoteWizardStepId = keyof typeof stepFields;
