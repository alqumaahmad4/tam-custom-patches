export const siteConfig = {
  name: "Tam Custom Patches",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://tamcustompatches.com",
  description:
    "Premium custom patches, apparel, martial arts uniforms, and promotional products made for quote-first manufacturing projects.",
  email: "sales@tamcustompatches.com",
} as const;

export const routes = {
  home: "/",
  quote: "/quote",
  customPatches: "/custom-patches",
  apparel: "/apparel",
  martialArts: "/martial-arts",
  accessories: "/accessories",
  gallery: "/gallery",
  blog: "/blog",
  about: "/about",
  contact: "/contact",
  privacy: "/privacy",
  terms: "/terms",
  accessibility: "/accessibility",
} as const;

export const primaryNavigation = [
  { label: "Custom Patches", href: routes.customPatches },
  { label: "Apparel", href: routes.apparel },
  { label: "Martial Arts", href: routes.martialArts },
  { label: "Accessories", href: routes.accessories },
  { label: "Gallery", href: routes.gallery },
  { label: "About", href: routes.about },
] as const;

export const tabletNavigation = [
  primaryNavigation[0],
  primaryNavigation[1],
  { label: "Quote", href: routes.quote },
] as const;

export const footerNavigation = [
  {
    title: "Products",
    links: [
      { label: "Custom Patches", href: routes.customPatches },
      { label: "Custom Apparel", href: routes.apparel },
      { label: "Martial Arts", href: routes.martialArts },
      { label: "Accessories", href: routes.accessories },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Gallery", href: routes.gallery },
      { label: "Get Free Quote", href: routes.quote },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: routes.about },
      { label: "Contact", href: routes.contact },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Privacy Policy", href: routes.privacy },
      { label: "Terms of Service", href: routes.terms },
      { label: "Accessibility", href: routes.accessibility },
    ],
  },
] as const;

export type NavigationItem = (typeof primaryNavigation)[number];
export type FooterNavigationGroup = (typeof footerNavigation)[number];
