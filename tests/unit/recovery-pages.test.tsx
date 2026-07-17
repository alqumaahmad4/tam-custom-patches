import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import ErrorPage from "@/app/error";
import NotFound from "@/app/not-found";

describe("public recovery page CTAs", () => {
  it("uses the premium hierarchy on the not-found recovery actions", () => {
    render(<NotFound />);

    expect(screen.getByRole("link", { name: /back to homepage/i })).toHaveClass(
      "premium-button-primary",
    );
    expect(screen.getByRole("link", { name: /browse products/i })).toHaveClass(
      "premium-button-outline",
    );
    expect(screen.getByRole("link", { name: /contact us/i })).toHaveClass("premium-button-ghost");
  });

  it("uses a primary retry action and quiet support action on the error page", () => {
    render(<ErrorPage error={new Error("Test")} reset={vi.fn()} />);

    expect(screen.getByRole("button", { name: /try again/i })).toHaveClass(
      "premium-button-primary",
    );
    expect(screen.getByRole("link", { name: /contact us/i })).toHaveClass("premium-button-ghost");
  });
});
