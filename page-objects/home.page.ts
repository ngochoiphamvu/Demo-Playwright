import { Page, Locator } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly searchInput: Locator;
  readonly searchBtn: Locator;
  readonly cartNavBtn: Locator;
  readonly cartBadge: Locator;
  readonly navMenu: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchInput = page.getByTestId('search-query');
    this.searchBtn = page.getByTestId('search-submit');
    this.cartNavBtn = page.getByTestId('nav-cart');
    this.cartBadge = page.getByTestId('cart-quantity');
    this.navMenu = page.getByTestId('nav-menu');
  }

  async goto() {
    await this.page.goto('/');
  }

  async searchProduct(name: string) {
    await this.searchInput.fill(name);
    await this.searchBtn.click();
    await this.page.waitForLoadState('networkidle');
  }

  async openFirstProduct() {
    await this.page.locator('.card img').first().waitFor({ state: 'visible' });
    await Promise.all([
      this.page.waitForURL(/\/product\/.*/, { timeout: 60000 }),
      this.page.locator('.card').first().click()
    ]); }
}