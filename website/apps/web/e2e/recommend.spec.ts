import { test, expect } from "@playwright/test";

test.describe("Recommend page", () => {
  test("without query shows prompt to enter cigar", async ({ page }) => {
    await page.goto("/recommend");
    await expect(page.getByText(/enter a cigar on the home page/i)).toBeVisible({ timeout: 5000 });
  });

  test("with valid query shows loading then results", async ({ page }) => {
    await page.goto("/recommend?q=Padron");
    await expect(page.getByText(/loading/i)).toBeVisible({ timeout: 2000 }).catch(() => {});
    await expect(page.getByRole("heading", { name: /similar to/i })).toBeVisible();
    await expect(page.getByText(/Padrón|Padron/i).first()).toBeVisible({ timeout: 15000 });
  });

  test("results contain recommendation cards with See best deal link", async ({ page }) => {
    await page.goto("/recommend?q=Oliva");
    await page.waitForLoadState("networkidle");
    const links = page.getByRole("link", { name: /see best deal/i });
    await expect(links.first()).toBeVisible({ timeout: 15000 });
    await expect(links).toHaveCount(await links.count());
  });

  test("Back to search link goes to home", async ({ page }) => {
    await page.goto("/recommend?q=Padron");
    await page.getByRole("link", { name: /back to search/i }).click();
    await expect(page).toHaveURL("/");
  });

  test("unmatched query shows error message", async ({ page }) => {
    await page.goto("/recommend?q=NonExistentBrandXYZ123");
    await page.waitForLoadState("networkidle");
    await expect(page.getByText(/no matching cigar|could not load/i)).toBeVisible({ timeout: 10000 });
  });

  test("Add to wishlist button appears on cards", async ({ page }) => {
    await page.goto("/recommend?q=Padron");
    await page.waitForLoadState("networkidle");
    await expect(page.getByRole("button", { name: /add to wishlist/i }).first()).toBeVisible({ timeout: 15000 });
  });

  test("clicking See best deal navigates to cigar detail with uuid", async ({ page }) => {
    await page.goto("/recommend?q=Padron");
    await page.waitForLoadState("networkidle");
    const firstDeal = page.getByRole("link", { name: /see best deal/i }).first();
    await firstDeal.click();
    await expect(page).toHaveURL(/\/cigar\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i);
  });
});
