import { describe, expect, it } from "vitest";
import { cn } from "@/lib/utils";

describe("foundation utilities", () => {
  it("merges Tailwind classes predictably", () => {
    expect(cn("px-2", "px-4", false && "hidden")).toBe("px-4");
  });
});
