import Link from "next/link";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HomeSection } from "@/features/homepage/components/home-section";
import { faqItems } from "@/features/homepage/data";
import { getLinkPrefetch } from "@/lib/site-config";

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
};

export function FaqPreview() {
  return (
    <HomeSection
      id="faq-preview"
      eyebrow="FAQ Preview"
      title="Common questions before you start."
      description="Five common questions help visitors understand the request process before they reach out."
      variant="muted"
    >
      <div className="bg-card mx-auto max-w-3xl rounded-lg border px-4 shadow-sm sm:px-6">
        <Accordion type="single" collapsible>
          {faqItems.map((item) => (
            <AccordionItem key={item.question} value={item.question}>
              <AccordionTrigger className="text-base font-semibold hover:no-underline">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-base leading-7">
                <p>{item.answer}</p>
                {"cta" in item ? (
                  <Link
                    href={item.cta.href}
                    prefetch={getLinkPrefetch(item.cta.href)}
                    className="text-primary mt-3 inline-flex rounded-sm font-semibold underline-offset-4 hover:underline"
                  >
                    {item.cta.label}
                  </Link>
                ) : null}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </HomeSection>
  );
}
