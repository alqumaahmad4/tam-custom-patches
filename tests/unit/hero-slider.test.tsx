import type { ForwardRefExoticComponent, HTMLAttributes, ReactNode, RefAttributes } from "react";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { HeroSlider, heroSlides } from "@/features/homepage/hero";

type MotionProps = HTMLAttributes<HTMLElement> & {
  animate?: unknown;
  children?: ReactNode;
  drag?: unknown;
  dragConstraints?: unknown;
  dragElastic?: unknown;
  exit?: unknown;
  initial?: unknown;
  layout?: unknown;
  onDragEnd?: unknown;
  style?: unknown;
  transition?: unknown;
  variants?: unknown;
  viewport?: unknown;
  whileHover?: unknown;
  whileInView?: unknown;
  whileTap?: unknown;
};
type MockMotionComponent = ForwardRefExoticComponent<MotionProps & RefAttributes<HTMLElement>>;

vi.mock("framer-motion", async () => {
  const React = await import("react");
  const motionComponentCache = new Map<string, MockMotionComponent>();
  const motionPropNames = new Set([
    "animate",
    "drag",
    "dragConstraints",
    "dragElastic",
    "exit",
    "initial",
    "layout",
    "onDragEnd",
    "style",
    "transition",
    "variants",
    "viewport",
    "whileHover",
    "whileInView",
    "whileTap",
  ]);

  function getDomProps(props: Omit<MotionProps, "children">) {
    const domProps: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(props)) {
      if (!motionPropNames.has(key)) {
        domProps[key] = value;
      }
    }

    return domProps;
  }

  function createMotionComponent(tag: string) {
    const cachedComponent = motionComponentCache.get(tag);

    if (cachedComponent) {
      return cachedComponent;
    }

    const Component = React.forwardRef<HTMLElement, MotionProps>(({ children, ...props }, ref) =>
      React.createElement(tag, { ...getDomProps(props), ref }, children),
    );

    Component.displayName = `MockMotion.${tag}`;
    motionComponentCache.set(tag, Component);

    return Component;
  }

  return {
    AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    motion: new Proxy(
      {},
      {
        get: (_target, tag) => (typeof tag === "string" ? createMotionComponent(tag) : undefined),
      },
    ),
    useMotionValue: (initialValue: number) => ({
      get: () => initialValue,
      set: vi.fn(),
    }),
    useReducedMotion: () => false,
    useSpring: (value: unknown) => value,
    useTransform: () => 0,
  };
});

describe("hero slider", () => {
  afterEach(() => {
    cleanup();
    vi.clearAllTimers();
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

  it("allows dot navigation to select another slide", async () => {
    render(<HeroSlider />);

    fireEvent.click(
      screen.getByRole("button", { name: "Show Apparel Built For Your Brand slide" }),
    );

    expect(
      await screen.findByRole("heading", { level: 1, name: "Apparel Built For Your Brand" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Show Apparel Built For Your Brand slide" }),
    ).toHaveAttribute("aria-current", "true");
  });

  it("supports keyboard navigation while focus is inside the hero", async () => {
    render(<HeroSlider />);

    const nextButton = screen.getByRole("button", { name: "Show next hero slide" });
    nextButton.focus();

    fireEvent.keyDown(nextButton, {
      key: "ArrowRight",
    });

    expect(
      await screen.findByRole("heading", { level: 1, name: "Apparel Built For Your Brand" }),
    ).toBeInTheDocument();
    expect(nextButton).toHaveFocus();
  });

  it("auto-advances after seven seconds and pauses after user interaction", () => {
    vi.useFakeTimers();
    render(<HeroSlider />);

    act(() => {
      vi.advanceTimersByTime(7000);
    });

    expect(
      screen.getByRole("heading", { level: 1, name: "Apparel Built For Your Brand" }),
    ).toBeInTheDocument();

    act(() => {
      fireEvent.click(screen.getByRole("button", { name: "Show next hero slide" }));
    });

    expect(
      screen.getByRole("heading", { level: 1, name: "Academy Gear With Presence" }),
    ).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(7000);
    });

    expect(
      screen.getByRole("heading", { level: 1, name: "Academy Gear With Presence" }),
    ).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(10000);
    });

    act(() => {
      vi.advanceTimersByTime(7000);
    });

    expect(
      screen.getByRole("heading", { level: 1, name: "Custom Patches Made Easy" }),
    ).toBeInTheDocument();
  });
});
