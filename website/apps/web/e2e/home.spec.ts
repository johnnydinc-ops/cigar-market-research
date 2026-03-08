import { test, expect } from "@playwright/test";

test.describe("Home page", () => {
  test("loads with correct title and trust copy", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: /find cigars you.*like/i })).toBeVisible();
    await expect(page).toHaveTitle(/Cigar|find cigars/i);
    await expect(page.getByText(/don't sell|refer you to retailers/i).first()).toBeVisible();
    await expect(page.getByText(/US-only/i)).toBeVisible();
  });

  test("search form has accessible label and submit", async ({ page }) => {
    await page.goto("/");
    const input = page.getByRole("searchbox", { name: /search for a cigar/i });
    await expect(input).toBeVisible();
    await expect(input).toHaveAttribute("type", "search");
    await expect(page.getByRole("button", { name: /submit search|find similar/i })).toBeVisible();
  });

  test("empty search submit does not navigate", async ({ page }) => {
    await page.goto("/");
    await page.getByPlaceholder(/enter a cigar you like/i).fill("");
    await page.getByRole("button", { name: /submit search|find similar/i }).click({ noWaitAfter: true });
    await expect(page).not.toHaveURL(/\/recommend/);
  });

  test("search with whitespace trims and navigates", async ({ page }) => {
    await page.goto("/");
    const searchbox = page.getByPlaceholder(/enter a cigar you like/i);
    await searchbox.fill("  Padron  ");
    await searchbox.press("Enter");
    await expect(page).toHaveURL(/\/recommend\?q=Padron/, { timeout: 15000 });
  });

  test("TrustBlock is present", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText(/we don't sell cigars/i)).toBeVisible();
  });
});
