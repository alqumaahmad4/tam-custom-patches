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
        className="border-gold/35 bg-surface text-foreground shadow-premium absolute top-1/2 left-1/2 w-56 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-lg border p-5 md:w-64"
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
          <div className="border-border bg-section-bg mx-auto h-36 w-32 rounded-t-lg border p-4 md:h-40 md:w-36">
            <div className="border-border bg-surface mx-auto mb-5 h-10 w-10 rounded-full border" />
            <div className="grid grid-cols-2 gap-3">
              <span className="border-border bg-surface h-20 rounded-sm border" />
              <span className="border-border bg-surface h-20 rounded-sm border" />
            </div>
          </div>
          <div className="bg-gold mx-auto -mt-2 h-4 w-40 rounded-full shadow-md md:w-44" />
          <div className="mx-auto mt-2 grid w-36 grid-cols-2 gap-4 md:w-40">
            <span className="border-border bg-section-bg h-20 rounded-b-lg border" />
            <span className="border-border bg-section-bg h-20 rounded-b-lg border" />
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
              "absolute top-1/2 left-1/2 w-36 rounded-lg border p-3 shadow-xl md:w-40",
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
