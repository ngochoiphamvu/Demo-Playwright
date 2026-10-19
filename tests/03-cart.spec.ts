import { test, expect } from '../fixtures/page-fixtures';

test.describe('Feature: Cart', () => {
  test('TC05 - Add item updates badge (Boundary/UI)', async ({ page, homePage, productPage }) => {
    await homePage.goto();
    await homePage.searchProduct('Pliers');
    await homePage.openFirstProduct();
    await productPage.addToCart();
    
    await expect(homePage.cartBadge).toHaveText('1');
  });
});