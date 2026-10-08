import { test, expect } from "@playwright/test";

test("health endpoint responds", async ({ request }) => {
  const response = await request.get("/api/health");
  expect(response.ok()).toBeTruthy();
  await expect(response.json()).resolves.toMatchObject({ ok: true });
});

test("admin login page is publicly reachable", async ({ page }) => {
  await page.goto("/admin/login");
  await expect(page.getByRole("heading", { name: /admin sign in/i })).toBeVisible();
});
