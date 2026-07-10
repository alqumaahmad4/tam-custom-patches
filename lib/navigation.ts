import {
  Building2,
  FileQuestion,
  GalleryHorizontal,
  GraduationCap,
  Handshake,
  HelpCircle,
  KeyRound,
  Medal,
  Newspaper,
  PackageCheck,
  Palette,
  Repeat2,
  Scissors,
  Shield,
  Shirt,
  Sparkles,
  Star,
  Sticker,
  Target,
  Truck,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { routes } from "@/lib/site-config";

export type NavigationLink = {
  label: string;
  href: string;
  description?: string;
  icon?: LucideIcon;
};

export type NavigationGroup = {
  id: string;
  label: string;
  href: string;
  description: string;
  featured?: NavigationLink;
  productLinks: readonly NavigationLink[];
  industryLinks: readonly NavigationLink[];
  resourceLinks: readonly NavigationLink[];
};

export type FooterNavigationGroup = {
  title: string;
  links: readonly NavigationLink[];
};

export type SearchContentType = "Products" | "Product categories" | "Industries" | "Blog";

export type SearchIndexItem = NavigationLink & {
  type: SearchContentType;
  keywords: readonly string[];
};

export const patchProductLinks = [
  {
    label: "Embroidered Patches",
    href: routes.embroideredPatches,
    description: "Thread-rich patches for uniforms, clubs, and brands.",
    icon: Palette,
  },
  {
    label: "PVC Patches",
    href: routes.pvcPatches,
    description: "Durable dimensional patches for tactical and outdoor use.",
    icon: Shield,
  },
  {
    label: "Woven Patches",
    href: routes.wovenPatches,
    description: "Fine-detail patches for small text and precise artwork.",
    icon: Scissors,
  },
  {
    label: "Chenille Patches",
    href: routes.chenillePatches,
    description: "Varsity texture for letters, teams, and statement pieces.",
    icon: Star,
  },
  {
    label: "Printed Patches",
    href: routes.printedPatches,
    description: "Full-color artwork with clean edge definition.",
    icon: GalleryHorizontal,
  },
  {
    label: "Velcro Patches",
    href: routes.velcroPatches,
    description: "Removable patches for bags, gear, and uniforms.",
    icon: PackageCheck,
  },
] as const satisfies readonly NavigationLink[];

export const apparelProductLinks = [
  {
    label: "T-Shirts",
    href: routes.tshirts,
    description: "Short-sleeve and long-sleeve apparel programs.",
    icon: Shirt,
  },
  {
    label: "Hoodies",
    href: routes.hoodies,
    description: "Warm branded layers for teams and organizations.",
    icon: Shirt,
  },
  {
    label: "Crewnecks",
    href: routes.crewnecks,
    description: "Premium fleece programs with polished branding.",
    icon: Shirt,
  },
  {
    label: "Polo Shirts",
    href: routes.poloShirts,
    description: "Staff-ready apparel for professional programs.",
    icon: Shirt,
  },
  {
    label: "Jerseys",
    href: routes.jerseys,
    description: "Team identity pieces for events and sports groups.",
    icon: Medal,
  },
  {
    label: "Activewear",
    href: routes.activewear,
    description: "Performance apparel for training and movement.",
    icon: Target,
  },
] as const satisfies readonly NavigationLink[];

export const martialArtsProductLinks = [
  {
    label: "BJJ Gis",
    href: routes.bjjGis,
    description: "Academy-ready Brazilian Jiu-Jitsu uniforms.",
    icon: Medal,
  },
  {
    label: "Karate Uniforms",
    href: routes.karateUniforms,
    description: "Clean uniform programs for schools and teams.",
    icon: Medal,
  },
  {
    label: "Taekwondo Uniforms",
    href: routes.taekwondoUniforms,
    description: "Competition and academy uniforms with custom details.",
    icon: Medal,
  },
  {
    label: "Judo Uniforms",
    href: routes.judoUniforms,
    description: "Durable uniforms built for training programs.",
    icon: Medal,
  },
  {
    label: "Training Apparel",
    href: routes.martialArtsTrainingApparel,
    description: "Team apparel for martial arts clubs and events.",
    icon: Shirt,
  },
] as const satisfies readonly NavigationLink[];

export const accessoryProductLinks = [
  {
    label: "Scout Neckerchiefs",
    href: routes.scoutNeckerchiefs,
    description: "Scout-ready accessories for groups and events.",
    icon: Users,
  },
  {
    label: "Embroidered Keychains",
    href: routes.embroideredKeychains,
    description: "Soft goods with stitched detail and compact branding.",
    icon: KeyRound,
  },
  {
    label: "PVC Keychains",
    href: routes.pvcKeychains,
    description: "Dimensional keychains for clubs, teams, and promos.",
    icon: KeyRound,
  },
  {
    label: "Stickers",
    href: routes.stickers,
    description: "Durable sticker sets for packaging and events.",
    icon: Sticker,
  },
] as const satisfies readonly NavigationLink[];

export const industryLinks = [
  { label: "Military & Defense", href: routes.militaryIndustry, icon: Shield },
  { label: "Law Enforcement", href: routes.lawEnforcementIndustry, icon: Shield },
  { label: "Sports Teams", href: routes.sportsTeamsIndustry, icon: Medal },
  { label: "Schools & Universities", href: routes.schoolsIndustry, icon: GraduationCap },
  { label: "Scout Groups", href: routes.scoutGroupsIndustry, icon: Users },
  { label: "Motorcycle Clubs", href: routes.motorcycleClubsIndustry, icon: Users },
  { label: "Fashion Brands", href: routes.fashionBrandsIndustry, icon: Shirt },
  { label: "Corporate & Workwear", href: routes.workwearIndustry, icon: Building2 },
  { label: "Events & Festivals", href: routes.eventsIndustry, icon: Sparkles },
  { label: "Martial Arts Clubs", href: routes.martialArtsClubsIndustry, icon: Medal },
] as const satisfies readonly NavigationLink[];

export const resourceLinks = [
  {
    label: "Gallery",
    href: routes.gallery,
    description: "Browse placeholder project inspiration and proof points.",
    icon: GalleryHorizontal,
  },
  {
    label: "Size Guide",
    href: routes.sizeGuide,
    description: "Plan patch, apparel, and uniform sizing before a quote.",
    icon: FileQuestion,
  },
  {
    label: "FAQ",
    href: routes.faq,
    description: "Answers for artwork, production, shipping, and quote planning.",
    icon: HelpCircle,
  },
  {
    label: "Blog",
    href: routes.blog,
    description: "Planning guides and educational placeholders.",
    icon: Newspaper,
  },
  {
    label: "Shipping",
    href: routes.shipping,
    description: "Worldwide shipping information and delivery planning.",
    icon: Truck,
  },
  {
    label: "Contact",
    href: routes.contact,
    description: "Talk to the team before starting a request.",
    icon: Handshake,
  },
] as const satisfies readonly NavigationLink[];

const toolLinks = [
  {
    label: "Get Free Quote",
    href: routes.quote,
    description: "Start a quote request with artwork support.",
    icon: PackageCheck,
  },
  {
    label: "AI Designer",
    href: routes.aiDesigner,
    description: "Open the design tool entry point.",
    icon: Sparkles,
  },
  {
    label: "Reorder",
    href: routes.reorder,
    description: "Return with a previous order or saved request.",
    icon: Repeat2,
  },
  resourceLinks[1],
  resourceLinks[0],
] as const satisfies readonly NavigationLink[];

export const navigationGroups = [
  {
    id: "custom-patches",
    label: "Custom Patches",
    href: routes.customPatches,
    description: "Patch programs for uniforms, clubs, teams, and brands.",
    featured: patchProductLinks[0],
    productLinks: patchProductLinks,
    industryLinks: industryLinks.slice(0, 6),
    resourceLinks: toolLinks,
  },
  {
    id: "custom-apparel",
    label: "Custom Apparel",
    href: routes.apparel,
    description: "Apparel runs for teams, staff, events, and branded programs.",
    featured: apparelProductLinks[1],
    productLinks: apparelProductLinks,
    industryLinks: [industryLinks[2], industryLinks[3], industryLinks[6], industryLinks[7]],
    resourceLinks: toolLinks,
  },
  {
    id: "martial-arts",
    label: "Martial Arts Uniforms & Gear",
    href: routes.martialArts,
    description: "Uniforms and gear for academies, clubs, and competition teams.",
    featured: martialArtsProductLinks[0],
    productLinks: martialArtsProductLinks,
    industryLinks: [industryLinks[9], industryLinks[2], industryLinks[3], industryLinks[8]],
    resourceLinks: toolLinks,
  },
  {
    id: "accessories",
    label: "Accessories",
    href: routes.accessories,
    description: "Keychains, stickers, scout products, and supporting programs.",
    featured: accessoryProductLinks[1],
    productLinks: accessoryProductLinks,
    industryLinks: [industryLinks[4], industryLinks[5], industryLinks[8], industryLinks[6]],
    resourceLinks: toolLinks,
  },
  {
    id: "industries",
    label: "Industries",
    href: routes.industries,
    description: "Find the right manufacturing path by organization type.",
    featured: industryLinks[2],
    productLinks: industryLinks,
    industryLinks,
    resourceLinks: toolLinks,
  },
  {
    id: "resources",
    label: "Resources",
    href: routes.gallery,
    description: "Guides, gallery previews, FAQs, and quote planning links.",
    featured: resourceLinks[0],
    productLinks: resourceLinks,
    industryLinks: industryLinks.slice(0, 4),
    resourceLinks: toolLinks,
  },
] as const satisfies readonly NavigationGroup[];

export const tabletNavigation = [
  navigationGroups[0],
  navigationGroups[1],
  { label: "Quote", href: routes.quote },
] as const satisfies readonly NavigationLink[];

export const footerNavigation = [
  {
    title: "Products",
    links: navigationGroups.slice(0, 4).map(({ label, href }) => ({ label, href })),
  },
  {
    title: "Resources",
    links: [resourceLinks[0], resourceLinks[1], resourceLinks[2], toolLinks[0]],
  },
  {
    title: "Company",
    links: [
      { label: "Industries", href: routes.industries },
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
      { label: "Sitemap", href: routes.sitemap },
    ],
  },
] as const satisfies readonly FooterNavigationGroup[];

const productCategorySearchItems = navigationGroups.slice(0, 4).map((group) => ({
  label: group.label,
  href: group.href,
  description: group.description,
  type: "Product categories" as const,
  keywords: [group.label, group.description],
}));

const productSearchItems = [
  ...patchProductLinks,
  ...apparelProductLinks,
  ...martialArtsProductLinks,
  ...accessoryProductLinks,
].map((item) => ({
  ...item,
  type: "Products" as const,
  keywords: [item.label, item.description ?? ""],
}));

const industrySearchItems = industryLinks.map((item) => ({
  ...item,
  type: "Industries" as const,
  keywords: [item.label, "industries", "who orders"],
}));

const blogSearchItems = [
  {
    label: "Planning a custom patch order",
    href: `${routes.blog}/planning-a-custom-patch-order`,
    description: "Artwork, size, backing, and quantity planning.",
    icon: Newspaper,
    type: "Blog" as const,
    keywords: ["custom patch order", "artwork", "backing", "quantity"],
  },
  {
    label: "Choosing materials for team apparel",
    href: `${routes.blog}/choosing-materials-for-team-apparel`,
    description: "A practical guide to apparel programs and finish choices.",
    icon: Newspaper,
    type: "Blog" as const,
    keywords: ["apparel", "materials", "teamwear", "hoodies"],
  },
  {
    label: "Uniform details that make teams feel professional",
    href: `${routes.blog}/uniform-details-that-make-teams-feel-professional`,
    description: "Planning martial arts uniforms and branded details.",
    icon: Newspaper,
    type: "Blog" as const,
    keywords: ["uniforms", "martial arts", "bjj gi", "academy"],
  },
] satisfies readonly SearchIndexItem[];

export const searchIndex = [
  ...productSearchItems,
  ...productCategorySearchItems,
  ...industrySearchItems,
  ...blogSearchItems,
] as const satisfies readonly SearchIndexItem[];

export const popularSearches = ["Custom Embroidered Patches", "BJJ Gi", "Bulk Hoodies"] as const;

export const countryOptions = [
  { code: "US", label: "United States", currency: "USD" },
  { code: "CA", label: "Canada", currency: "CAD" },
  { code: "GB", label: "United Kingdom", currency: "GBP" },
  { code: "AU", label: "Australia", currency: "AUD" },
  { code: "EU", label: "European Union", currency: "EUR" },
  { code: "PK", label: "Pakistan", currency: "PKR" },
] as const;
