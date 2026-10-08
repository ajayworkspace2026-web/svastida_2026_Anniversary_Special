import { test, expect } from "@playwright/test";

test("health endpoint responds", async ({ request }) => {
  const response = await request.get("/api/health");
  expect(response.ok()).toBeTruthy();
  await expect(response.json()).resolves.toMatchObject({ ok: true });
});

test("private admin login page is publicly reachable only at the custom route", async ({ page }) => {
  await page.goto("/sree");
  await expect(page.getByRole("heading", { name: /admin sign in/i })).toBeVisible();

  const oldRoute = await page.request.get("/admin/login");
  expect(oldRoute.status()).toBe(404);
});
