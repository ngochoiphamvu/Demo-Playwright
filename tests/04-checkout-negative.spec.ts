import { test, expect } from '../fixtures/page-fixtures';

test.describe('Feature: Checkout Pipeline (Negative)', () => {
  test.beforeEach(async ({ loginPage, homePage, productPage }) => {
    await loginPage.goto();
    await loginPage.loginSuccessfully('customer@practicesoftwaretesting.com', 'welcome01');
    
    await homePage.goto();
    await homePage.searchProduct('Pliers'); 
    
    // 1. Mở trang chi tiết sản phẩm (Đã có wait chuyển URL)
    await homePage.openFirstProduct();
    
    // 2. Tương tác trên trang Product (Đã có wait số lượng giỏ hàng)
    await productPage.addToCart();
  });

  test('TC07 - Address mandatory fields (Negative)', async ({ page, homePage, checkoutPage }) => {
    await homePage.cartNavBtn.click();
    await checkoutPage.proceedToCheckoutSteps();  
    await checkoutPage.fillAddressAndProceed('700000', 'State', 'Viet Nam', '12');
  });
});