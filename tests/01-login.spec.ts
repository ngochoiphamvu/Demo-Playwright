import { test, expect } from '../fixtures/page-fixtures';

const loginData = [
  { id: 'TC02', type: 'Positive', email: 'customer@practicesoftwaretesting.com', pass: 'welcome01', desc: 'Valid credentials' },
  { id: 'TC03a', type: 'Negative', email: 'invalid_format', pass: 'welcome01', desc: 'Invalid email format' },
  { id: 'TC03b', type: 'Negative', email: 'customer@practicesoftwaretesting.com', pass: 'wrongpass', desc: 'Wrong password' },
];

test.describe('Feature: Login', () => {
  for (const data of loginData) {
    test(`${data.id} - ${data.type} Login: ${data.desc}`, async ({ page, loginPage }) => {
      await loginPage.goto();
      await loginPage.login(data.email, data.pass);
      
      if (data.type === 'Positive') {
        await expect(page.getByRole('heading', { name: 'My account', exact: false })).toBeVisible({ timeout: 15000 });
        await expect(page).toHaveURL(/.*account/);
      } else if (data.email === 'invalid_format') {
        const emailValidationMessage = await loginPage.emailInput.evaluate((el: HTMLInputElement) => el.validationMessage);
        expect(emailValidationMessage).not.toBe('');
      } else {
        await expect(loginPage.loginErrorMsg).toBeVisible();
      }
    });
  }
});