import { AnnouncementTrustBar } from "@/features/homepage/components/announcement-trust-bar";
import { BlogPreview } from "@/features/homepage/components/blog-preview";
import { FaqPreview } from "@/features/homepage/components/faq-preview";
import { FeaturedCategories } from "@/features/homepage/components/featured-categories";
import { FinalCta } from "@/features/homepage/components/final-cta";
import { GalleryPreview } from "@/features/homepage/components/gallery-preview";
import { IndustriesServed } from "@/features/homepage/components/industries-served";
import { SimpleProcess } from "@/features/homepage/components/simple-process";
import { TestimonialsPreview } from "@/features/homepage/components/testimonials-preview";
import { WhyChooseUs } from "@/features/homepage/components/why-choose-us";

export function HomepageFoundation() {
  return (
    <>
      <AnnouncementTrustBar />
      <FeaturedCategories />
      <WhyChooseUs />
      <SimpleProcess />
      <IndustriesServed />
      <GalleryPreview />
      <TestimonialsPreview />
      <FaqPreview />
      <BlogPreview />
      <FinalCta />
    </>
  );
}
