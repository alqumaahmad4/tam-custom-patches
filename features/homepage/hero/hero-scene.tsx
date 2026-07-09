import type { HeroSceneType } from "@/features/homepage/hero/data";
import { ApparelDeckScene } from "@/features/homepage/hero/apparel-deck-scene";
import { MartialArtsScene } from "@/features/homepage/hero/martial-arts-scene";
import { PatchCardScene } from "@/features/homepage/hero/patch-card-scene";

type HeroSceneProps = {
  scene: HeroSceneType;
  reducedMotion: boolean;
};

export function HeroScene({ scene, reducedMotion }: HeroSceneProps) {
  if (scene === "apparel") {
    return <ApparelDeckScene reducedMotion={reducedMotion} />;
  }

  if (scene === "martialArts") {
    return <MartialArtsScene reducedMotion={reducedMotion} />;
  }

  return <PatchCardScene reducedMotion={reducedMotion} />;
}
