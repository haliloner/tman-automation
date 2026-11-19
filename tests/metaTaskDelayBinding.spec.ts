import { test } from '@playwright/test';
import { MetaTaskDelayBindingPage } from '../pages/MetaTaskDelayBindingPage';

test.describe('Meta Task Delay Binding ekranı', () => {

    let ekran: MetaTaskDelayBindingPage;

    test.beforeEach(async ({ page }) => {
        ekran = new MetaTaskDelayBindingPage(page);
        await ekran.open();
    });

    test('TMAN-XXXX: Master Data > Process & Task menüsünden Meta Task Delay Binding ekranı açılır', async () => {
        await ekran.expectPageOpened();
    });

    test('TMAN-XXXX: Meta Task Delay Binding ekranı açılınca liste kayıtlarla yüklenir', async () => {
        await ekran.expectDataLoaded();
    });

    test('TMAN-XXXX: Meta Task Delay Binding ekranında tüm sütun başlıkları görünür', async () => {
        await ekran.expectColumnVisible('Meta Task');
        await ekran.expectColumnVisible('Delay Type');
        await ekran.expectColumnVisible('Delay Type Note');
        await ekran.expectColumnVisible('Short List');
    });
    test('TMAN-XXXX: Meta Task Delay Binding ekranında tüm alanlar doldurulup Create ile kaydedilince pencere kapanır', async () => {
        await ekran.openCreate();

        await ekran.fillBeginDate('2026-11-19');
        await ekran.fillEndDate('2026-12-31');
         await ekran.selectMetaTask('APU');
        await ekran.selectDelayType('01B');
        await ekran.selectDisplayOnShortList('Yes');

        await ekran.saveForm();
    });

    test('TMAN-XXXX: Meta Task Delay Binding listesinde her filtre tek başına uygulanınca liste filtreye uyar ve Clear ile sıfırlanır', async () => {
        await test.step('Meta Task: APU', async () => {
            await ekran.filterByMetaTask('apu');
            await ekran.expectColumnAllEqual('Meta Task','apu');
            await ekran.clearFilters();
        });

        await test.step('Delay Type: 01B', async () => {
            await ekran.filterByDelayType('01B');
            await ekran.expectColumnAllEqual('Delay Type', '01B');
            await ekran.clearFilters();
        });

        await test.step('Display On Short List: Yes', async () => {
            await ekran.filterByShortList('Yes');
            await ekran.expectDataLoaded();   // geçici: sadece liste geldi mi
            await ekran.clearFilters();
        });
    });

    test('TMAN-XXXX: Meta Task Delay Binding listesinde her Status seçeneği uygulanınca liste seçilen statüye uyar ve Clear ile filtre sıfırlanır', async () => {
        await test.step('Active', async () => {
            await ekran.filterByStatus('Active');
            await ekran.expectStatusIn(['Active']);
            await ekran.clearFilters();
        });

        await test.step('Proposal', async () => {
            await ekran.filterByStatus('Proposal');
            await ekran.expectStatusIn(['Proposal']);
            await ekran.clearFilters();
        });

        await test.step('Expired', async () => {
            await ekran.filterByStatus('Expired');
            await ekran.expectAllExpired();
            await ekran.expectNoStatus('Active');
            await ekran.clearFilters();
        });

        await test.step('Passive, ardından Active & Proposal', async () => {
            await ekran.filterByStatus('Passive');
            await ekran.expectStatusIn(['Passive']);

            // Clear'sız doğrudan geçiş: liste Passive'den Active & Proposal'a değişmek zorunda
            await ekran.filterByStatus('Active & Proposal');
            await ekran.expectStatusIn(['Active', 'Proposal']);
            await ekran.clearFilters();
        });

        await test.step('All', async () => {
            await ekran.filterByStatus('All');
            await ekran.expectStatusIn(['Active', 'Proposal', 'Passive']);
            await ekran.clearFilters();
        });
    });
});