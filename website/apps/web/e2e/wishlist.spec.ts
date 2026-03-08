import { test, expect } from "@playwright/test";

test.describe("Wishlist", () => {
  test("empty wishlist shows empty state", async ({ page }) => {
    await page.goto("/wishlist");
    await expect(page.getByRole("heading", { name: /wishlist/i })).toBeVisible();
    await expect(page.getByText(/no cigars saved yet/i)).toBeVisible();
  });

  test("adding from recommend and visiting wishlist shows item", async ({ page }) => {
    await page.goto("/recommend?q=Padron");
    await page.waitForLoadState("networkidle");
    await page.getByRole("button", { name: /add to wishlist/i }).first().click();
    await page.goto("/wishlist");
    await expect(page.getByText(/Padrón|Padron/i).first()).toBeVisible({ timeout: 5000 });
    await expect(page.getByRole("link", { name: /see best deal/i })).toBeVisible();
  });

  test("wishlist nav shows count after adding", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("link", { name: /wishlist/i })).toContainText("Wishlist");
    await page.goto("/recommend?q=Oliva");
    await page.waitForLoadState("networkidle");
    await page.getByRole("button", { name: /add to wishlist/i }).first().click();
    await expect(page.getByRole("link", { name: /wishlist \(1\)/i })).toBeVisible({ timeout: 3000 });
  });

  test("Remove button removes item from wishlist", async ({ page }) => {
    await page.goto("/recommend?q=Padron");
    await page.waitForLoadState("networkidle");
    await page.getByRole("button", { name: /add to wishlist/i }).first().click();
    await page.goto("/wishlist");
    await expect(page.getByText(/Padrón|Padron/i).first()).toBeVisible();
    await page.getByRole("button", { name: /remove/i }).first().click();
    await expect(page.getByText(/no cigars saved yet/i)).toBeVisible({ timeout: 3000 });
  });

  test("already in wishlist shows In wishlist", async ({ page }) => {
    await page.goto("/recommend?q=Padron");
    await page.waitForLoadState("networkidle");
    const addBtn = page.getByRole("button", { name: /add to wishlist/i }).first();
    await addBtn.waitFor({ state: "visible", timeout: 15000 });
    await addBtn.click();
    await expect(page.getByText("In wishlist").first()).toBeVisible({ timeout: 3000 });
  });
});
