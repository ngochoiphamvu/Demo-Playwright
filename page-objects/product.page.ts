import { Page, Locator, expect } from '@playwright/test';

export class ProductPage {
  readonly page: Page;
  readonly addToCartBtn: Locator;
  readonly quantityInput: Locator;
  readonly increaseQuantityBtn: Locator;
  readonly cartBadge: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addToCartBtn = page.getByTestId('add-to-cart');
    this.increaseQuantityBtn = page.getByTestId('increase-quantity');
    this.quantityInput = page.getByTestId('product-quantity');
    this.cartBadge = page.getByTestId('cart-quantity');
  }

  async increaseQuantity(amount: number) {
    await this.increaseQuantityBtn.click({ clickCount: amount });
  }

  async addToCart() {
    // Click thêm vào giỏ hàng
    await this.addToCartBtn.click();
    
    // Chốt chặn: Đợi API thêm giỏ hàng chạy xong và số lượng trên icon cập nhật
    await expect(this.cartBadge).not.toBeEmpty({ timeout: 30000 });
  }
}