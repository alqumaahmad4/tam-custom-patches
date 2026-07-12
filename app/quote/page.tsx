import type { Metadata } from "next";

import { QuoteWizardPage } from "@/features/quote-wizard";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Get a Quote",
  description:
    "Build a frontend quote request for custom patches, apparel, martial arts uniforms, and scout accessories.",
  alternates: {
    canonical: "/quote",
  },
  openGraph: {
    title: `Get a Quote - ${siteConfig.name}`,
    description:
      "Choose product, quantity, size, artwork, customization, and review a live quote summary.",
    url: "/quote",
  },
};

export default function QuotePage() {
  return <QuoteWizardPage />;
}
