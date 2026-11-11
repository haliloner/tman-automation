import { test } from '@playwright/test';
import { ProcessAndTasksPage } from '../pages/ProcessAndTasksPage';

test.describe('Process And Task Configuration ekranı - Status filtresi', () => {

    let ekran: ProcessAndTasksPage;

    test.beforeEach(async ({ page }) => {
        ekran = new ProcessAndTasksPage(page);
        await ekran.open();
        await ekran.expectDataLoaded();
    });

    test('TMAN-XXXX: Process And Task Configuration listesinde Status filtresi Active seçilince Status sütunu iki yönde sıralansa da tüm kayıtlar Active olur', async () => {
        await ekran.filterByStatus('Active');
        await ekran.applyFilter();

        await ekran.expectAllStatus('Active');

        await ekran.sortByStatus();
        await ekran.expectAllStatus('Active');

        await ekran.sortByStatus();
        await ekran.expectAllStatus('Active');
    });

    test('TMAN-XXXX: Process And Task Configuration listesinde Status filtresi Proposal seçilince Status sütunu iki yönde sıralansa da tüm kayıtlar Proposal olur', async () => {
        await ekran.filterByStatus('Proposal');
        await ekran.applyFilter();

        await ekran.expectAllStatus('Proposal');

        await ekran.sortByStatus();
        await ekran.expectAllStatus('Proposal');

        await ekran.sortByStatus();
        await ekran.expectAllStatus('Proposal');
    });

    test('TMAN-XXXX: Process And Task Configuration listesinde Status filtresi Passive seçilince Status sütunu iki yönde sıralansa da tüm kayıtlar Passive olur', async () => {
        await ekran.filterByStatus('Passive');
        await ekran.applyFilter();

        await ekran.expectAllStatus('Passive');

        await ekran.sortByStatus();
        await ekran.expectAllStatus('Passive');

        await ekran.sortByStatus();
        await ekran.expectAllStatus('Passive');
    });

});