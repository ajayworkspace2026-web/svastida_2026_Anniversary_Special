import { test, expect } from "@playwright/test";

test("unknown URL returns a branded 404", async ({ page }) => {
  const response = await page.goto("/this-route-does-not-exist");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: /wrong turn/i })).toBeVisible();
});
