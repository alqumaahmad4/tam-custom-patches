import { getProductById } from "@/features/quote-wizard/data";
import type { QuoteWizardValues } from "@/features/quote-wizard/validation";

export type QuotePricingInput = Pick<
  QuoteWizardValues,
  "productId" | "quantity" | "size" | "backing" | "border" | "threadColors" | "material"
>;

export type QuotePricingResult = {
  basePrice: number;
  minimum: number;
  maximum: number;
  formattedRange: string;
  quantityMultiplier: number;
  sizeModifier: number;
  productModifier: number;
  optionModifier: number;
  turnaround: string;
  shipping: string;
  confidence: "placeholder" | "configured";
};

export type PricingEngine = (input: QuotePricingInput) => QuotePricingResult;

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

function getQuantityMultiplier(quantity: number) {
  if (quantity >= 1000) {
    return 0.58;
  }

  if (quantity >= 500) {
    return 0.64;
  }

  if (quantity >= 250) {
    return 0.72;
  }

  if (quantity >= 100) {
    return 0.82;
  }

  if (quantity >= 50) {
    return 0.92;
  }

  return 1;
}

function getSizeModifier(size: string) {
  if (size === "custom") {
    return 1.18;
  }

  if (["5-inch", "6-inch", "4xl", "5xl", "a4", "a5"].includes(size)) {
    return 1.14;
  }

  if (["2-inch", "xs", "s", "a0", "a1"].includes(size)) {
    return 0.94;
  }

  return 1;
}

function getOptionModifier(input: QuotePricingInput) {
  let modifier = 1;

  if (input.backing === "velcro") {
    modifier += 0.08;
  }

  if (input.border === "laser-cut" || input.border === "overlap") {
    modifier += 0.06;
  }

  if (input.threadColors === "10-plus" || input.threadColors === "match-artwork") {
    modifier += 0.08;
  }

  if (input.material === "pvc" || input.material === "gi-weave") {
    modifier += 0.08;
  }

  return modifier;
}

export const frontendPricingEngine: PricingEngine = (input) => {
  const product = getProductById(input.productId);
  const quantity = Number.isFinite(input.quantity) ? input.quantity : 0;
  const basePrice =
    product?.category === "apparel" ? 18 : product?.category === "martialArts" ? 58 : 5;
  const quantityMultiplier = getQuantityMultiplier(quantity);
  const sizeModifier = getSizeModifier(input.size);
  const productModifier = product?.priceModifier ?? 1;
  const optionModifier = getOptionModifier(input);
  const estimatedUnit =
    basePrice * quantityMultiplier * sizeModifier * productModifier * optionModifier;
  const midpoint = Math.max(quantity, 0) * estimatedUnit;
  const minimum = Math.max(0, Math.round(midpoint * 0.85));
  const maximum = Math.max(minimum, Math.round(midpoint * 1.25));
  const formattedRange =
    minimum > 0
      ? `${currencyFormatter.format(minimum)} - ${currencyFormatter.format(maximum)}`
      : "Select product and quantity";

  return {
    basePrice,
    minimum,
    maximum,
    formattedRange,
    quantityMultiplier,
    sizeModifier,
    productModifier,
    optionModifier,
    turnaround: product?.turnaround ?? "Select a product",
    shipping: "Worldwide shipping estimate: 3-15 business days",
    confidence: "placeholder",
  };
};
