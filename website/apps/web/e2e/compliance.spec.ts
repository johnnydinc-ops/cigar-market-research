import { test, expect } from "@playwright/test";

test.describe("Compliance page", () => {
  test("loads with main heading", async ({ page }) => {
    await page.goto("/compliance");
    await expect(page.getByRole("heading", { name: /compliance.*disclosure/i })).toBeVisible();
  });

  test("contains we refer we don't sell section", async ({ page }) => {
    await page.goto("/compliance");
    await expect(page.getByRole("heading", { name: /we refer.*we don't sell/i })).toBeVisible();
    await expect(page.getByText(/we do not sell cigars/i)).toBeVisible();
  });

  test("contains affiliate disclosure section", async ({ page }) => {
    await page.goto("/compliance");
    await expect(page.getByRole("heading", { name: /affiliate disclosure/i })).toBeVisible();
  });

  test("contains US only section", async ({ page }) => {
    await page.goto("/compliance");
    await expect(page.getByRole("heading", { name: /US only/i })).toBeVisible();
  });

  test("contains Privacy section", async ({ page }) => {
    await page.goto("/compliance");
    await expect(page.getByRole("heading", { name: /privacy/i })).toBeVisible();
  });
});
