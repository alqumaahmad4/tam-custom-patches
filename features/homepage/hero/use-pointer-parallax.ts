import type { PointerEvent } from "react";
import { useMotionValue, useSpring, useTransform } from "framer-motion";

import { springTransitions } from "@/lib/motion";

export function usePointerParallax(enabled: boolean) {
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const smoothX = useSpring(pointerX, springTransitions.heroCard);
  const smoothY = useSpring(pointerY, springTransitions.heroCard);
  const rotateY = useTransform(smoothX, [-1, 1], [-8, 8]);
  const rotateX = useTransform(smoothY, [-1, 1], [6, -6]);

  function handlePointerMove(event: PointerEvent<HTMLElement>) {
    if (!enabled || event.pointerType !== "mouse") {
      return;
    }

    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width;
    const y = (event.clientY - bounds.top) / bounds.height;

    pointerX.set((x - 0.5) * 2);
    pointerY.set((y - 0.5) * 2);
  }

  function handlePointerLeave() {
    pointerX.set(0);
    pointerY.set(0);
  }

  return {
    rotateX,
    rotateY,
    handlePointerMove,
    handlePointerLeave,
  };
}
