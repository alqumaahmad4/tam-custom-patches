import { motion } from "framer-motion";

import { patchCards } from "@/features/homepage/hero/data";
import { toneAccentClasses, toneCardClasses } from "@/features/homepage/hero/hero-classes";
import { useHeroMediaQuery } from "@/features/homepage/hero/use-hero-media-query";
import { usePointerParallax } from "@/features/homepage/hero/use-pointer-parallax";
import { motionTokens } from "@/lib/design-tokens";
import { springTransitions } from "@/lib/motion";
import { cn } from "@/lib/utils";

type PatchCardSceneProps = {
  reducedMotion: boolean;
};

export function PatchCardScene({ reducedMotion }: PatchCardSceneProps) {
  const isSceneWide = useHeroMediaQuery("(min-width: 640px)");
  const parallax = usePointerParallax(!reducedMotion && isSceneWide);

  return (
    <motion.div
      className="relative mx-auto aspect-[4/3] w-full max-w-[38rem] [perspective:1200px]"
      onPointerMove={parallax.handlePointerMove}
      onPointerLeave={parallax.handlePointerLeave}
      aria-hidden="true"
    >
      <motion.div
        className="absolute inset-0 [transform-style:preserve-3d]"
        style={{ rotateX: parallax.rotateX, rotateY: parallax.rotateY }}
      >
        <div className="bg-foreground/20 absolute inset-x-8 bottom-6 h-14 rounded-full blur-[var(--blur-glass)]" />
        {patchCards.map((card, index) => {
          const position = isSceneWide ? card.desktop : card.mobile;
          const driftOffset = index % 2 === 0 ? -7 : 7;

          return (
            <motion.article
              key={card.title}
              className={cn(
                "shadow-premium absolute top-1/2 left-1/2 w-28 rounded-lg border p-3 sm:w-36 md:w-40",
                "will-change-transform [backface-visibility:hidden] [transform-style:preserve-3d]",
                toneCardClasses[card.tone],
                !isSceneWide && index > 2 ? "hidden" : "block",
              )}
              initial={
                reducedMotion
                  ? false
                  : { opacity: 0, x: 0, y: 24, z: 0, rotateZ: 0, rotateY: 0, scale: 0.86 }
              }
              animate={{
                opacity: 1,
                x: position.x,
                y: position.y,
                z: position.z,
                rotateZ: position.rotateZ,
                rotateY: position.rotateY,
                scale: position.scale,
              }}
              transition={
                reducedMotion
                  ? { duration: motionTokens.duration.base }
                  : { delay: index * 0.06, ...springTransitions.patchEntry }
              }
            >
              <motion.div
                className="space-y-3"
                animate={reducedMotion ? undefined : { y: [0, driftOffset, 0] }}
                transition={{
                  duration: motionTokens.duration.autoDrift + index * 0.25,
                  repeat: Infinity,
                  repeatType: "mirror",
                  ease: motionTokens.easing.inOut,
                }}
              >
                <div
                  className={cn(
                    "grid aspect-square place-items-center rounded-md text-sm font-bold tracking-normal",
                    toneAccentClasses[card.tone],
                  )}
                >
                  {card.title.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-base leading-6 font-bold tracking-normal">{card.title}</h3>
                  <p className="text-muted-foreground mt-1 text-xs leading-5">{card.label}</p>
                </div>
              </motion.div>
            </motion.article>
          );
        })}
      </motion.div>
    </motion.div>
  );
}
