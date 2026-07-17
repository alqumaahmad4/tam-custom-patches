import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import Home from "@/app/page";
import {
  blogPreviewArticles,
  faqItems,
  featuredCategories,
  industriesServed,
  processSteps,
  testimonials,
  trustSignals,
  whyChooseItems,
} from "@/features/homepage/data";
import { trustedLogoHeading, trustedLogoItems } from "@/features/homepage/trust-logos";

describe("homepage foundation", () => {
  it("keeps milestone 4A content editable through data collections", () => {
    expect(trustSignals.map((item) => item.title)).toEqual([
      "Free Artwork",
      "Free Worldwide Shipping",
      "Premium Quality",
      "Satisfaction Guaranteed",
    ]);
    expect(featuredCategories).toHaveLength(6);
    expect(trustedLogoItems).toHaveLength(12);
    expect(whyChooseItems).toHaveLength(7);
    expect(processSteps).toHaveLength(4);
    expect(industriesServed).toHaveLength(11);
    expect(faqItems).toHaveLength(5);
    expect(testimonials).toHaveLength(3);
    expect(blogPreviewArticles).toHaveLength(3);
  });

  it("renders the scoped homepage sections with the premium hero foundation", () => {
    render(<Home />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Custom Patches Made Easy" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: trustedLogoHeading })).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "Trust signals" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "What can we make for you?" })).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Built around premium manufacturing clarity." }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "From idea to worldwide delivery." }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: "Prepared for clubs, teams, agencies, schools, and events.",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "A flexible visual grid for project inspiration." }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "What customers say about the experience." }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Common questions before you start." }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Helpful guides for planning your order." }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Ready to shape your custom manufacturing request?" }),
    ).toBeInTheDocument();
  });

  it("places the trusted logo marquee between the hero and announcement trust bar", () => {
    render(<Home />);

    const heroHeading = screen.getByRole("heading", {
      level: 1,
      name: "Custom Patches Made Easy",
    });
    const trustedLogoHeadingElement = screen.getByRole("heading", {
      level: 2,
      name: trustedLogoHeading,
    });
    const trustSignalsRegion = screen.getByRole("region", { name: "Trust signals" });

    expect(
      heroHeading.compareDocumentPosition(trustedLogoHeadingElement) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    expect(
      trustedLogoHeadingElement.compareDocumentPosition(trustSignalsRegion) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });

  it("renders category, FAQ, and CTA links accessibly", () => {
    render(<Home />);

    const hero = screen
      .getByRole("heading", { level: 1, name: "Custom Patches Made Easy" })
      .closest("section");

    expect(hero).not.toBeNull();
    expect(within(hero as HTMLElement).getByRole("link", { name: "Get a Quote" })).toHaveClass(
      "premium-button-primary",
    );
    expect(
      within(hero as HTMLElement).getByRole("link", { name: "View Featured Categories" }),
    ).toHaveClass("premium-button-outline");

    for (const category of featuredCategories) {
      expect(screen.getByRole("link", { name: `${category.title} category` })).toHaveAttribute(
        "href",
        category.href,
      );
    }

    for (const item of faqItems) {
      expect(screen.getByRole("button", { name: item.question })).toBeInTheDocument();
    }

    const finalCta = screen
      .getByRole("heading", { name: "Ready to shape your custom manufacturing request?" })
      .closest("section");

    expect(finalCta).not.toBeNull();
    const finalQuoteLink = within(finalCta as HTMLElement).getByRole("link", {
      name: "Get a Quote",
    });
    const supportLink = screen.getByRole("link", { name: /talk to support/i });

    expect(finalQuoteLink).toHaveAttribute("href", "/quote");
    expect(finalQuoteLink).toHaveClass("premium-button-primary");
    expect(finalQuoteLink).not.toHaveClass("rounded-full");
    expect(supportLink).toHaveAttribute("href", "/contact");
    expect(supportLink).toHaveClass("premium-button-outline");
    expect(supportLink).not.toHaveClass("rounded-full");

    for (const readPreviewLink of screen.getAllByRole("link", { name: /read preview/i })) {
      expect(readPreviewLink).not.toHaveClass("premium-button");
    }
  });
});
