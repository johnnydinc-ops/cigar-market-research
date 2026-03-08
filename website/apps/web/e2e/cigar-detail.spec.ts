import { test, expect } from "@playwright/test";

const PADRON_UUID = "11111111-1111-4111-a111-111111111111";

test.describe("Cigar detail page", () => {
  test("loads with deal comparison table for valid id", async ({ page }) => {
    await page.goto(`/cigar/${PADRON_UUID}`);
    await page.waitForLoadState("networkidle");
    await expect(page.getByRole("table")).toBeVisible({ timeout: 10000 });
    await expect(page.getByText("Famous Smoke")).toBeVisible();
  });

  test("table has retailer, price, per stick, freshness, and Shop column", async ({ page }) => {
    await page.goto(`/cigar/${PADRON_UUID}`);
    await page.waitForLoadState("networkidle");
    await expect(page.getByRole("columnheader", { name: /retailer/i })).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole("columnheader", { name: /price/i })).toBeVisible();
    await expect(page.getByRole("link", { name: "Shop" }).first()).toBeVisible();
  });

  test("Back to results link goes to recommend", async ({ page }) => {
    await page.goto(`/cigar/${PADRON_UUID}`);
    await page.getByRole("link", { name: /back to results/i }).click();
    await expect(page).toHaveURL("/recommend");
  });

  test("Add to wishlist button is present", async ({ page }) => {
    await page.goto(`/cigar/${PADRON_UUID}`);
    await page.waitForLoadState("networkidle");
    await expect(
      page.getByText("Add to wishlist").or(page.getByText("In wishlist"))
    ).toBeVisible({ timeout: 8000 });
  });

  test("Deal alert section has email input and Subscribe", async ({ page }) => {
    await page.goto(`/cigar/${PADRON_UUID}`);
    await expect(page.getByRole("heading", { name: /notify me when price drops/i })).toBeVisible({ timeout: 5000 });
    await expect(page.getByRole("textbox", { name: /email/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /subscribe/i })).toBeVisible();
  });

  test("submitting deal alert shows confirmation", async ({ page }) => {
    await page.goto(`/cigar/${PADRON_UUID}`);
    await page.getByRole("textbox", { name: /email/i }).fill("test@example.com");
    await page.getByRole("button", { name: /subscribe/i }).click();
    await expect(page.getByText(/we'll email you/i)).toBeVisible({ timeout: 3000 });
  });

  test("invalid cigar id shows error", async ({ page }) => {
    await page.goto("/cigar/invalid-id-999");
    await page.waitForLoadState("networkidle");
    await expect(page.getByText(/could not load|not found/i)).toBeVisible({ timeout: 10000 });
  });

  test("TrustBlock is present", async ({ page }) => {
    await page.goto(`/cigar/${PADRON_UUID}`);
    await expect(page.getByText(/we don't sell cigars/i)).toBeVisible();
  });
});
