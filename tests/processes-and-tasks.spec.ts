import { test } from '@playwright/test';
import { ProcessesAndTasksPage } from '../pages/ProcessesAndTasksPage';

/**
 * İlk test. Başlıkta Jira case anahtarı olmalı: test('TMAN-1234: ...').
 * Şimdilik yer tutucu; gerçek case numarasıyla değiştir.
 *
 * Case -> kod eşlemesi:
 *   Adım 1: Uygulama açık (oturum auth.setup.ts'ten gelir)
 *   Adım 2: Master Data > Processes and Tasks aç     -> page.open()
 *   Beklenen: Grid yüklenir ve en az bir satır var    -> expectGridHasRows()
 *   Beklenen: Status filtresi 'Active' gelir          -> expectStatusFilterValue('Active')
 */
test.describe('Processes and Tasks', () => {
  test('TMAN-XXXX: grid yüklenir ve satır döner @smoke', async ({ page }) => {
    const processes = new ProcessesAndTasksPage(page);

    // Oturum açık olduğu için ana sayfaya git (BASE_URL .env'den gelir).
    await page.goto('/');

    await processes.open();
    await processes.expectGridHasRows();
  });

  test('TMAN-YYYY: Status filtresi varsayılan olarak Active gelir @smoke', async ({ page }) => {
    const processes = new ProcessesAndTasksPage(page);

    await page.goto('/');
    await processes.open();
    await processes.expectStatusFilterValue('Active');
  });
});
