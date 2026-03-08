import { test, expect } from "@playwright/test";

/**
 * Smoke tests: critical paths must load and complete without hard failure.
 */
test.describe("Smoke", () => {
  test("home page loads and shows hero and search", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: /find cigars you.*like/i })).toBeVisible();
    await expect(page.getByPlaceholder(/enter a cigar you like/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /submit search|find similar/i })).toBeVisible();
  });

  test("search submits and navigates to recommend with results", async ({ page }) => {
    await page.goto("/");
    await page.getByPlaceholder(/enter a cigar you like/i).fill("Padron");
    await page.getByPlaceholder(/enter a cigar you like/i).press("Enter");
    await expect(page).toHaveURL(/\/recommend\?q=Padron/i, { timeout: 15000 });
    await page.waitForLoadState("networkidle");
    await expect(page.getByRole("heading", { name: /similar to/i })).toBeVisible();
    await expect(page.getByText(/Padrón|Padron/i).first()).toBeVisible({ timeout: 15000 });
  });

  test("recommend page shows at least one card and link to detail", async ({ page }) => {
    await page.goto("/recommend?q=Oliva");
    await page.waitForLoadState("networkidle");
    const seeDeal = page.getByRole("link", { name: /see best deal/i }).first();
    await expect(seeDeal).toBeVisible({ timeout: 15000 });
    await seeDeal.click();
    await page.waitForURL(/\/cigar\/[a-f0-9-]+/i, { timeout: 10000 });
  });

  test("cigar detail page shows deal table and trust block", async ({ page }) => {
    await page.goto("/recommend?q=Padron");
    await page.waitForLoadState("networkidle");
    const seeDeal = page.getByRole("link", { name: /see best deal/i }).first();
    await seeDeal.waitFor({ state: "visible", timeout: 15000 });
    await seeDeal.click();
    await page.waitForURL(/\/cigar\//, { timeout: 10000 });
    await expect(page.getByRole("table")).toBeVisible({ timeout: 10000 });
    await expect(page.getByText(/we don't sell cigars/i).first()).toBeVisible();
  });

  test("main nav links work", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("nav", { name: "Main" }).getByRole("link", { name: "Wishlist" }).click();
    await expect(page).toHaveURL("/wishlist");
    await page.getByRole("link", { name: "Profile" }).click();
    await expect(page).toHaveURL("/profile");
    await page.getByRole("link", { name: "Compliance" }).click();
    await expect(page).toHaveURL("/compliance");
    await page.getByRole("link", { name: "Home" }).click();
    await expect(page).toHaveURL("/");
  });
});
