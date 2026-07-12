import {
  BriefcaseBusiness,
  Building2,
  CircleHelp,
  ClipboardList,
  Contact,
  FileQuestion,
  Flame,
  GalleryHorizontal,
  GraduationCap,
  Handshake,
  HelpCircle,
  KeyRound,
  Layers,
  Medal,
  Newspaper,
  PackageCheck,
  Palette,
  Repeat2,
  Ruler,
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
  keywords?: readonly string[];
  planned?: boolean;
};

export type ProductGroupId = "patches" | "apparel" | "activewear" | "martial-arts" | "accessories";

export type ProductNavigationGroup = {
  id: ProductGroupId;
  label: string;
  href: string;
  description: string;
  viewAllLabel: string;
  links: readonly NavigationLink[];
};

export type NavigationGroupId =
  "products" | "industries" | "design-pricing" | "guides-support" | "about";

export type NavigationGroup = {
  id: NavigationGroupId;
  label: string;
  href: string;
  description: string;
  links: readonly NavigationLink[];
  activeHrefs?: readonly string[];
};

export type ProductMegaMenuAction = NavigationLink & {
  variant: "link" | "secondary" | "primary";
};

export type FooterNavigationGroup = {
  title: string;
  links: readonly NavigationLink[];
};

export type SearchContentType =
  | "Products"
  | "Product groups"
  | "Industries"
  | "Design & Pricing"
  | "Guides & Support"
  | "About"
  | "Blog";

export type SearchIndexItem = NavigationLink & {
  type: SearchContentType;
  keywords: readonly string[];
};

export const productNavigationGroups = [
  {
    id: "patches",
    label: "Custom Patches",
    href: routes.customPatches,
    description: "Patch programs for uniforms, clubs, teams, and brands.",
    viewAllLabel: "View All Custom Patches",
    links: [
      {
        label: "Embroidered Patches",
        href: routes.embroideredPatches,
        description: "Thread-rich patches for uniforms, clubs, and brands.",
        icon: Palette,
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
        label: "PVC Patches",
        href: routes.pvcPatches,
        description: "Durable dimensional patches for tactical and outdoor use.",
        icon: Shield,
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
    ],
  },
  {
    id: "apparel",
    label: "Custom Apparel",
    href: routes.apparel,
    description: "Apparel runs for teams, staff, events, and branded programs.",
    viewAllLabel: "View All Custom Apparel",
    links: [
      {
        label: "T-Shirts",
        href: routes.tshirts,
        description: "Premium custom shirts for events, brands, and teams.",
        icon: Shirt,
      },
      {
        label: "Long-Sleeve Shirts",
        href: routes.longSleeveShirts,
        description: "Long-sleeve apparel programs for cooler seasons and uniforms.",
        icon: Shirt,
        planned: true,
      },
      {
        label: "Polo Shirts",
        href: routes.poloShirts,
        description: "Staff-ready apparel for professional programs.",
        icon: Shirt,
      },
      {
        label: "Hoodies",
        href: routes.hoodies,
        description: "Warm branded layers for teams and organizations.",
        icon: Shirt,
      },
      {
        label: "Sweatshirts",
        href: routes.sweatshirts,
        description: "Comfortable branded fleece for organizations and teams.",
        icon: Shirt,
      },
      {
        label: "Crewnecks",
        href: routes.crewnecks,
        description: "Premium fleece programs with polished branding.",
        icon: Shirt,
      },
      {
        label: "Tank Tops",
        href: routes.tankTops,
        description: "Lightweight custom apparel for events and warm-weather programs.",
        icon: Shirt,
      },
    ],
  },
  {
    id: "activewear",
    label: "Custom Activewear",
    href: routes.activewear,
    description: "Performance apparel for training, movement, and team programs.",
    viewAllLabel: "View All Custom Activewear",
    links: [
      {
        label: "Performance T-Shirts",
        href: routes.performanceTshirts,
        description: "Breathable training shirts for teams and active programs.",
        icon: Target,
        planned: true,
      },
      {
        label: "Training Tops",
        href: routes.trainingTops,
        description: "Custom tops for gym, club, and team training.",
        icon: Target,
        planned: true,
      },
      {
        label: "Training Shorts",
        href: routes.trainingShorts,
        description: "Performance shorts for sports, workouts, and active teams.",
        icon: Target,
        planned: true,
      },
      {
        label: "Tracksuits",
        href: routes.tracksuits,
        description: "Coordinated team tracksuits with custom branding.",
        icon: Target,
        planned: true,
      },
      {
        label: "Team Jerseys",
        href: routes.jerseys,
        description: "Team identity pieces for events and sports groups.",
        icon: Medal,
      },
      {
        label: "Sports Uniforms",
        href: routes.sportsUniforms,
        description: "Coordinated sports uniforms for clubs, schools, and teams.",
        icon: Medal,
        planned: true,
      },
    ],
  },
  {
    id: "martial-arts",
    label: "Martial Arts Uniforms & Gear",
    href: routes.martialArts,
    description: "Uniforms and gear for academies, clubs, and competition teams.",
    viewAllLabel: "View All Martial Arts Products",
    links: [
      {
        label: "Brazilian Jiu-Jitsu Gis",
        href: routes.bjjGis,
        description: "Academy-ready Brazilian Jiu-Jitsu uniforms.",
        icon: Medal,
      },
      {
        label: "Judo Gis",
        href: routes.judoGis,
        description: "Durable judo uniforms built for training programs.",
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
        label: "Rash Guards",
        href: routes.rashGuards,
        description: "Custom rash guards for grappling and academy programs.",
        icon: Shield,
        planned: true,
      },
      {
        label: "Fight Shorts",
        href: routes.fightShorts,
        description: "Custom fight shorts for training, competition, and teams.",
        icon: Shield,
        planned: true,
      },
      {
        label: "Training Apparel",
        href: routes.martialArtsTrainingApparel,
        description: "Team apparel for martial arts clubs and events.",
        icon: Shirt,
      },
      {
        label: "Martial Arts Patches",
        href: routes.martialArtsPatches,
        description: "Uniform-ready patches for academies, belts, and teams.",
        icon: Palette,
        planned: true,
      },
    ],
  },
  {
    id: "accessories",
    label: "Accessories & Specialty Products",
    href: routes.accessories,
    description: "Keychains, stickers, scout products, badges, and specialty programs.",
    viewAllLabel: "View All Accessories",
    links: [
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
        label: "Woven Labels",
        href: routes.wovenLabels,
        description: "Custom woven labels for apparel and specialty goods.",
        icon: Layers,
        planned: true,
      },
      {
        label: "Stickers",
        href: routes.stickers,
        description: "Durable sticker sets for packaging and events.",
        icon: Sticker,
      },
      {
        label: "Hat Patches",
        href: routes.hatPatches,
        description: "Patch programs sized for caps, beanies, and headwear.",
        icon: Palette,
        planned: true,
      },
      {
        label: "Custom Badges",
        href: routes.customBadges,
        description: "Badge programs for organizations, events, and teams.",
        icon: Shield,
        planned: true,
      },
    ],
  },
] as const satisfies readonly ProductNavigationGroup[];

export const industriesNavigationLinks = [
  { label: "Motorcycle Clubs", href: routes.motorcycleClubsIndustry, icon: Users },
  { label: "Businesses", href: routes.businessesIndustry, icon: Building2, planned: true },
  { label: "Sports Teams", href: routes.sportsTeamsIndustry, icon: Medal },
  { label: "Schools", href: routes.schoolsIndustry, icon: GraduationCap },
  { label: "Scouts", href: routes.scoutGroupsIndustry, icon: Users },
  { label: "Military", href: routes.militaryIndustry, icon: Shield },
  {
    label: "Police Departments",
    href: routes.policeDepartmentsIndustry,
    icon: Shield,
    planned: true,
  },
  {
    label: "Fire Departments",
    href: routes.fireDepartmentsIndustry,
    icon: Flame,
    planned: true,
  },
  {
    label: "Martial Arts Schools and Academies",
    href: routes.martialArtsSchoolsIndustry,
    icon: Medal,
    planned: true,
  },
  { label: "Events", href: routes.eventsIndustry, icon: Sparkles },
  {
    label: "Clubs and Organizations",
    href: routes.clubsOrganizationsIndustry,
    icon: Users,
    planned: true,
  },
] as const satisfies readonly NavigationLink[];

export const designPricingLinks = [
  {
    label: "AI Design Studio",
    href: routes.aiDesigner,
    description: "Create, preview, and refine custom patch ideas.",
    icon: Sparkles,
    keywords: ["ai design studio", "design studio", "patch designer"],
  },
  {
    label: "Design Your Own Patch",
    href: routes.designYourOwnPatch,
    description: "Start a self-guided patch design path.",
    icon: Palette,
    planned: true,
  },
  {
    label: "Artwork Guidelines",
    href: routes.artworkGuidelines,
    description: "Prepare art files for clean production.",
    icon: ClipboardList,
    planned: true,
  },
  {
    label: "Patch Size Guide",
    href: routes.patchSizeGuide,
    description: "Choose a size that fits your artwork and use case.",
    icon: Ruler,
    planned: true,
  },
  {
    label: "Backing Options",
    href: routes.backingOptions,
    description: "Compare iron-on, sew-on, hook-and-loop, and adhesive backings.",
    icon: Layers,
    planned: true,
  },
  {
    label: "Border Options",
    href: routes.borderOptions,
    description: "Understand merrowed, laser-cut, and specialty borders.",
    icon: Scissors,
    planned: true,
  },
  {
    label: "Color Guide",
    href: routes.colorGuide,
    description: "Plan thread, PVC, print, and apparel color choices.",
    icon: Palette,
    planned: true,
  },
  {
    label: "Get a Quote",
    href: routes.quote,
    description: "Share project details and request pricing.",
    icon: PackageCheck,
  },
  {
    label: "How Pricing Works",
    href: routes.howPricingWorks,
    description: "Learn what affects a custom manufacturing quote.",
    icon: CircleHelp,
    planned: true,
  },
] as const satisfies readonly NavigationLink[];

export const guidesSupportLinks = [
  {
    label: "How It Works",
    href: routes.howItWorks,
    description: "See the path from idea to delivery.",
    icon: ClipboardList,
    planned: true,
  },
  {
    label: "Help Center",
    href: routes.helpCenter,
    description: "Get answers before starting a project.",
    icon: HelpCircle,
    planned: true,
  },
  {
    label: "Frequently Asked Questions",
    href: routes.faq,
    description: "Common answers for artwork, production, and shipping.",
    icon: FileQuestion,
  },
  {
    label: "File Requirements",
    href: routes.fileRequirements,
    description: "Check accepted file types and artwork requirements.",
    icon: ClipboardList,
    planned: true,
  },
  {
    label: "Artwork Guidelines",
    href: routes.artworkGuidelines,
    description: "Prepare art files for clean production.",
    icon: Palette,
    planned: true,
  },
  {
    label: "Production Process",
    href: routes.productionProcess,
    description: "Understand approvals, sampling, and manufacturing steps.",
    icon: PackageCheck,
    planned: true,
  },
  {
    label: "Shipping Information",
    href: routes.shipping,
    description: "Review worldwide delivery planning.",
    icon: Truck,
  },
  {
    label: "Reorder",
    href: routes.reorder,
    description: "Return with a previous order or saved request.",
    icon: Repeat2,
  },
  {
    label: "Contact Support",
    href: routes.contact,
    description: "Talk to the team before starting a request.",
    icon: Handshake,
  },
  {
    label: "Blog / Learning Center",
    href: routes.blog,
    description: "Planning guides and educational resources.",
    icon: Newspaper,
  },
] as const satisfies readonly NavigationLink[];

export const aboutNavigationLinks = [
  {
    label: "About Tam Custom Patches",
    href: routes.about,
    description: "Learn about the company and manufacturing approach.",
    icon: Building2,
  },
  {
    label: "Why Choose Us",
    href: routes.whyChooseUs,
    description: "See what makes the manufacturing experience different.",
    icon: Star,
    planned: true,
  },
  {
    label: "Quality Standards",
    href: routes.qualityStandards,
    description: "Review production and finishing standards.",
    icon: Shield,
    planned: true,
  },
  {
    label: "Our Process",
    href: routes.ourProcess,
    description: "Understand the project flow from artwork to delivery.",
    icon: ClipboardList,
    planned: true,
  },
  {
    label: "Industries We Serve",
    href: routes.industries,
    description: "Browse customer segments and use cases.",
    icon: BriefcaseBusiness,
  },
  {
    label: "Gallery",
    href: routes.gallery,
    description: "Browse project inspiration and proof points.",
    icon: GalleryHorizontal,
  },
  {
    label: "Reviews",
    href: routes.reviews,
    description: "Read customer feedback and proof points.",
    icon: Star,
    planned: true,
  },
  {
    label: "Contact",
    href: routes.contact,
    description: "Reach the team directly.",
    icon: Contact,
  },
] as const satisfies readonly NavigationLink[];

const productOverviewLinks = productNavigationGroups.map((group) => ({
  label: group.label,
  href: group.href,
  description: group.description,
  planned: group.href === routes.activewear ? true : undefined,
}));

export const navigationGroups = [
  {
    id: "products",
    label: "Products",
    href: routes.products,
    description: "Explore custom patches, apparel, activewear, martial arts gear, and accessories.",
    links: productOverviewLinks,
    activeHrefs: productNavigationGroups.map((group) => group.href),
  },
  {
    id: "industries",
    label: "Industries",
    href: routes.industries,
    description: "Find the right manufacturing path by customer segment.",
    links: industriesNavigationLinks,
    activeHrefs: [routes.industries],
  },
  {
    id: "design-pricing",
    label: "Design & Pricing",
    href: routes.designYourOwnPatch,
    description: "Plan artwork, sizing, options, and quote expectations.",
    links: designPricingLinks,
    activeHrefs: [routes.aiDesigner, routes.designYourOwnPatch, routes.quote, "/resources"],
  },
  {
    id: "guides-support",
    label: "Guides & Support",
    href: routes.helpCenter,
    description: "Get help with files, production, shipping, reorders, and learning resources.",
    links: guidesSupportLinks,
    activeHrefs: [routes.helpCenter, routes.faq, routes.shipping, routes.blog, routes.contact],
  },
  {
    id: "about",
    label: "About",
    href: routes.about,
    description: "Learn about Tam Custom Patches, quality standards, reviews, and contact paths.",
    links: aboutNavigationLinks,
    activeHrefs: [routes.about, routes.gallery, routes.reviews, routes.contact],
  },
] as const satisfies readonly NavigationGroup[];

export const productsMegaMenuActions = [
  {
    label: "Explore All Products",
    href: routes.products,
    description: "Browse the complete product range.",
    variant: "link",
    planned: true,
  },
  {
    label: "Design Your Own Patch",
    href: routes.designYourOwnPatch,
    description: "Start the design path.",
    variant: "secondary",
    planned: true,
  },
  {
    label: "Get a Quote",
    href: routes.quote,
    description: "Request pricing for your project.",
    variant: "primary",
  },
] as const satisfies readonly ProductMegaMenuAction[];

export const tabletNavigation = [
  { label: "Products", href: routes.products, planned: true },
  { label: "Industries", href: routes.industries },
  { label: "Design & Pricing", href: routes.designYourOwnPatch, planned: true },
] as const satisfies readonly NavigationLink[];

export const legalNavigationLinks = [
  { label: "Privacy Policy", href: routes.privacy },
  { label: "Terms of Service", href: routes.terms },
  { label: "Accessibility", href: routes.accessibility },
  { label: "Sitemap", href: routes.sitemap },
] as const satisfies readonly NavigationLink[];

export const footerNavigation = [
  {
    title: "Products",
    links: productNavigationGroups.map(({ label, href }) => ({ label, href })),
  },
  {
    title: "Design & Pricing",
    links: [
      designPricingLinks[0],
      designPricingLinks[1],
      designPricingLinks[2],
      designPricingLinks[7],
    ],
  },
  {
    title: "About",
    links: [
      { label: "Industries", href: routes.industries },
      { label: "About", href: routes.about },
      { label: "Gallery", href: routes.gallery },
      { label: "Reviews", href: routes.reviews, planned: true },
      { label: "Contact", href: routes.contact },
    ],
  },
  {
    title: "Guides & Support",
    links: [
      guidesSupportLinks[1],
      guidesSupportLinks[2],
      guidesSupportLinks[6],
      guidesSupportLinks[7],
    ],
  },
] as const satisfies readonly FooterNavigationGroup[];

function getSearchKeywords(item: NavigationLink, extra: readonly string[] = []) {
  return [item.label, item.description ?? "", ...extra, ...(item.keywords ?? [])];
}

const productSearchItems = productNavigationGroups.flatMap((group) =>
  group.links.map((item) => ({
    ...item,
    type: "Products" as const,
    keywords: getSearchKeywords(item, [group.label, group.id]),
  })),
);

const productGroupSearchItems = productNavigationGroups.map((group) => ({
  label: group.label,
  href: group.href,
  description: group.description,
  type: "Product groups" as const,
  keywords: [group.label, group.description, group.id, "products"],
}));

const industrySearchItems = industriesNavigationLinks.map((item) => ({
  ...item,
  type: "Industries" as const,
  keywords: getSearchKeywords(item, ["industries", "who orders"]),
}));

const designPricingSearchItems = designPricingLinks.map((item) => ({
  ...item,
  type: "Design & Pricing" as const,
  keywords: getSearchKeywords(item, ["design", "pricing"]),
}));

const guidesSupportSearchItems = guidesSupportLinks.map((item) => ({
  ...item,
  type: "Guides & Support" as const,
  keywords: getSearchKeywords(item, ["support", "guide"]),
}));

const companySearchItems = aboutNavigationLinks.map((item) => ({
  ...item,
  type: "About" as const,
  keywords: getSearchKeywords(item, ["about", "company"]),
}));

const blogSearchItems = [
  {
    label: "Planning a custom patch order",
    href: `${routes.blog}/planning-a-custom-patch-order`,
    description: "Artwork, size, backing, and quantity planning.",
    icon: Newspaper,
    type: "Blog" as const,
    keywords: ["custom patch order", "artwork", "backing", "quantity"],
    planned: true,
  },
  {
    label: "Choosing materials for team apparel",
    href: `${routes.blog}/choosing-materials-for-team-apparel`,
    description: "A practical guide to apparel programs and finish choices.",
    icon: Newspaper,
    type: "Blog" as const,
    keywords: ["apparel", "materials", "teamwear", "hoodies"],
    planned: true,
  },
  {
    label: "Uniform details that make teams feel professional",
    href: `${routes.blog}/uniform-details-that-make-teams-feel-professional`,
    description: "Planning martial arts uniforms and branded details.",
    icon: Newspaper,
    type: "Blog" as const,
    keywords: ["uniforms", "martial arts", "bjj gi", "academy"],
    planned: true,
  },
] satisfies readonly SearchIndexItem[];

export const searchIndex = [
  ...productSearchItems,
  ...productGroupSearchItems,
  ...industrySearchItems,
  ...designPricingSearchItems,
  ...guidesSupportSearchItems,
  ...companySearchItems,
  ...blogSearchItems,
] as const satisfies readonly SearchIndexItem[];

export const popularSearches = [
  "Embroidered Patches",
  "AI Design Studio",
  "Martial Arts Patches",
  "Team Jerseys",
] as const;
