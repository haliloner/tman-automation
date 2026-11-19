import {test, expect} from 'playwright/test';
import { TaskCalculationsConfiguration } from '../pages/TaskCalculationsConfiguration';

test.describe('Task Calculations Configuration ekranının açılması', ()=>{
 let ekran: TaskCalculationsConfiguration;
 
     test.beforeEach(async ({ page }) => {
         ekran = new TaskCalculationsConfiguration(page);
         await ekran.open();

     });


    test('TMAN-XXXX: Task Calculations Configuration listesinde Station filtresine IST yazılıp Filter basılınca Station sütunundaki tüm kayıtlar IST ile başlar', async () => {
        await ekran.filterByStation('IST');
        await ekran.expectColumnAllStartWith('Station', 'IST');
    });

    test('TMAN-XXXX: Task Calculations Configuration listesinde MetaTask Code filtresi uygulanınca MetaTask Code sütunundaki tüm kayıtlar yazılan değerle başlar', async () => {
        await ekran.filterByMetaTaskCode('400Hz1');
        await ekran.expectColumnAllStartWith('MetaTask Code', '400Hz1');
    });

    test('TMAN-XXXX: Task Calculations Configuration listesinde MetaTask Name filtresi uygulanınca MetaTask Name sütunundaki tüm kayıtlar yazılan değerle başlar', async () => {
        await ekran.filterByMetaTaskName('Catering');
        await ekran.expectColumnAllStartWith('MetaTask Name', 'Catering');
    });

    test('TMAN-XXXX: Task Calculations Configuration listesinde Begin Mode filtresinden Tman Mobile seçilince Begin Mode sütunundaki tüm kayıtlar Tman Mobile olur', async () => {
        await ekran.filterByBeginMode('Tman Mobile');
        await ekran.expectColumnAllEqual('Begin Mode', 'Tman Mobile');
    });

    test('TMAN-XXXX: Task Calculations Configuration listesinde End Mode filtresinden Tman Mobile seçilince End Mode sütunundaki tüm kayıtlar Tman Mobile olur', async () => {
        await ekran.filterByEndMode('Tman Mobile');
        await ekran.expectColumnAllEqual('End Mode', 'Tman Mobile');
    });

    test('TMAN-XXXX: Task Calculations Configuration listesinde Clear basılınca önceki filtre kalkar ve yeni filtre tek başına uygulanır', async () => {
        await ekran.filterByStation('IST');
        await ekran.expectColumnAllStartWith('Station', 'IST');

        await ekran.clearFilters();

        await ekran.filterByBeginMode('Tman Mobile');
        await ekran.expectColumnAllEqual('Begin Mode', 'Tman Mobile');
    });
    test('TMAN-XXXX: Task Calculations Configuration listesinde Station filtresi IST uygulanıp Export butonuna basılınca Excel dosyası iner', async () => {
        await ekran.filterByStation('IST');
        await ekran.expectColumnAllStartWith('Station', 'IST');

        const indirme = await ekran.exportList();

        expect(indirme.suggestedFilename()).toContain('.xls');
        expect(await indirme.failure()).toBeNull();
    });
    test('TMAN-XXXX: Task Calculations Configuration listesinde her Status seçeneği uygulanınca liste seçilen statüye uyar ve Clear ile filtre sıfırlanır', async () => {
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
            await ekran.expectNoStatus('Active');
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