import { test, expect } from "@playwright/test";

test.describe("Profile page", () => {
  test("loads with taste preferences section", async ({ page }) => {
    await page.goto("/profile");
    await expect(page.getByRole("heading", { name: /profile/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: /taste preferences/i })).toBeVisible();
  });

  test("has strength and body dropdowns", async ({ page }) => {
    await page.goto("/profile");
    await expect(page.getByRole("combobox").first()).toBeVisible();
    await expect(page.getByRole("combobox").last()).toBeVisible();
  });

  test("strength options include Any and strength levels", async ({ page }) => {
    await page.goto("/profile");
    const combos = page.getByRole("combobox");
    await combos.first().selectOption("Medium-Full");
    await expect(combos.first()).toHaveValue("Medium-Full");
  });

  test("body options include Any and body levels", async ({ page }) => {
    await page.goto("/profile");
    const combos = page.getByRole("combobox");
    await combos.last().selectOption("Full");
    await expect(combos.last()).toHaveValue("Full");
  });

  test("TrustBlock is present", async ({ page }) => {
    await page.goto("/profile");
    await expect(page.getByText(/we don't sell cigars/i)).toBeVisible();
  });
});
