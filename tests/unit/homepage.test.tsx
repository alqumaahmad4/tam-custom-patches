import { render, screen } from "@testing-library/react";
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

describe("homepage foundation", () => {
  it("keeps milestone 4A content editable through data collections", () => {
    expect(trustSignals.map((item) => item.title)).toEqual([
      "Free Artwork",
      "Free Worldwide Shipping",
      "Premium Quality",
      "Satisfaction Guaranteed",
    ]);
    expect(featuredCategories).toHaveLength(6);
    expect(whyChooseItems).toHaveLength(7);
    expect(processSteps).toHaveLength(4);
    expect(industriesServed).toHaveLength(11);
    expect(faqItems).toHaveLength(5);
    expect(testimonials).toHaveLength(3);
    expect(blogPreviewArticles).toHaveLength(3);
  });

  it("renders the scoped homepage sections without hero or product-page content", () => {
    render(<Home />);

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

  it("renders category, FAQ, and CTA links accessibly", () => {
    render(<Home />);

    for (const category of featuredCategories) {
      expect(screen.getByRole("link", { name: `${category.title} category` })).toHaveAttribute(
        "href",
        category.href,
      );
    }

    for (const item of faqItems) {
      expect(screen.getByRole("button", { name: item.question })).toBeInTheDocument();
    }

    expect(screen.getByRole("link", { name: /start a free quote/i })).toHaveAttribute(
      "href",
      "/quote",
    );
    expect(screen.getByRole("link", { name: /talk to support/i })).toHaveAttribute(
      "href",
      "/contact",
    );
  });
});
