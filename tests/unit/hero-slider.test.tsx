import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { HeroSlider, heroSlides } from "@/features/homepage/hero";

describe("hero slider", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it("keeps the three Milestone 4B slides editable through data", () => {
    expect(heroSlides.map((slide) => slide.title)).toEqual([
      "Custom Patches Made Easy",
      "Apparel Built For Your Brand",
      "Academy Gear With Presence",
    ]);
    expect(heroSlides).toHaveLength(3);
  });

  it("renders accessible controls for the initial custom patches slide", () => {
    render(<HeroSlider />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Custom Patches Made Easy" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Show previous hero slide" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Show next hero slide" })).toBeInTheDocument();

    for (const slide of heroSlides) {
      expect(screen.getByRole("button", { name: `Show ${slide.title} slide` })).toBeInTheDocument();
    }
  });

  it("allows dot navigation to select another slide", () => {
    render(<HeroSlider />);

    fireEvent.click(
      screen.getByRole("button", { name: "Show Apparel Built For Your Brand slide" }),
    );

    expect(
      screen.getByRole("heading", { level: 1, name: "Apparel Built For Your Brand" }),
    ).toBeInTheDocument();
  });

  it("supports keyboard navigation while focus is inside the hero", () => {
    render(<HeroSlider />);

    fireEvent.keyDown(screen.getByRole("button", { name: "Show next hero slide" }), {
      key: "ArrowRight",
    });

    expect(
      screen.getByRole("heading", { level: 1, name: "Apparel Built For Your Brand" }),
    ).toBeInTheDocument();
  });

  it("auto-advances after seven seconds until the user interacts", () => {
    render(<HeroSlider />);

    act(() => {
      vi.advanceTimersByTime(7000);
    });

    expect(
      screen.getByRole("heading", { level: 1, name: "Apparel Built For Your Brand" }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Show next hero slide" }));

    act(() => {
      vi.advanceTimersByTime(7000);
    });

    expect(
      screen.getByRole("heading", { level: 1, name: "Academy Gear With Presence" }),
    ).toBeInTheDocument();
  });
});
