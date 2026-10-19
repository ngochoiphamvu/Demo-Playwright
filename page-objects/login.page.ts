import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginBtn: Locator;
  readonly loginErrorMsg: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByTestId('email');
    this.passwordInput = page.getByTestId('password');
    this.loginBtn = page.getByTestId('login-submit');
    this.loginErrorMsg = page.getByTestId('login-error');
  }

  async goto() {
    await this.page.goto('/auth/login');
  }

  async login(email: string, pass: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(pass);
    
    // Đợi API login phản hồi để đảm bảo không bị click quá nhanh hoặc server lag
    const responsePromise = this.page.waitForResponse(
      response => response.url().includes('/users/login'),
      { timeout: 10000 }
    ).catch(() => null);

    await this.loginBtn.click();
    await responsePromise;
  }
async loginSuccessfully(email: string, pass: string) {
    await Promise.all([
      this.page.waitForURL(/.*account/, { timeout: 15000 }),
      this.login(email, pass)
    ]);
  }
}