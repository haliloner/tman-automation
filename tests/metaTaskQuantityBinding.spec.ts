import { test } from '@playwright/test';
import { MetaTaskQuantityBindingPage } from '../pages/MetaTaskQuantityBindingPage';

test.describe('Meta Task Quantity Binding ekranı', () => {

    let ekran: MetaTaskQuantityBindingPage;

    test.beforeEach(async ({ page }) => {
        ekran = new MetaTaskQuantityBindingPage(page);
        await ekran.open();
    });

    test('TMAN-XXXX: Master Data > Process & Task menüsünden Meta Task Quantity Binding ekranı açılır', async () => {
        await ekran.expectPageOpened();
    });

    test('TMAN-XXXX: Meta Task Quantity Binding ekranı açılınca liste kayıtlarla yüklenir', async () => {
        await ekran.expectDataLoaded();
    });

    test('TMAN-XXXX: Meta Task Quantity Binding ekranında tüm sütun başlıkları görünür', async () => {
        await ekran.expectColumnVisible('Meta Task Code');
        await ekran.expectColumnVisible('Quantity Code');
    });

    test('TMAN-XXXX: Meta Task Quantity Binding listesinde her Status seçeneği uygulanınca liste seçilen statüye uyar ve Clear ile filtre sıfırlanır', async () => {
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

        test('TMAN-XXXX: Meta Task Quantity Binding listesinde Meta Task ve Quantity filtreleri tek tek uygulanınca ilgili sütun filtre değerine eşit olur ve Clear ile sıfırlanır', async () => {
        await ekran.expectDataLoaded();

        await test.step('Meta Task: apu', async () => {
            await ekran.filterByMetaTask('apu');
            await ekran.expectColumnAllEqual('Meta Task Code', 'apu');
            await ekran.clearFilters();
        });

        await test.step('Quantity: dcsBoarded', async () => {
            await ekran.filterByQuantity('dcsBoarded');
            await ekran.expectColumnAllEqual('Quantity Code', 'dcsBoarded');
            await ekran.clearFilters();
        });
    });
});