import type { Transition, Variants } from "framer-motion";

import { motionTokens } from "@/lib/design-tokens";

const easeOut = [0, 0, 0.2, 1] as [number, number, number, number];
const easeIn = [0.4, 0, 1, 1] as [number, number, number, number];
const easeInOut = [0.4, 0, 0.2, 1] as [number, number, number, number];

export const springTransitions = {
  standard: { type: "spring", stiffness: 300, damping: 28, mass: 1 },
  gentle: { type: "spring", stiffness: 150, damping: 20, mass: 1 },
  bouncy: { type: "spring", stiffness: 400, damping: 22, mass: 0.8 },
  snappy: { type: "spring", stiffness: 500, damping: 32, mass: 0.9 },
  heroCard: { type: "spring", stiffness: 120, damping: 20, mass: 1 },
  patchEntry: { type: "spring", stiffness: 120, damping: 18, mass: 1 },
} as const satisfies Record<string, Transition>;

export const fadeVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: motionTokens.duration.page, ease: easeOut },
  },
  exit: {
    opacity: 0,
    transition: { duration: motionTokens.duration.base, ease: easeIn },
  },
} satisfies Variants;

export const slideUpVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: springTransitions.gentle,
  },
  exit: {
    opacity: 0,
    y: -16,
    transition: { duration: motionTokens.duration.base, ease: easeIn },
  },
} satisfies Variants;

export const slideInVariants = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: springTransitions.standard,
  },
  exit: {
    opacity: 0,
    x: -40,
    transition: { duration: motionTokens.duration.step, ease: easeInOut },
  },
} satisfies Variants;

export const scaleVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: springTransitions.standard,
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: motionTokens.duration.base, ease: easeIn },
  },
} satisfies Variants;

export const staggerContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.12,
    },
  },
} satisfies Variants;

export const staggerItemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: springTransitions.gentle,
  },
} satisfies Variants;

export const pageTransitionVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: motionTokens.duration.page, ease: easeInOut },
  },
  exit: {
    opacity: 0,
    transition: { duration: motionTokens.duration.base, ease: easeIn },
  },
} satisfies Variants;

export const hoverLiftVariants = {
  rest: {
    y: 0,
    scale: 1,
    transition: { duration: motionTokens.duration.base, ease: easeOut },
  },
  hover: {
    y: -4,
    scale: 1.02,
    transition: springTransitions.standard,
  },
  tap: {
    y: 0,
    scale: 0.99,
    transition: { duration: motionTokens.duration.tap, ease: easeOut },
  },
} satisfies Variants;

export const motionVariants = {
  fade: fadeVariants,
  slideUp: slideUpVariants,
  slideIn: slideInVariants,
  scale: scaleVariants,
  staggerContainer: staggerContainerVariants,
  staggerItem: staggerItemVariants,
  pageTransition: pageTransitionVariants,
  hoverLift: hoverLiftVariants,
} as const satisfies Record<string, Variants>;

export function patchCardEntry(index: number) {
  return {
    hidden: { opacity: 0, y: 40, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay: 0.5 + index * 0.08,
        ...springTransitions.patchEntry,
      },
    },
  } satisfies Variants;
}

export const reducedMotionTransition = {
  duration: motionTokens.duration.base,
  ease: easeOut,
} satisfies Transition;

export const reducedMotionVariants = {
  hidden: { opacity: 1, x: 0, y: 0, scale: 1 },
  visible: { opacity: 1, x: 0, y: 0, scale: 1, transition: reducedMotionTransition },
  exit: { opacity: 1, x: 0, y: 0, scale: 1, transition: reducedMotionTransition },
} satisfies Variants;

export function motionSafeVariants(variants: Variants, prefersReducedMotion: boolean) {
  return prefersReducedMotion ? reducedMotionVariants : variants;
}

export function motionSafeTransition(transition: Transition, prefersReducedMotion: boolean) {
  return prefersReducedMotion ? reducedMotionTransition : transition;
}
