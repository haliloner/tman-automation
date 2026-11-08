import test from 'playwright/test';
import { ProcessAndTasksPage } from '../pages/ProcessAndTasksPage';

test('Process and Task Configuration sayfası açılabilmeli', async ({ page }) => {
    const ekran = new ProcessAndTasksPage(page);
    await ekran.open();
    await ekran.expectPageOpened();
    await ekran.expectDataLoaded();
});