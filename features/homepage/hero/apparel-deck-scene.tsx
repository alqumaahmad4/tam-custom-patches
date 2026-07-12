import { motion } from "framer-motion";

import { apparelCards } from "@/features/homepage/hero/data";
import { toneAccentClasses, toneCardClasses } from "@/features/homepage/hero/hero-classes";
import { useHeroMediaQuery } from "@/features/homepage/hero/use-hero-media-query";
import { motionTokens } from "@/lib/design-tokens";
import { springTransitions } from "@/lib/motion";
import { cn } from "@/lib/utils";

type ApparelDeckSceneProps = {
  reducedMotion: boolean;
};

export function ApparelDeckScene({ reducedMotion }: ApparelDeckSceneProps) {
  const isSceneWide = useHeroMediaQuery("(min-width: 768px)");

  return (
    <motion.div
      className="relative mx-auto aspect-[4/3] w-full max-w-[38rem] [perspective:1100px]"
      initial="rest"
      animate="rest"
      whileHover={reducedMotion || !isSceneWide ? undefined : "hover"}
      aria-hidden="true"
    >
      <div className="bg-foreground/10 absolute inset-x-10 bottom-8 h-12 rounded-full blur-[var(--blur-glass)]" />
      {apparelCards.map((card, index) => {
        const position = isSceneWide ? card.desktop : card.mobile;
        const hoverPosition = isSceneWide ? card.desktopHover : card.mobile;

        return (
          <motion.article
            key={card.title}
            className={cn(
              "absolute top-1/2 left-1/2 w-28 rounded-lg border p-3 shadow-xl sm:w-32 md:w-36",
              "will-change-transform [backface-visibility:hidden] [transform-style:preserve-3d]",
              toneCardClasses[card.tone],
              !isSceneWide && index > 3 ? "hidden" : "block",
            )}
            variants={{
              rest: {
                opacity: 1,
                x: position.x,
                y: position.y,
                z: position.z,
                rotateZ: position.rotateZ,
                rotateY: position.rotateY,
                scale: position.scale,
              },
              hover: {
                opacity: 1,
                x: hoverPosition.x,
                y: hoverPosition.y,
                z: hoverPosition.z,
                rotateZ: hoverPosition.rotateZ,
                rotateY: hoverPosition.rotateY,
                scale: hoverPosition.scale,
              },
            }}
            initial={
              reducedMotion
                ? false
                : { opacity: 0, x: 0, y: 32, z: 0, rotateZ: 0, rotateY: 0, scale: 0.86 }
            }
            transition={
              reducedMotion
                ? { duration: motionTokens.duration.base }
                : { delay: 0.08 + index * 0.05, ...springTransitions.heroCard }
            }
          >
            <div
              className={cn(
                "mx-auto mb-3 grid h-20 w-16 place-items-center rounded-t-lg border shadow-sm sm:mb-4 sm:h-24 sm:w-20",
                toneAccentClasses[card.tone],
              )}
            >
              <div className="bg-surface/20 h-9 w-9 rounded-full border border-current" />
            </div>
            <h3 className="text-base leading-6 font-bold tracking-normal">{card.title}</h3>
            <p className="text-muted-foreground mt-1 text-xs leading-5">{card.label}</p>
          </motion.article>
        );
      })}
    </motion.div>
  );
}
