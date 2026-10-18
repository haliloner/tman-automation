import { Page, expect } from '@playwright/test';

/**
 * Giriş sayfası.
 * Locator'lar codegen kaydından alındı (getByRole = erişilebilirlik adı, en sağlam yöntem).
 * Kimlik bilgileri ASLA koda yazılmaz, .env dosyasından (process.env) gelir.
 */
export class LoginPage {
  constructor(private readonly page: Page) {}

  // --- Locator'lar (ekranda bir şey değişirse sadece burayı düzeltirsin) ---
  private get username() {
    return this.page.getByRole('textbox', { name: 'Username' });
  }
  private get password() {
    return this.page.getByRole('textbox', { name: 'Password' });
  }
  private get loginButton() {
    return this.page.getByRole('button', { name: 'Login' });
  }

  // --- Metotlar (manuel case adımlarına benzer okunur) ---
  async open(appUrl: string) {
    // Uygulama adresini aç; sistem login sayfasına kendisi yönlendirir.
    // (Login sayfası doğrudan açılırsa "donotaddloginpagetofavorites" hatası verir.)
    await this.page.goto(appUrl);
    await expect(this.username).toBeVisible({ timeout: 30_000 });
  }

  async login(user: string, pass: string) {
    await this.username.fill(user);
    await this.password.fill(pass);
    await this.loginButton.click();
  }

  /** Giriş sonrası ana ekranın geldiğini doğrular (üst menüdeki 'Master Data' butonu). */
  async expectLoggedIn() {
    await expect(this.page.getByRole('button', { name: 'Master Data' })).toBeVisible({
      timeout: 45_000,
    });
  }
}