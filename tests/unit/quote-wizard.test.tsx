import type { ForwardRefExoticComponent, HTMLAttributes, ReactNode, RefAttributes } from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { QuoteWizardPage } from "@/features/quote-wizard";
import { QuoteWizard } from "@/features/quote-wizard/components/quote-wizard";
import { useQuoteWizardStore } from "@/features/quote-wizard/store";
import { defaultQuoteWizardValues } from "@/features/quote-wizard/validation";

type MotionProps = HTMLAttributes<HTMLElement> & {
  animate?: unknown;
  children?: ReactNode;
  exit?: unknown;
  initial?: unknown;
  transition?: unknown;
};
type MockMotionComponent = ForwardRefExoticComponent<MotionProps & RefAttributes<HTMLElement>>;

vi.mock("framer-motion", async () => {
  const React = await import("react");
  const motionComponentCache = new Map<string, MockMotionComponent>();
  const motionPropNames = new Set(["animate", "exit", "initial", "transition"]);

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
    AnimatePresence: ({ children }: { children: ReactNode }) => <>{children}</>,
    motion: new Proxy(
      {},
      {
        get: (_target, tag) => (typeof tag === "string" ? createMotionComponent(tag) : undefined),
      },
    ),
    useReducedMotion: () => false,
  };
});

function resetWizardStore() {
  window.sessionStorage.clear();
  useQuoteWizardStore.setState({
    currentStepIndex: 0,
    values: {
      ...defaultQuoteWizardValues,
      artworkFiles: [],
    },
  });
}

function continueWizard() {
  fireEvent.click(screen.getByRole("button", { name: /continue/i }));
}

function chooseProduct(name = "Embroidered Patches") {
  fireEvent.click(screen.getByRole("radio", { name: new RegExp(name, "i") }));
}

async function completeFirstThreeSteps() {
  chooseProduct();
  continueWizard();
  await screen.findByRole("heading", { level: 2, name: "Choose quantity" });
  fireEvent.click(screen.getByRole("radio", { name: "100" }));
  continueWizard();
  await screen.findByRole("heading", { level: 2, name: "Choose size" });
  fireEvent.click(screen.getByRole("radio", { name: '3"' }));
  continueWizard();
  await screen.findByRole("heading", { level: 2, name: "Artwork upload" });
}

describe("quote wizard", () => {
  beforeEach(() => {
    resetWizardStore();
  });

  afterEach(() => {
    resetWizardStore();
  });

  it("blocks step navigation until the current step is valid", async () => {
    render(<QuoteWizard />);

    continueWizard();

    expect(await screen.findByText("Review this step")).toBeInTheDocument();
    expect(screen.getAllByRole("alert")[0]).toHaveTextContent("Choose a product category.");
    expect(
      screen.getByRole("heading", { level: 2, name: "Choose product category" }),
    ).toBeInTheDocument();
  });

  it("keeps the quote page title as the only h1 and renders the wizard step as h2", () => {
    render(<QuoteWizardPage />);

    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(
      screen.getByRole("heading", { level: 1, name: "Build your custom quote" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "Choose product category" }),
    ).toBeInTheDocument();
  });

  it("advances through steps and updates the live summary", async () => {
    render(<QuoteWizard />);

    chooseProduct("PVC Patches");
    continueWizard();

    expect(
      await screen.findByRole("heading", { level: 2, name: "Choose quantity" }),
    ).toBeInTheDocument();
    expect(screen.getAllByText("PVC Patches").length).toBeGreaterThan(1);

    fireEvent.click(screen.getByRole("radio", { name: "250" }));

    expect(screen.getAllByText("250 units").length).toBeGreaterThan(0);
  });

  it("updates pricing when quantity changes", async () => {
    render(<QuoteWizard />);

    chooseProduct();
    continueWizard();

    expect(
      await screen.findByRole("heading", { level: 2, name: "Choose quantity" }),
    ).toBeInTheDocument();
    expect(screen.getAllByText("Select product and quantity").length).toBeGreaterThan(0);

    fireEvent.click(screen.getByRole("radio", { name: "100" }));

    expect(screen.getAllByText(/\$[0-9]/).length).toBeGreaterThan(0);
  });

  it("supports switching products before advancing", () => {
    render(<QuoteWizard />);

    chooseProduct("Embroidered Patches");
    chooseProduct("Hoodies");

    expect(screen.getAllByText("Hoodies").length).toBeGreaterThan(1);
  });

  it("handles mock artwork upload metadata", async () => {
    render(<QuoteWizard />);

    await completeFirstThreeSteps();

    const fileInput = screen.getByLabelText("Browse artwork files");
    const file = new File(["artwork"], "club-logo.svg", { type: "image/svg+xml" });

    fireEvent.change(fileInput, {
      target: {
        files: [file],
      },
    });

    expect(screen.getByText("club-logo.svg")).toBeInTheDocument();

    continueWizard();

    expect(
      await screen.findByRole("heading", { level: 2, name: "Customization" }),
    ).toBeInTheDocument();
  });

  it("renders keyboard-focusable radio cards and the mobile summary disclosure", () => {
    render(<QuoteWizard />);

    const productButton = screen.getByRole("radio", { name: /Chenille Patches/i });

    productButton.focus();

    expect(productButton).toHaveFocus();
    const mobileSummaryText = screen
      .getAllByText(/Step 1 of 6/i)
      .find((element) => element.closest("summary"));

    expect(mobileSummaryText?.closest("details")).toBeInTheDocument();
  });

  it("uses checked radio state for card selections and supports keyboard movement", () => {
    render(<QuoteWizard />);

    const embroidered = screen.getByRole("radio", { name: /Embroidered Patches/i });
    const pvc = screen.getByRole("radio", { name: /PVC Patches/i });

    expect(embroidered).toHaveAttribute("aria-checked", "false");

    fireEvent.click(embroidered);

    expect(embroidered).toHaveAttribute("aria-checked", "true");

    embroidered.focus();
    fireEvent.keyDown(embroidered, { key: "ArrowDown" });

    expect(pvc).toHaveFocus();
  });

  it("shows a visible validation summary, moves focus, and keeps the mobile action group reachable", async () => {
    HTMLElement.prototype.scrollIntoView = vi.fn();

    render(<QuoteWizard />);

    expect(
      screen.getByRole("group", { name: "Quote actions and mobile summary" }),
    ).toBeInTheDocument();

    continueWizard();

    const summary = (await screen.findByText("Review this step")).closest('[role="alert"]');

    expect(summary).toHaveTextContent("Choose a product category.");
    await waitFor(() => {
      expect(summary).toHaveFocus();
    });
    expect(HTMLElement.prototype.scrollIntoView).toHaveBeenCalled();
  });
});
