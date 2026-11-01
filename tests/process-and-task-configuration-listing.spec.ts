import { test, expect } from '@playwright/test';

test('TMAN-TC-78: Process And Task Configuration ekranı menüden açılınca kayıt listesi dolu gelir @smoke', async ({ page }) => {
  // 1. Uygulamayı aç (oturum zaten açık, login setup'ta yapıldı)
  await page.goto(process.env.BASE_URL!);

  // 2. Menüden ekrana git: Master Data > Process & Task > Process And Task Configuration
  await page.getByRole('button', { name: 'Master Data' }).click();
  await page.getByRole('menuitem', { name: 'Process & Task' }).click();
  await page.getByRole('menuitem', { name: 'Process And Task Configuration' }).click();

  // 3. Ekran açıldı mı?
  const panel = page.getByRole('tabpanel', { name: 'Process and Task' });
  await expect(panel).toBeVisible();

  // 4. Kayıt listesi geldi mi? (.x-grid-item = ExtJS grid satırı)
  await expect(panel.locator('.x-grid-item').first()).toBeVisible({ timeout: 30000 });
});
