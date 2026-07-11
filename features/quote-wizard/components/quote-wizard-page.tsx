import { QuoteWizard } from "@/features/quote-wizard/components/quote-wizard";

const trustItems = ["Free Artwork", "Worldwide Shipping", "Premium Materials", "Fast Turnaround"];

export function QuoteWizardPage() {
  return (
    <div className="bg-background">
      <div className="mx-auto max-w-[var(--container-xl)] px-4 py-12 sm:px-6 lg:px-10 lg:py-16">
        <header className="mb-8 max-w-3xl">
          <p className="text-primary text-xs font-semibold tracking-[var(--letter-spacing-uppercase)] uppercase">
            Get a free quote
          </p>
          <h1 className="mt-3 text-4xl font-bold">Build your custom quote</h1>
          <p className="text-muted-foreground mt-4 text-lg">
            Share product, quantity, size, artwork, and production details in a focused six-step
            flow.
          </p>
          <ul className="mt-5 flex flex-wrap gap-2" aria-label="Quote trust signals">
            {trustItems.map((item) => (
              <li
                key={item}
                className="bg-tag-bg text-primary rounded-full px-3 py-1 text-xs font-semibold"
              >
                {item}
              </li>
            ))}
          </ul>
        </header>
        <QuoteWizard />
      </div>
    </div>
  );
}
