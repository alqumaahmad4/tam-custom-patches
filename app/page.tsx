import type { Metadata } from "next";

import { HomepageFoundation } from "@/features/homepage";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: {
    absolute: `Custom Manufacturing Homepage - ${siteConfig.name}`,
  },
  description:
    "Premium custom patches, apparel, uniforms, keychains, scout products, and stickers with free artwork support and worldwide shipping.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: siteConfig.name,
    description:
      "Explore premium custom manufacturing categories, process, industries, gallery previews, FAQs, and quote request paths.",
    url: "/",
    images: [
      {
        url: "/logos/logo.png",
        width: 3088,
        height: 330,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description:
      "Premium custom manufacturing for patches, apparel, uniforms, keychains, scout products, and stickers.",
    images: ["/logos/logo.png"],
  },
};

export const revalidate = 60;

export default function Home() {
  return <HomepageFoundation />;
}
