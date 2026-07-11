import type { QuoteOption, QuoteProduct, QuoteWizardStep } from "@/features/quote-wizard/types";

export const quoteSteps = [
  {
    id: "product",
    title: "Choose product category",
    eyebrow: "Step 1",
    description: "Start with the item you want manufactured.",
  },
  {
    id: "quantity",
    title: "Choose quantity",
    eyebrow: "Step 2",
    description: "Pick a preset or enter the exact number you need.",
  },
  {
    id: "size",
    title: "Choose size",
    eyebrow: "Step 3",
    description: "Use the standard sizing set for the selected product.",
  },
  {
    id: "artwork",
    title: "Artwork upload",
    eyebrow: "Step 4",
    description: "Add artwork files or choose to send them later.",
  },
  {
    id: "customization",
    title: "Customization",
    eyebrow: "Step 5",
    description: "Choose production details that help the team prepare the quote.",
  },
  {
    id: "review",
    title: "Review",
    eyebrow: "Step 6",
    description: "Confirm selections and edit any section before submission is added.",
  },
] as const satisfies readonly QuoteWizardStep[];

export const quoteProductOptions = [
  {
    id: "embroidered-patches",
    label: "Embroidered Patches",
    category: "patches",
    sizeFamily: "patch",
    description: "Thread-rich patches for clubs, teams, uniforms, and brands.",
    minimumQuantity: 6,
    priceModifier: 1,
    turnaround: "7-14 business days",
  },
  {
    id: "pvc-patches",
    label: "PVC Patches",
    category: "patches",
    sizeFamily: "patch",
    description: "Dimensional, durable patches for tactical and outdoor use.",
    minimumQuantity: 6,
    priceModifier: 1.18,
    turnaround: "10-16 business days",
  },
  {
    id: "woven-patches",
    label: "Woven Patches",
    category: "patches",
    sizeFamily: "patch",
    description: "Fine-detail patches for small text and precise artwork.",
    minimumQuantity: 6,
    priceModifier: 0.96,
    turnaround: "8-14 business days",
  },
  {
    id: "printed-patches",
    label: "Printed Patches",
    category: "patches",
    sizeFamily: "patch",
    description: "Full-color artwork with crisp edge definition.",
    minimumQuantity: 6,
    priceModifier: 0.9,
    turnaround: "7-12 business days",
  },
  {
    id: "chenille-patches",
    label: "Chenille Patches",
    category: "patches",
    sizeFamily: "patch",
    description: "Varsity texture for letters, teams, and statement pieces.",
    minimumQuantity: 6,
    priceModifier: 1.25,
    turnaround: "12-18 business days",
  },
  {
    id: "velcro-patches",
    label: "Velcro Patches",
    category: "patches",
    sizeFamily: "patch",
    description: "Removable patches for gear, bags, uniforms, and field use.",
    minimumQuantity: 6,
    priceModifier: 1.12,
    turnaround: "8-15 business days",
  },
  {
    id: "t-shirts",
    label: "T-Shirts",
    category: "apparel",
    sizeFamily: "apparel",
    description: "Custom shirts for teams, events, staff, and retail programs.",
    minimumQuantity: 6,
    priceModifier: 1,
    turnaround: "10-15 business days",
  },
  {
    id: "hoodies",
    label: "Hoodies",
    category: "apparel",
    sizeFamily: "apparel",
    description: "Premium fleece programs for teams and organizations.",
    minimumQuantity: 6,
    priceModifier: 1.35,
    turnaround: "12-18 business days",
  },
  {
    id: "polo-shirts",
    label: "Polo Shirts",
    category: "apparel",
    sizeFamily: "apparel",
    description: "Professional apparel for staff, corporate, and club use.",
    minimumQuantity: 6,
    priceModifier: 1.2,
    turnaround: "10-16 business days",
  },
  {
    id: "activewear",
    label: "Activewear",
    category: "apparel",
    sizeFamily: "apparel",
    description: "Performance apparel for training, sports, and movement.",
    minimumQuantity: 6,
    priceModifier: 1.18,
    turnaround: "12-18 business days",
  },
  {
    id: "jerseys",
    label: "Jerseys",
    category: "apparel",
    sizeFamily: "apparel",
    description: "Team identity pieces for sports programs and events.",
    minimumQuantity: 6,
    priceModifier: 1.3,
    turnaround: "12-18 business days",
  },
  {
    id: "tank-tops",
    label: "Tank Tops",
    category: "apparel",
    sizeFamily: "apparel",
    description: "Lightweight custom apparel for teams and warm-weather events.",
    minimumQuantity: 6,
    priceModifier: 0.92,
    turnaround: "10-15 business days",
  },
  {
    id: "martial-arts-uniforms",
    label: "Martial Arts Uniforms",
    category: "martialArts",
    sizeFamily: "martialArts",
    description: "Competition-grade customization for dojos, clubs, and teams.",
    minimumQuantity: 6,
    priceModifier: 1.55,
    turnaround: "14-21 business days",
  },
  {
    id: "scout-neckerchiefs",
    label: "Scout Neckerchiefs",
    category: "accessories",
    sizeFamily: "customDimension",
    description: "Scout-ready neckerchiefs for groups, camps, and events.",
    minimumQuantity: 6,
    priceModifier: 0.88,
    turnaround: "10-16 business days",
  },
] as const satisfies readonly QuoteProduct[];

export const quantityPresets = [6, 10, 25, 50, 100, 250, 500, 1000] as const;

export const sizeOptionsByFamily = {
  patch: [
    { value: "2-inch", label: '2"' },
    { value: "3-inch", label: '3"' },
    { value: "4-inch", label: '4"' },
    { value: "5-inch", label: '5"' },
    { value: "6-inch", label: '6"' },
    { value: "custom", label: "Custom" },
  ],
  apparel: [
    { value: "xs", label: "XS" },
    { value: "s", label: "S" },
    { value: "m", label: "M" },
    { value: "l", label: "L" },
    { value: "xl", label: "XL" },
    { value: "2xl", label: "2XL" },
    { value: "3xl", label: "3XL" },
    { value: "4xl", label: "4XL" },
    { value: "5xl", label: "5XL" },
  ],
  martialArts: [
    { value: "a0", label: "A0" },
    { value: "a1", label: "A1" },
    { value: "a2", label: "A2" },
    { value: "a3", label: "A3" },
    { value: "a4", label: "A4" },
    { value: "a5", label: "A5" },
    { value: "custom", label: "Custom" },
  ],
  customDimension: [{ value: "custom", label: "Custom" }],
} as const satisfies Record<QuoteProduct["sizeFamily"], readonly QuoteOption[]>;

export const backingOptions = [
  { value: "sew-on", label: "Sew-on", description: "Classic finish for garments and uniforms." },
  { value: "iron-on", label: "Iron-on", description: "Heat-applied backing for quick placement." },
  { value: "velcro", label: "Velcro", description: "Removable backing for field gear and bags." },
  { value: "peel-stick", label: "Peel & stick", description: "Temporary adhesive for events." },
  { value: "none", label: "No backing", description: "Best for items that are already sewn in." },
] as const satisfies readonly QuoteOption[];

export const borderOptions = [
  {
    value: "merrowed",
    label: "Merrowed",
    description: "Rounded stitched edge for classic patches.",
  },
  { value: "hot-cut", label: "Hot cut", description: "Clean edge for custom shapes." },
  {
    value: "laser-cut",
    label: "Laser cut",
    description: "Precise detail for intricate silhouettes.",
  },
  { value: "overlap", label: "Overlap stitch", description: "Premium raised edge treatment." },
] as const satisfies readonly QuoteOption[];

export const threadColorOptions = [
  { value: "1-3", label: "1-3 colors" },
  { value: "4-6", label: "4-6 colors" },
  { value: "7-9", label: "7-9 colors" },
  { value: "10-plus", label: "10+ colors" },
  { value: "match-artwork", label: "Match artwork" },
] as const satisfies readonly QuoteOption[];

export const materialOptions = [
  { value: "twill", label: "Twill", description: "Standard patch base with clean structure." },
  { value: "felt", label: "Felt", description: "Soft texture for chenille and varsity looks." },
  { value: "pvc", label: "PVC", description: "Flexible dimensional material." },
  { value: "woven-fabric", label: "Woven fabric", description: "Fine detail with smooth finish." },
  { value: "cotton-poly", label: "Cotton/poly", description: "Reliable apparel base." },
  { value: "gi-weave", label: "Gi weave", description: "Durable uniform fabric for martial arts." },
  {
    value: "performance-knit",
    label: "Performance knit",
    description: "Stretch-friendly athletic fabric.",
  },
] as const satisfies readonly QuoteOption[];

export const supportedArtworkExtensions = [
  "ai",
  "eps",
  "pdf",
  "svg",
  "png",
  "jpg",
  "jpeg",
] as const;

export function getProductById(productId: string | undefined) {
  return quoteProductOptions.find((product) => product.id === productId);
}

export function getOptionLabel(options: readonly QuoteOption[], value: string | undefined) {
  return options.find((option) => option.value === value)?.label;
}
