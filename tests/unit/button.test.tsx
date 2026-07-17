import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Button } from "@/components/ui/button";
import { premiumButtonTokens } from "@/lib/design-tokens";

const premiumVariants = ["premiumPrimary", "premiumOutline", "premiumGhost"] as const;

describe("shared premium button system", () => {
  it("exposes the three approved premium CTA hierarchy variants", () => {
    for (const variant of premiumVariants) {
      const { unmount } = render(<Button variant={variant}>{variant}</Button>);
      const button = screen.getByRole("button", { name: variant });

      expect(button.className).toContain("premium-button");
      expect(button.className).toContain(
        `premium-button-${variant.replace("premium", "").toLowerCase()}`,
      );
      expect(button.className).toContain("h-[var(--button-premium-height)]");
      expect(button.className).toContain("px-[var(--button-premium-padding-x)]");
      expect(button.className).toContain("text-[length:var(--button-premium-font-size)]");
      expect(button.className).not.toContain("rounded-full");

      unmount();
    }
  });

  it("keeps the shared premium proportions typed for reuse", () => {
    expect(premiumButtonTokens.height).toBe("44px");
    expect(premiumButtonTokens.radius).toBe("8px");
    expect(premiumButtonTokens.paddingX).toBe("16px");
    expect(premiumButtonTokens.iconGap).toBe("6px");
    expect(premiumButtonTokens.gradient.from).toBe("#1A56DB");
    expect(premiumButtonTokens.gradient.highlight).toBe("#27B5E8");
    expect(premiumButtonTokens.gradient.to).toBe("#1E429F");
  });

  it("preserves disabled and loading semantics without replacing the label", () => {
    render(
      <Button type="button" variant="premiumPrimary" loading>
        Saving quote
      </Button>,
    );

    const button = screen.getByRole("button", { name: "Saving quote" });

    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");
    expect(button).toHaveAttribute("data-loading", "true");
  });
});
