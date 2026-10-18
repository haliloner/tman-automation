import { test, expect } from '@playwright/test';

test('TMAN-XXXX: Process and Task Configuration ekranı açılır @smoke', async ({ page }) => {
  await page.goto(process.env.BASE_URL!);
  await page.getByRole('button', { name: 'Master Data' }).click();
  await page.getByRole('menuitem', { name: 'Process & Task' }).click();
  await page.getByRole('menuitem', { name: 'Process And Task Configuration' }).click();

  const panel = page.getByRole('tabpanel', { name: 'Process and Task' });
  await expect(panel).toBeVisible();
  await expect(panel.getByText('Process and Task Configuration')).toBeVisible();
});
