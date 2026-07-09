import type { HeroTone } from "@/features/homepage/hero/data";

export const toneCardClasses: Record<HeroTone, string> = {
  accent: "border-primary/25 bg-surface text-foreground",
  gold: "border-gold/35 bg-warm text-foreground",
  dark: "border-surface/20 bg-dark-bg text-surface",
  info: "border-info/30 bg-info-light text-foreground",
  success: "border-success/30 bg-success-light text-foreground",
  neutral: "border-border bg-section-bg text-foreground",
};

export const toneAccentClasses: Record<HeroTone, string> = {
  accent: "bg-primary text-primary-foreground",
  gold: "bg-gold text-surface",
  dark: "bg-dark-bg text-surface",
  info: "bg-info text-surface",
  success: "bg-success text-surface",
  neutral: "bg-muted text-muted-foreground",
};
