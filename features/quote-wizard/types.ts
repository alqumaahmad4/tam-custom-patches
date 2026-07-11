export type QuoteProductCategory = "patches" | "apparel" | "martialArts" | "accessories";

export type QuoteSizeFamily = "patch" | "apparel" | "martialArts" | "customDimension";

export type QuoteProduct = {
  id: string;
  label: string;
  category: QuoteProductCategory;
  sizeFamily: QuoteSizeFamily;
  description: string;
  minimumQuantity: number;
  priceModifier: number;
  turnaround: string;
};

export type QuoteArtworkStatus = "notStarted" | "uploaded" | "later";

export type QuoteArtworkFile = {
  name: string;
  size: number;
  type: string;
};

export type QuoteWizardStep = {
  id: "product" | "quantity" | "size" | "artwork" | "customization" | "review";
  title: string;
  eyebrow: string;
  description: string;
};

export type QuoteOption = {
  value: string;
  label: string;
  description?: string;
};
