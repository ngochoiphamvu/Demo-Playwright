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

  test('TC09 - Payment Bank Transfer validation (Negative)', async ({ page, homePage, checkoutPage }) => {
    // 1. Đi đến bước Payment (Giả định bạn đã qua bước giỏ hàng và đăng nhập)
    await homePage.cartNavBtn.click();
    await checkoutPage.proceedToCheckoutSteps();
    
    // 2. Điền thông tin Address để vượt qua Bước 3, đi tới Bước 4 (Payment)
    await checkoutPage.fillAddressAndProceed('12345', 'State', 'AL', '42'); 

    // 3. Chọn phương thức thanh toán là Bank Transfer (đổi 'bank-transfer' theo value thực tế trong thẻ <option> nếu cần)
    await page.getByTestId('payment-method').selectOption('bank-transfer');

    // 4. Nhập dữ liệu SAI ĐỊNH DẠNG để kích hoạt validation của Angular
    // Bank Name: Nhập số (giao diện yêu cầu chỉ chữ và khoảng trắng)
    await page.getByTestId('bank_name').fill('Bank 123'); 
    
    // Account Name: Nhập ký tự đặc biệt không được phép
    await page.getByTestId('account_name').fill('My Account @#$'); 
    
    // Account Number: Nhập chữ cái (giao diện yêu cầu chỉ số)
    const accNumberInput = page.getByTestId('account_number');
    await accNumberInput.fill('ABC');
    
    // 5. Blur ô cuối cùng để ép form hiển thị toàn bộ lỗi
    await accNumberInput.blur();

    // 6. Assert các dòng thông báo lỗi xuất hiện chính xác
    await expect(page.locator('text=Bank name can only contain letters and spaces.').last()).toBeVisible();
    await expect(page.locator('text=Account name can contain letters, numbers, spaces, periods, apostrophes, and hyphens.').last()).toBeVisible();
    await expect(page.locator('text=Account number must be numeric.').last()).toBeVisible();
  });
});