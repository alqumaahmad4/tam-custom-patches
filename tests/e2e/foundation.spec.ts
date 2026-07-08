import { expect, test } from "@playwright/test";

test("renders the Milestone 1 application shell", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Foundation & Repository Setup" })).toBeVisible();
});
