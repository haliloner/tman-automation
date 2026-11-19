import { test } from '@playwright/test';
import { MetaTaskPage } from '../pages/MetaTaskPage';

test.describe('Meta Task Configuration ekranı', () => {

    let ekran: MetaTaskPage;

    test.beforeEach(async ({ page }) => {
        ekran = new MetaTaskPage(page);
        await ekran.open();
    });

    test('TMAN-XXXX: Master Data > Process & Task menüsünden Meta Task Configuration ekranı açılır', async () => {
        await ekran.expectPageOpened();
    });

    test('TMAN-XXXX: Meta Task Configuration ekranı açılınca liste kayıtlarla yüklenir', async () => {
        await ekran.expectDataLoaded();
    });
    test('TMAN-XXXX: Meta Task Configuration ekranında tüm alanlar doldurulup Create ile kaydedilince pencere kapanır', async () => {
        const kod = 'AUTO' + String(Date.now()).slice(-6);

        await ekran.openCreate();

        await ekran.fillBeginDate('2026-11-19');
        await ekran.fillEndDate('2026-12-31');
        await ekran.fillCode(kod);
        await ekran.fillName('Otomasyon test kaydı ' + kod);
        await ekran.checkOption('Static');
        await ekran.checkOption('Has Upload Image');
        await ekran.checkOption('Add Push Time');

        await ekran.saveForm();
    });

        test('TMAN-XXXX: Meta Task Configuration listesinde Code filtresine tam kod yazılıp Filter basılınca Code sütunundaki tüm kayıtlar bu kodu içerir', async () => {
        await ekran.filterByCode('HTEST');
        await ekran.expectColumnAllContain('Code', 'HTEST');
    });

    test('TMAN-XXXX: Meta Task Configuration listesinde Code filtresine kodun ortasından bir parça yazılınca bu parçayı içeren kayıtlar listelenir', async () => {
        await ekran.filterByCode('HTEST');
        await ekran.expectColumnAllContain('Code', 'HTEST');
    });

        test('TMAN-XXXX: Meta Task Configuration listesinde her Status seçeneği uygulanınca Status sütunu seçilen statüye uyar ve Clear ile filtre sıfırlanır', async () => {
        await test.step('Active & Proposal', async () => {
            await ekran.filterByStatus('Active & Proposal');
            await ekran.expectStatusIn(['Active', 'Proposal']);
            await ekran.clearFilters();
        });

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
            await ekran.clearFilters();
        });

        await test.step('Passive', async () => {
            await ekran.filterByStatus('Passive');
            await ekran.expectStatusIn(['Passive']);
            await ekran.clearFilters();
        });

        await test.step('All', async () => {
            await ekran.filterByStatus('All');
            await ekran.expectStatusIn(['Active', 'Proposal', 'Passive']);
            await ekran.clearFilters();
        });
    });
});