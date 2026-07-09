import { Star } from "lucide-react";

import { HomeSection } from "@/features/homepage/components/home-section";
import { testimonials } from "@/features/homepage/data";

export function TestimonialsPreview() {
  return (
    <HomeSection
      id="testimonials-preview"
      eyebrow="Testimonials Preview"
      title="What customers say about the experience."
      description="Short review cards keep the proof section easy to scan across screen sizes."
    >
      <div className="grid gap-6 lg:grid-cols-3">
        {testimonials.map((testimonial) => (
          <article key={testimonial.name} className="bg-card rounded-lg border p-6 shadow-sm">
            <div aria-label="5 out of 5 stars" className="text-gold flex gap-1">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star key={index} aria-hidden="true" className="size-4 fill-current" />
              ))}
            </div>
            <blockquote className="mt-5">
              <p className="text-base leading-7">&quot;{testimonial.quote}&quot;</p>
            </blockquote>
            <footer className="border-border mt-6 border-t pt-4">
              <p className="font-semibold">{testimonial.name}</p>
              <p className="text-muted-foreground mt-1 text-sm">{testimonial.company}</p>
            </footer>
          </article>
        ))}
      </div>
    </HomeSection>
  );
}
