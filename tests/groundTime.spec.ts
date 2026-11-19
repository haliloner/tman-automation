import { test,expect } from '@playwright/test';
import { GroundTimeRulePage } from '../pages/GroundTimeRulePage';

test.describe('Ground Time Rule ekranı', () => {

    let ekran: GroundTimeRulePage;

    test.beforeEach(async ({ page }) => {
        ekran = new GroundTimeRulePage(page);
        await ekran.open();
    });

    test('TMAN-XXXX: Master Data > Ground Time menüsünden Ground Time Rule ekranı açılır', async () => {
        await ekran.expectPageOpened();
    });

    test('TMAN-XXXX: Ground Time Rule ekranı açılınca liste kayıtlarla yüklenir', async () => {
        await ekran.expectDataLoaded();
    });

    test('TMAN-XXXX: Ground Time Rule ekranında tüm sütun başlıkları görünür', async () => {
        await ekran.expectColumnVisible('Id');
        await ekran.expectColumnVisible('Conf. Station');
        await ekran.expectColumnVisible('Aircraft Model');
        await ekran.expectColumnVisible('Ac Subtype');
        await ekran.expectColumnVisible('Stand Type');
        await ekran.expectColumnVisible('Traffic Area');
        await ekran.expectColumnVisible('Operation Owner');
        await ekran.expectColumnVisible('Dep. Station');
        await ekran.expectColumnVisible('Arr. Station');
        await ekran.expectColumnVisible('Towing');
        await ekran.expectColumnVisible('Mingt');
        await ekran.expectColumnVisible('Stdgt');
        await ekran.expectColumnVisible('Tagt');
        await ekran.expectColumnVisible('Min. Block Time');
        await ekran.expectColumnVisible('Max. Block Time');
        await ekran.expectColumnVisible('Score');
    });
    test('TMAN-XXXX: Ground Time Rule listesinde her Status seçeneği uygulanınca liste seçilen statüye uyar ve Clear ile filtre sıfırlanır', async () => {
        await ekran.expectDataLoaded();

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

            // Clear'sız geçiş: liste Passive'den Active & Proposal'a değişmek zorunda
            await ekran.filterByStatus('Active & Proposal');
            await ekran.expectStatusIn(['Active', 'Proposal']);
            await ekran.clearFilters();
        });

        await test.step('All', async () => {
            await ekran.filterByStatus('All');
            await ekran.expectHasRows();
            await ekran.expectStatusIn(['Active', 'Proposal', 'Passive']);
            await ekran.clearFilters();
        });
    });

    test('TMAN-XXXX: Ground Time Rule listesinde her filtre tek başına uygulanınca ilgili sütun filtreye uyar ve Clear ile sıfırlanır', async () => {
        await ekran.expectDataLoaded();

        await test.step('ID: 581', async () => {
            await ekran.filterByText('ID', '581');
            await ekran.expectColumnAllEqual('Id', '581');
            await ekran.clearFilters();
        });

        await test.step('Conf. Station: HEL', async () => {
            await ekran.filterByText('Conf. Station', 'HEL');
            await ekran.expectColumnAllEqual('Conf. Station', 'HEL');
            await ekran.clearFilters();
        });

        await test.step('Aircraft Model: 330 içerir', async () => {
            await ekran.filterByText('Aircraft Model', '330');
            await ekran.expectColumnAllContain('Aircraft Model', '330');
            await ekran.clearFilters();
        });

        await test.step('Ac Subtype: HD3 içerir', async () => {
            await ekran.filterByText('Ac Subtype', 'HD3');
            await ekran.expectColumnAllContain('Ac Subtype', 'HD3');
            await ekran.clearFilters();
        });

        await test.step('Stand Type: Aerobridge', async () => {
            await ekran.filterByDropdown('Stand Type', 'Aerobridge');
            await ekran.expectColumnAllEqual('Stand Type', 'Aerobridge');
            await ekran.clearFilters();
        });

        await test.step('Traffic Area: Domestic', async () => {
            await ekran.filterByDropdown('Traffic Area', 'Domestic');
            await ekran.expectColumnAllEqual('Traffic Area', 'Domestic');
            await ekran.clearFilters();
        });

        await test.step('Dep. Station: EZE', async () => {
            await ekran.filterByText('Dep. Station', 'EZE');
            await ekran.expectColumnAllEqual('Dep. Station', 'EZE');
            await ekran.clearFilters();
        });

        await test.step('Arr. Station: TXL', async () => {
            await ekran.filterByText('Arr. Station', 'TXL');
            await ekran.expectColumnAllEqual('Arr. Station', 'TXL');
            await ekran.clearFilters();
        });

        await test.step('Towing: Yes', async () => {
            await ekran.filterByDropdown('Towing', 'Yes');
            await ekran.expectColumnAllEqual('Towing', 'true');
            await ekran.clearFilters();
        });

        await test.step('Operation Owner: TK', async () => {
            await ekran.filterByOperationOwner('TK');
            await ekran.expectColumnAllEqual('Operation Owner', 'TK');
            await ekran.clearFilters();
        });
    });
        test('TMAN-XXXX: Ground Time Rule listesinde Conf. Station filtresi HEL uygulanıp Export butonuna basılınca Excel dosyası iner', async () => {
        await ekran.expectDataLoaded();

        await ekran.filterByText('Conf. Station', 'HEL');
        await ekran.expectColumnAllEqual('Conf. Station', 'HEL');

        const indirme = await ekran.exportList();

        expect(indirme.suggestedFilename()).toContain('.xls');
        expect(await indirme.failure()).toBeNull();
    });
    
});