import { describe, expect, it } from "vitest";

import {
  motionSafeTransition,
  motionSafeVariants,
  motionVariants,
  patchCardEntry,
  reducedMotionTransition,
  reducedMotionVariants,
  springTransitions,
} from "@/lib/motion";

describe("motion foundation", () => {
  it("exports the eight shared Framer Motion variant groups", () => {
    expect(Object.keys(motionVariants)).toEqual([
      "fade",
      "slideUp",
      "slideIn",
      "scale",
      "staggerContainer",
      "staggerItem",
      "pageTransition",
      "hoverLift",
    ]);
  });

  it("exports all six shared spring transition configs", () => {
    expect(Object.keys(springTransitions)).toEqual([
      "standard",
      "gentle",
      "bouncy",
      "snappy",
      "heroCard",
      "patchEntry",
    ]);
    expect(springTransitions.standard).toMatchObject({
      type: "spring",
      stiffness: 300,
      damping: 28,
      mass: 1,
    });
    expect(springTransitions.patchEntry).toMatchObject({
      type: "spring",
      stiffness: 120,
      damping: 18,
    });
  });

  it("provides the documented patch card stagger entry timing", () => {
    const firstCard = patchCardEntry(0);
    const thirdCard = patchCardEntry(2);

    expect(firstCard.visible.transition).toMatchObject({ delay: 0.5 });
    expect(thirdCard.visible.transition).toMatchObject({ delay: 0.66 });
  });

  it("switches to reduced-motion variants and transitions when requested", () => {
    expect(motionSafeVariants(motionVariants.slideUp, true)).toBe(reducedMotionVariants);
    expect(motionSafeVariants(motionVariants.slideUp, false)).toBe(motionVariants.slideUp);
    expect(motionSafeTransition(springTransitions.standard, true)).toBe(reducedMotionTransition);
    expect(motionSafeTransition(springTransitions.standard, false)).toBe(
      springTransitions.standard,
    );
  });
});
