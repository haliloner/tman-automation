import { test,expect } from '@playwright/test';
import { ProcessAndTasksPage } from '../pages/ProcessAndTasksPage';

test.describe('Process And Task Configuration ekranı - Status filtresi', () => {

    let ekran: ProcessAndTasksPage;

    test.beforeEach(async ({ page }) => {
        ekran = new ProcessAndTasksPage(page);
        await ekran.open();
        await ekran.expectDataLoaded();
    });

    test('TMAN-XXXX: Process And Task Configuration listesinde Status filtresi Active seçilip Filter basılınca ilk ve son sayfadaki tüm kayıtlar Active olur', async () => {
        await ekran.filterByStatus('Active');
        await ekran.applyFilter();

        await ekran.expectAllStatus('Active');

        await ekran.goToLastPage();
        await ekran.expectAllStatus('Active');
    });

    test('TMAN-XXXX: Process And Task Configuration listesinde Status filtresi Proposal seçilip Filter basılınca ilk ve son sayfadaki tüm kayıtlar Proposal olur', async () => {
        await ekran.filterByStatus('Proposal');
        await ekran.applyFilter();

        await ekran.expectAllStatus('Proposal');

        await ekran.goToLastPage();
        await ekran.expectAllStatus('Proposal');
    });

    test('TMAN-XXXX: Process And Task Configuration listesinde Status filtresi Passive seçilip Filter basılınca ilk ve son sayfadaki tüm kayıtlar Passive olur', async () => {
        await ekran.filterByStatus('Passive');
        await ekran.applyFilter();

        await ekran.expectAllStatus('Passive');

        await ekran.goToLastPage();
        await ekran.expectAllStatus('Passive');
    });

       test('TMAN-XXXX: Process And Task Configuration listesinde Station filtresine AMS yazılıp Filter basılınca listelenen tüm satırlar AMS içerir', async () => {
        await ekran.filterByStation('AMS');
        await ekran.applyFilter();
        await ekran.expectAllRowsHaveStation('AMS');
    
    });
    test('TMAN-XXXX: Process And Task Configuration listesinde Flow Type filtresinden Turnaround seçilip Filter basılınca listelenen tüm satırlar Turnaround olur', async () => {
        await ekran.filterByFlowType('Turnaround');
        await ekran.applyFilter();
        await ekran.expectAllRowsHaveText('Turnaround');
    });

    test('TMAN-XXXX: Process And Task Configuration listesinde Aircraft Model filtresine 777 yazılıp Filter basılınca listelenen tüm satırlar 777 içerir', async () => {
        await ekran.filterByAircraftModel('777');
        await ekran.applyFilter();
        await ekran.expectAllRowsContain('777');
    });
    test('TMAN-XXXX: Process And Task Configuration listesinde AC Subtypes filtresine 300 yazılıp Filter basılınca listelenen tüm satırlar 300 içerir', async () => {
        await ekran.filterByAcSubtypes('319');
        await ekran.applyFilter();
        await ekran.expectAllRowsContain('319');
    });

        test('TMAN-XXXX: Process And Task Configuration listesinde Stand Type filtresinden Remote Near seçilip Filter basılınca listelenen tüm satırlar Remote Near olur', async () => {
        await ekran.filterByStandType('Remote Near');
        await ekran.applyFilter();
        await ekran.expectAllRowsHaveText('Remote Near');
    });

    test('TMAN-XXXX: Process And Task Configuration listesinde Traffic Area filtresinden Domestic seçilip Filter basılınca listelenen tüm satırlar Domestic olur', async () => {
        await ekran.filterByTrafficArea('Domestic');
        await ekran.applyFilter();
        await ekran.expectAllRowsHaveText('Domestic');
    });

    test('TMAN-XXXX: Process And Task Configuration listesinde Towing filtresinden Yes seçilip Filter basılınca listelenen tüm satırlar Yes olur', async () => {
        await ekran.filterByTowing('Yes');
        await ekran.applyFilter();
        await ekran.expectAllRowsHaveText('Yes');
    });

        test('TMAN-XXXX: Process And Task Configuration listesinde Operation Owner filtresinden TK seçilip Filter basılınca listelenen tüm satırlar TK olur', async () => {
        await ekran.filterByOperationOwner('TK');
        await ekran.applyFilter();
        await ekran.expectAllRowsHaveText('TK');
    });
    test('TMAN-XXXX: Process And Task Configuration listesinde Origin filtresine AAA yazılıp Filter basılınca listelenen tüm satırlar AAA içerir', async () => {
        await ekran.filterByOrigin('AAA');
        await ekran.applyFilter();
        await ekran.expectAllRowsHaveText('AAA');
    });

    test('TMAN-XXXX: Process And Task Configuration listesinde Destination filtresine AAA yazılıp Filter basılınca listelenen tüm satırlar AAA içerir', async () => {
        await ekran.filterByDestination('AAA');
        await ekran.applyFilter();
        await ekran.expectAllRowsHaveText('AAA');
    });

    test('TMAN-XXXX: Process And Task Configuration listesinde Id filtresine 1390 yazılıp Filter basılınca listede sadece Id 1390 olan kayıt görünür', async () => {
        await ekran.filterById('1390');
        await ekran.applyFilter();
        await ekran.expectAllRowsHaveText('1390');
    });
           test('TMAN-XXXX: Process And Task Configuration listesinde Origin filtresi AAA uygulanıp Export butonuna basılınca Excel dosyası iner', async () => {
        await ekran.filterByOrigin('AAA');
        await ekran.applyFilter();
        await ekran.expectAllRowsHaveText('AAA');

        const indirme = await ekran.exportList();

        expect(indirme.suggestedFilename()).toContain('.xls');
        expect(await indirme.failure()).toBeNull();
    });
});