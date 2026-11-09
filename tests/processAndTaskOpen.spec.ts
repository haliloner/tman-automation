import test from 'playwright/test';
import { ProcessAndTasksPage } from '../pages/ProcessAndTasksPage';

test('Process and Task Configuration sayfası açılabilmeli', async ({ page }) => {
    const ekran = new ProcessAndTasksPage(page);
    await ekran.open();
    await ekran.expectPageOpened();
    await ekran.expectDataLoaded();
});

test('TMAN-XXXX: Process And Task Configuration ekranında Create butonuna basılınca kayıt oluşturma penceresi açılır', async ({ page }) => {
    const ekran = new ProcessAndTasksPage(page);
    await ekran.open();
    await ekran.openCreateProcess();
});