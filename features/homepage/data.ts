import { routes } from "@/lib/site-config";

export type PlaceholderTone = "neutral" | "accent" | "gold" | "dark" | "success" | "info";

export const trustSignals = [
  {
    title: "Free Artwork",
    description: "Professional artwork support before production.",
    icon: "artwork",
  },
  {
    title: "Free Worldwide Shipping",
    description: "Delivery planning for teams around the world.",
    icon: "shipping",
  },
  {
    title: "Premium Quality",
    description: "Materials selected for durable everyday use.",
    icon: "quality",
  },
  {
    title: "Satisfaction Guaranteed",
    description: "Clear approvals before every production run.",
    icon: "guarantee",
  },
] as const;

export const featuredCategories = [
  {
    title: "Custom Patches",
    description: "Embroidered, PVC, woven, chenille, printed, and velcro patch options.",
    href: routes.customPatches,
    label: "Patch programs",
    tone: "accent",
  },
  {
    title: "Custom Apparel",
    description: "Branded uniforms, team apparel, and promotional garments.",
    href: routes.apparel,
    label: "Apparel runs",
    tone: "neutral",
  },
  {
    title: "Martial Arts Uniforms",
    description: "Premium uniforms and accessories for academies, teams, and events.",
    href: routes.martialArts,
    label: "Academy gear",
    tone: "gold",
  },
  {
    title: "Keychains",
    description: "Soft PVC, embroidered, woven, and promotional keychain programs.",
    href: routes.accessories,
    label: "Accessories",
    tone: "info",
  },
  {
    title: "Scout Products",
    description: "Editable foundations for patches, scarves, badges, and troop gear.",
    href: routes.accessories,
    label: "Scout ready",
    tone: "success",
  },
  {
    title: "Stickers",
    description: "Durable sticker layouts for events, clubs, packaging, and promotions.",
    href: routes.accessories,
    label: "Print extras",
    tone: "dark",
  },
] as const satisfies ReadonlyArray<{
  title: string;
  description: string;
  href: string;
  label: string;
  tone: PlaceholderTone;
}>;

export const whyChooseItems = [
  {
    title: "Premium manufacturing",
    description: "Structured production support for custom patch and apparel programs.",
    icon: "manufacturing",
  },
  {
    title: "Worldwide shipping",
    description: "A global fulfillment posture designed for clubs, teams, and organizations.",
    icon: "shipping",
  },
  {
    title: "No hidden costs",
    description: "Quote-first ordering keeps expectations clear before production begins.",
    icon: "costs",
  },
  {
    title: "Premium materials",
    description: "Material choices are positioned around durability, finish, and use case.",
    icon: "materials",
  },
  {
    title: "Dedicated support",
    description: "A clear human handoff from idea sharing through artwork approvals.",
    icon: "support",
  },
  {
    title: "Fast turnaround",
    description: "A simple production path keeps approved projects moving efficiently.",
    icon: "turnaround",
  },
  {
    title: "Professional artwork",
    description: "Artwork review helps every order feel polished before manufacturing.",
    icon: "artwork",
  },
] as const;

export const processSteps = [
  {
    step: "Step 1",
    title: "Share your idea",
    description: "Send the product type, quantity, artwork, and goals.",
  },
  {
    step: "Step 2",
    title: "Approve artwork",
    description: "Review the production-ready artwork before the run starts.",
  },
  {
    step: "Step 3",
    title: "Production",
    description: "Your approved design moves through the right manufacturing workflow.",
  },
  {
    step: "Step 4",
    title: "Worldwide delivery",
    description: "Finished items are prepared for delivery to your destination.",
  },
] as const;

export const industriesServed = [
  "Motorcycle Clubs",
  "Businesses",
  "Sports Teams",
  "Schools",
  "Scouts",
  "Military",
  "Police",
  "Fire Department",
  "Martial Arts",
  "Events",
  "Organizations",
] as const;

export const galleryPreviewItems = [
  { title: "Patch preview", label: "Custom patch", tone: "accent", size: "tall" },
  { title: "Uniform preview", label: "Martial arts", tone: "gold", size: "standard" },
  { title: "Apparel preview", label: "Team apparel", tone: "neutral", size: "wide" },
  { title: "Keychain preview", label: "Accessories", tone: "info", size: "standard" },
  { title: "Scout preview", label: "Scout products", tone: "success", size: "wide" },
  { title: "Sticker preview", label: "Sticker set", tone: "dark", size: "tall" },
] as const satisfies ReadonlyArray<{
  title: string;
  label: string;
  tone: PlaceholderTone;
  size: "standard" | "wide" | "tall";
}>;

export const testimonials = [
  {
    quote:
      "The artwork process felt clear from the first message, and the finished patches had the polished feel our club wanted.",
    name: "Avery Morgan",
    company: "North Star Riders",
  },
  {
    quote:
      "Our team needed branded pieces for a growing program, and the quote-first process made the next step easy to understand.",
    name: "Jordan Lee",
    company: "Civic Works Studio",
  },
  {
    quote:
      "The uniform and patch options were easy to review, and the approval step gave our academy confidence before production.",
    name: "Samira Khan",
    company: "Summit Martial Arts",
  },
] as const;

export const faqItems = [
  {
    question: "What products can I request?",
    answer:
      "You can request custom patches, apparel, martial arts uniforms, keychains, scout products, stickers, and related manufacturing programs.",
  },
  {
    question: "Can I send artwork later?",
    answer:
      "Yes. You can start with an idea, rough file, or written notes before the artwork is finalized for approval.",
  },
  {
    question: "Is artwork support included?",
    answer:
      "Artwork support is included so your design can be reviewed and approved before production begins.",
  },
  {
    question: "Do you ship worldwide?",
    answer:
      "Yes. The homepage foundation supports a worldwide shipping message for customers across regions.",
  },
  {
    question: "How do I get started?",
    answer:
      "Start with the product type, estimated quantity, and any design notes so the request has the right context.",
    cta: {
      label: "Request a free quote",
      href: routes.quote,
    },
  },
] as const;

export const blogPreviewArticles = [
  {
    title: "Planning a custom patch order",
    excerpt: "A starter guide for artwork, size, backing, and quantity planning.",
    category: "Guides",
    href: `${routes.blog}/planning-a-custom-patch-order`,
    tone: "accent",
  },
  {
    title: "Choosing materials for team apparel",
    excerpt: "A quick overview of apparel programs, use cases, and finish decisions.",
    category: "Materials",
    href: `${routes.blog}/choosing-materials-for-team-apparel`,
    tone: "neutral",
  },
  {
    title: "Uniform details that make teams feel professional",
    excerpt: "Planning notes for martial arts uniforms, team identity, and branded details.",
    category: "Uniforms",
    href: `${routes.blog}/uniform-details-that-make-teams-feel-professional`,
    tone: "gold",
  },
] as const satisfies ReadonlyArray<{
  title: string;
  excerpt: string;
  category: string;
  href: string;
  tone: PlaceholderTone;
}>;
