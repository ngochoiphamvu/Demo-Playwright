import { Page, Locator, expect } from '@playwright/test';

export class CheckoutPage {
  readonly page: Page;
  readonly addToCartBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addToCartBtn = page.getByTestId('add-to-cart');
  }

  async proceedToCheckoutSteps() {
    await this.page.getByTestId('proceed-1').click();
    await this.page.getByTestId('proceed-2').waitFor({ state: 'visible' });
    await this.page.getByTestId('proceed-2').click();
  }

  async fillAddressAndProceed(postalCode: string, state: string, country: string, houseNumber: string) {
    await this.page.getByTestId('postal_code').fill(postalCode);
    await this.page.getByTestId('state').fill(state);

    if (country) {
      await this.page.getByTestId('country').selectOption(country); 
    }

    const houseNumberInput = this.page.getByTestId('house_number');
    await houseNumberInput.fill(houseNumber);
    await houseNumberInput.blur(); 

    const proceedBtn = this.page.getByTestId('proceed-3');
    await expect(proceedBtn).toBeEnabled({ timeout: 60000 });
    await proceedBtn.click();
  }

  async selectPaymentAndConfirm(methodValue: string = 'cash-on-delivery') {
    await this.page.getByTestId('payment-method').selectOption(methodValue);
    await this.page.getByTestId('finish').click();
  }
}