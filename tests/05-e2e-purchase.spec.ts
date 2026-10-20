import { test, expect } from '../fixtures/page-fixtures';

test.describe('Feature: E2E Purchase', () => {
  test('TC01 - Full Happy Path Purchase Flow (Smoke)', async ({ page, loginPage, homePage, productPage, checkoutPage }) => {
    // 1. Login
    await loginPage.goto();
    await loginPage.loginSuccessfully('customer@practicesoftwaretesting.com', 'welcome01');
    
    // 2. Browse & Add
    await homePage.goto();
    await homePage.searchProduct('Pliers');
    await homePage.openFirstProduct();
    
    // SỬA: Use productPage to Add to Cart
    await productPage.addToCart();

    // 3. Checkout Steps
    await homePage.cartNavBtn.click();
    await checkoutPage.proceedToCheckoutSteps();
    await checkoutPage.fillAddressAndProceed('700000', 'State', 'Viet Nam', '12');
    await checkoutPage.selectPaymentAndConfirm('cash-on-delivery');

    // 4. Confirm
    await expect(page.getByText('Payment was successful')).toBeVisible({ timeout: 60000 });
  });
});