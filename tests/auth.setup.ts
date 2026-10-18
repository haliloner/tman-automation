import { test as setup } from '@playwright/test';
import { AUTH_FILE } from '../playwright.config';
import { LoginPage } from '../pages/LoginPage';

/**
 * Tüm testlerden ÖNCE bir kez çalışır: login olur ve oturumu .auth/user.json içine kaydeder.
 * Diğer testler bu oturumu kullanır, her testte tekrar login olmaz.
 */
setup('login ve oturumu kaydet', async ({ page }) => {
  const appUrl = process.env.BASE_URL;
  const user = process.env.TEST_USER;
  const pass = process.env.TEST_PASSWORD;

  if (!appUrl || !user || !pass) {
    throw new Error('BASE_URL, TEST_USER ve TEST_PASSWORD .env dosyasında tanımlı olmalı.');
  }

  const loginPage = new LoginPage(page);
  await loginPage.open(appUrl);
  await loginPage.login(user, pass);
  await loginPage.expectLoggedIn();

  await page.context().storageState({ path: AUTH_FILE });
});