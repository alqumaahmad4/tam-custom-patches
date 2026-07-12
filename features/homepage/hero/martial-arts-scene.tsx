import { motion } from "framer-motion";

import { martialArtsDetails } from "@/features/homepage/hero/data";
import { toneAccentClasses, toneCardClasses } from "@/features/homepage/hero/hero-classes";
import { useHeroMediaQuery } from "@/features/homepage/hero/use-hero-media-query";
import { motionTokens } from "@/lib/design-tokens";
import { springTransitions } from "@/lib/motion";
import { cn } from "@/lib/utils";

type MartialArtsSceneProps = {
  reducedMotion: boolean;
};

export function MartialArtsScene({ reducedMotion }: MartialArtsSceneProps) {
  const isSceneWide = useHeroMediaQuery("(min-width: 768px)");

  return (
    <div
      className="relative mx-auto aspect-[4/3] w-full max-w-[38rem] [perspective:1100px]"
      aria-hidden="true"
    >
      <div className="bg-foreground/25 absolute inset-x-10 bottom-7 h-12 rounded-full blur-[var(--blur-glass)]" />
      <motion.div
        className="border-gold/35 bg-surface text-foreground shadow-premium absolute top-1/2 left-1/2 w-48 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-lg border p-4 md:w-64 md:p-5"
        initial={reducedMotion ? false : { opacity: 0, y: 28, scale: 0.92 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={
          reducedMotion ? { duration: motionTokens.duration.base } : springTransitions.heroCard
        }
      >
        {!reducedMotion ? (
          <motion.span
            className="bg-surface/60 absolute inset-y-0 -left-1/3 w-16 rotate-12 blur-[var(--blur-glass)]"
            animate={{ x: ["0%", "380%"] }}
            transition={{
              duration: motionTokens.duration.autoDrift,
              repeat: Infinity,
              repeatDelay: 2,
              ease: motionTokens.easing.inOut,
            }}
          />
        ) : null}
        <div className="relative">
          <div className="border-border bg-section-bg mx-auto h-28 w-24 rounded-t-lg border p-3 md:h-40 md:w-36 md:p-4">
            <div className="border-border bg-surface mx-auto mb-4 h-8 w-8 rounded-full border md:mb-5 md:h-10 md:w-10" />
            <div className="grid grid-cols-2 gap-3">
              <span className="border-border bg-surface h-14 rounded-sm border md:h-20" />
              <span className="border-border bg-surface h-14 rounded-sm border md:h-20" />
            </div>
          </div>
          <div className="bg-gold mx-auto -mt-2 h-3 w-32 rounded-full shadow-md md:h-4 md:w-44" />
          <div className="mx-auto mt-2 grid w-28 grid-cols-2 gap-3 md:w-40 md:gap-4">
            <span className="border-border bg-section-bg h-14 rounded-b-lg border md:h-20" />
            <span className="border-border bg-section-bg h-14 rounded-b-lg border md:h-20" />
          </div>
          <div className="bg-gold mt-5 h-1 rounded-full" />
        </div>
      </motion.div>
      {martialArtsDetails.map((detail, index) => {
        const position = isSceneWide ? detail.desktop : detail.mobile;

        return (
          <motion.article
            key={detail.title}
            className={cn(
              "absolute top-1/2 left-1/2 w-32 rounded-lg border p-3 shadow-xl md:w-40",
              toneCardClasses[detail.tone],
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
                : { delay: 0.16 + index * 0.08, ...springTransitions.patchEntry }
            }
          >
            <span
              className={cn(
                "mb-3 inline-flex h-2 w-10 rounded-full",
                toneAccentClasses[detail.tone],
              )}
            />
            <h3 className="text-sm leading-5 font-bold tracking-normal">{detail.title}</h3>
            <p className="text-muted-foreground mt-1 text-xs leading-5">{detail.description}</p>
          </motion.article>
        );
      })}
    </div>
  );
}
