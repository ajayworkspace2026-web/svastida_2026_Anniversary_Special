import { test, expect } from "@playwright/test";

test("home page renders the luxury storefront shell", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Svastida/i);
  await expect(page.getByRole("link", { name: /SVASTIDA/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: /Wear what feels like you/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /Design with fabric/i })).toBeVisible();
});

test("customer can navigate the core pages", async ({ page }) => {
  for (const path of ["/collections", "/customise", "/about", "/contact", "/cart", "/admin/login"]) {
    await page.goto(path);
    await expect(page.locator("body")).not.toContainText("Application error");
    await expect(page.locator("body")).not.toContainText("Unhandled Runtime Error");
  }
});

test("mobile navigation opens and closes", async ({ page, isMobile }) => {
  test.skip(!isMobile, "mobile-only behavior");
  await page.goto("/");
  const button = page.getByRole("button", { name: /Open navigation/i });
  await button.click();
  await expect(page.locator("#mobile-navigation")).toBeVisible();
  await expect(page.getByRole("button", { name: /Close navigation/i })).toBeVisible();
});

test("cart survives a reload", async ({ page }) => {
  await page.goto("/cart");
  await page.evaluate(() => {
    localStorage.setItem("svastida-cart", JSON.stringify([
      {
        productId: "test-product",
        slug: "test-product",
        name: "Test Dress",
        unitPrice: 2499,
        quantity: 1,
        size: "M",
        measurements: {},
        imageUrl: null,
        aiDesignUrl: null
      }
    ]));
  });
  await page.reload();
  await expect(page.getByText("Test Dress")).toBeVisible();
  await expect(page.getByText(/₹2,499/)).toBeVisible();
});

test("AI designer validates missing fabric without breaking the page", async ({ page }) => {
  await page.goto("/customise");
  await page.getByRole("button", { name: /Generate 4 design concepts/i }).click();
  await expect(page.getByRole("alert")).toContainText(/upload a fabric image/i);
});
