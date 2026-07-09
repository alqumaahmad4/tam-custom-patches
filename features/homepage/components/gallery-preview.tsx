import { HomeSection } from "@/features/homepage/components/home-section";
import { PlaceholderVisual } from "@/features/homepage/components/placeholder-visual";
import { galleryPreviewItems } from "@/features/homepage/data";
import { cn } from "@/lib/utils";

const itemSizes = {
  standard: "md:row-span-1",
  wide: "md:col-span-2 md:row-span-1",
  tall: "md:row-span-2",
} as const;

const visualSizes = {
  standard: "min-h-56",
  wide: "min-h-56",
  tall: "min-h-80",
} as const;

export function GalleryPreview() {
  return (
    <HomeSection
      id="gallery-preview"
      eyebrow="Gallery Preview"
      title="A flexible visual grid for project inspiration."
      description="Visual tiles reserve stable space for customer work samples while keeping the layout fast."
      variant="muted"
    >
      <div className="grid auto-rows-[14rem] gap-6 md:grid-cols-3 xl:grid-cols-4">
        {galleryPreviewItems.map((item) => (
          <article
            key={item.title}
            className={cn("overflow-hidden rounded-lg", itemSizes[item.size])}
          >
            <PlaceholderVisual
              label={item.label}
              tone={item.tone}
              className={cn("h-full min-h-full", visualSizes[item.size])}
            />
          </article>
        ))}
      </div>
    </HomeSection>
  );
}
