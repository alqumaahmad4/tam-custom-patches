import { routes } from "@/lib/site-config";

export type HeroTheme = "dark" | "warm" | "martial";
export type HeroSceneType = "patches" | "apparel" | "martialArts";
export type HeroTone = "accent" | "gold" | "dark" | "info" | "success" | "neutral";

export type HeroSlide = {
  id: string;
  eyebrow: string;
  title: string;
  titleLines: readonly [string, string];
  description: string;
  primaryCta: {
    label: string;
    href: string;
  };
  secondaryCta: {
    label: string;
    href: string;
  };
  trustItems: readonly string[];
  theme: HeroTheme;
  scene: HeroSceneType;
};

export type ScenePosition = {
  x: number;
  y: number;
  z: number;
  rotateZ: number;
  rotateY: number;
  scale: number;
};

export type HeroPatchCard = {
  title: string;
  label: string;
  tone: HeroTone;
  desktop: ScenePosition;
  mobile: ScenePosition;
};

export type ApparelCard = {
  title: string;
  label: string;
  tone: HeroTone;
  desktop: ScenePosition;
  desktopHover: ScenePosition;
  mobile: ScenePosition;
};

export type MartialArtsDetail = {
  title: string;
  description: string;
  tone: HeroTone;
  desktop: ScenePosition;
  mobile: ScenePosition;
};

export const heroSlides = [
  {
    id: "custom-patches",
    eyebrow: "Worldwide custom manufacturing",
    title: "Custom Patches Made Easy",
    titleLines: ["Custom Patches", "Made Easy"],
    description:
      "Premium embroidered, PVC, woven, chenille, printed, and velcro patch programs with artwork support before production.",
    primaryCta: {
      label: "Get a Quote",
      href: routes.quote,
    },
    secondaryCta: {
      label: "View Featured Categories",
      href: "#featured-categories",
    },
    trustItems: ["Free artwork support", "Premium materials", "Worldwide shipping"],
    theme: "dark",
    scene: "patches",
  },
  {
    id: "custom-apparel",
    eyebrow: "Custom apparel programs",
    title: "Apparel Built For Your Brand",
    titleLines: ["Apparel Built", "For Your Brand"],
    description:
      "Structured apparel requests for teamwear, uniforms, promotional garments, and branded programs that need a polished finish.",
    primaryCta: {
      label: "Get a Quote",
      href: routes.quote,
    },
    secondaryCta: {
      label: "See Homepage Gallery",
      href: "#gallery-preview",
    },
    trustItems: ["Team-ready options", "Clear approvals", "Dedicated support"],
    theme: "warm",
    scene: "apparel",
  },
  {
    id: "martial-arts",
    eyebrow: "Martial arts uniforms and gear",
    title: "Academy Gear With Presence",
    titleLines: ["Academy Gear", "With Presence"],
    description:
      "Premium uniforms, belts, patches, and academy-ready details prepared for schools, teams, events, and training programs.",
    primaryCta: {
      label: "Get a Quote",
      href: routes.quote,
    },
    secondaryCta: {
      label: "Explore Industries",
      href: "#industries-served",
    },
    trustItems: ["Academy-ready details", "Durable finish", "Fast turnaround"],
    theme: "martial",
    scene: "martialArts",
  },
] as const satisfies readonly HeroSlide[];

export const patchCards = [
  {
    title: "Embroidered",
    label: "Raised thread finish",
    tone: "accent",
    desktop: { x: -190, y: -98, z: 70, rotateZ: -13, rotateY: 13, scale: 1.04 },
    mobile: { x: -112, y: -20, z: 45, rotateZ: -8, rotateY: 8, scale: 0.86 },
  },
  {
    title: "PVC",
    label: "Bold flexible detail",
    tone: "dark",
    desktop: { x: 0, y: -132, z: 110, rotateZ: 2, rotateY: 0, scale: 1.14 },
    mobile: { x: 0, y: -42, z: 75, rotateZ: 1, rotateY: 0, scale: 0.96 },
  },
  {
    title: "Woven",
    label: "Fine line artwork",
    tone: "success",
    desktop: { x: 188, y: -86, z: 55, rotateZ: 12, rotateY: -12, scale: 1 },
    mobile: { x: 112, y: -18, z: 40, rotateZ: 8, rotateY: -8, scale: 0.86 },
  },
  {
    title: "Chenille",
    label: "Classic letter texture",
    tone: "gold",
    desktop: { x: -140, y: 116, z: 25, rotateZ: 9, rotateY: 8, scale: 0.92 },
    mobile: { x: -98, y: 80, z: 10, rotateZ: 8, rotateY: 6, scale: 0.74 },
  },
  {
    title: "Printed",
    label: "Full color artwork",
    tone: "info",
    desktop: { x: 48, y: 132, z: 45, rotateZ: -5, rotateY: -4, scale: 0.94 },
    mobile: { x: 0, y: 92, z: 15, rotateZ: -4, rotateY: 0, scale: 0.76 },
  },
  {
    title: "Velcro",
    label: "Ready for uniforms",
    tone: "neutral",
    desktop: { x: 208, y: 92, z: 15, rotateZ: -15, rotateY: -10, scale: 0.86 },
    mobile: { x: 98, y: 80, z: 10, rotateZ: -8, rotateY: -6, scale: 0.74 },
  },
] as const satisfies readonly HeroPatchCard[];

export const apparelCards = [
  {
    title: "Polos",
    label: "Staff ready",
    tone: "accent",
    desktop: { x: -174, y: -34, z: 30, rotateZ: -15, rotateY: 8, scale: 0.94 },
    desktopHover: { x: -220, y: -48, z: 42, rotateZ: -18, rotateY: 10, scale: 0.96 },
    mobile: { x: -96, y: -8, z: 24, rotateZ: -11, rotateY: 5, scale: 0.82 },
  },
  {
    title: "Hoodies",
    label: "Warm layers",
    tone: "dark",
    desktop: { x: -72, y: -68, z: 70, rotateZ: -7, rotateY: 5, scale: 1.03 },
    desktopHover: { x: -92, y: -88, z: 84, rotateZ: -9, rotateY: 6, scale: 1.05 },
    mobile: { x: -42, y: -46, z: 54, rotateZ: -5, rotateY: 4, scale: 0.9 },
  },
  {
    title: "Jackets",
    label: "Team finish",
    tone: "gold",
    desktop: { x: 52, y: -78, z: 100, rotateZ: 2, rotateY: -2, scale: 1.1 },
    desktopHover: { x: 56, y: -108, z: 118, rotateZ: 1, rotateY: -2, scale: 1.12 },
    mobile: { x: 44, y: -54, z: 78, rotateZ: 2, rotateY: -2, scale: 0.96 },
  },
  {
    title: "Uniforms",
    label: "Program sets",
    tone: "success",
    desktop: { x: 156, y: -18, z: 56, rotateZ: 11, rotateY: -8, scale: 0.98 },
    desktopHover: { x: 206, y: -28, z: 68, rotateZ: 14, rotateY: -10, scale: 1 },
    mobile: { x: 98, y: -2, z: 42, rotateZ: 9, rotateY: -5, scale: 0.82 },
  },
  {
    title: "Caps",
    label: "Event extras",
    tone: "info",
    desktop: { x: 22, y: 132, z: 26, rotateZ: -2, rotateY: 0, scale: 0.84 },
    desktopHover: { x: 22, y: 152, z: 34, rotateZ: -2, rotateY: 0, scale: 0.88 },
    mobile: { x: 0, y: 92, z: 20, rotateZ: -2, rotateY: 0, scale: 0.74 },
  },
] as const satisfies readonly ApparelCard[];

export const martialArtsDetails = [
  {
    title: "Uniform cuts",
    description: "Clean academy presentation",
    tone: "neutral",
    desktop: { x: -204, y: -96, z: 58, rotateZ: -7, rotateY: 8, scale: 0.95 },
    mobile: { x: -96, y: -92, z: 36, rotateZ: -5, rotateY: 5, scale: 0.74 },
  },
  {
    title: "Belts",
    description: "Color-ready programs",
    tone: "gold",
    desktop: { x: 196, y: -76, z: 68, rotateZ: 8, rotateY: -8, scale: 0.95 },
    mobile: { x: 96, y: -82, z: 40, rotateZ: 5, rotateY: -5, scale: 0.74 },
  },
  {
    title: "Patch details",
    description: "School identity support",
    tone: "accent",
    desktop: { x: 12, y: 156, z: 62, rotateZ: 1, rotateY: 0, scale: 0.98 },
    mobile: { x: 0, y: 116, z: 38, rotateZ: 1, rotateY: 0, scale: 0.76 },
  },
] as const satisfies readonly MartialArtsDetail[];
