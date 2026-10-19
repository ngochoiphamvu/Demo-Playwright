import { test as base } from '@playwright/test';
import { LoginPage } from '../page-objects/login.page';
import { HomePage } from '../page-objects/home.page';
import { ProductPage } from '../page-objects/product.page';
import { CheckoutPage } from '../page-objects/checkout.page';

type MyFixtures = {
  loginPage: LoginPage;
  homePage: HomePage;
  productPage: ProductPage;
  checkoutPage: CheckoutPage;
};

export const test = base.extend<MyFixtures>({
  loginPage: async ({ page }, use) => { await use(new LoginPage(page)); },
  homePage: async ({ page }, use) => { await use(new HomePage(page)); },
  productPage: async ({ page }, use) => { await use(new ProductPage(page)); },
  checkoutPage: async ({ page }, use) => { await use(new CheckoutPage(page)); },
});
export { expect } from '@playwright/test';