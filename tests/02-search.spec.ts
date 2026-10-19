import { test, expect } from '../fixtures/page-fixtures';

test.describe('Feature: Search', () => {
  test('TC04 - Search with existing keyword (Positive)', async ({ page, homePage }) => {
    await homePage.goto();
    await homePage.searchProduct('Pliers');
    const productCards = page.locator('.card');
    await expect(productCards.first()).toBeVisible();
    await expect(await productCards.count()).toBeGreaterThan(0);
  });
});