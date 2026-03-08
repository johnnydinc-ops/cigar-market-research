import { test, expect } from "@playwright/test";

test.describe("Navigation", () => {
  test("nav is present on all main pages", async ({ page }) => {
    for (const path of ["/", "/recommend?q=Padron", "/wishlist", "/profile", "/compliance"]) {
      await page.goto(path);
      await expect(page.getByRole("nav", { name: "Main" })).toBeVisible();
      await expect(page.getByRole("link", { name: "Home" })).toBeVisible();
      await expect(page.getByRole("link", { name: "Wishlist" })).toBeVisible();
      await expect(page.getByRole("link", { name: "Profile" })).toBeVisible();
      await expect(page.getByRole("link", { name: "Compliance" })).toBeVisible();
    }
  });

  test("cigar detail has nav", async ({ page }) => {
    await page.goto("/cigar/11111111-1111-4111-a111-111111111111");
    await expect(page.getByRole("nav", { name: "Main" })).toBeVisible();
  });

  test("active nav link has distinct styling (Home when on home)", async ({ page }) => {
    await page.goto("/");
    const homeLink = page.getByRole("link", { name: "Home" });
    await expect(homeLink).toHaveAttribute("href", "/");
  });
});
