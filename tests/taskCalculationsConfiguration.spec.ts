import {test} from 'playwright/test';
import { TaskCalculationsConfiguration } from '../pages/TaskCalculationsConfiguration';

test.describe('Task Calculations Configuration ekranının açılması', ()=>{
 let ekran: TaskCalculationsConfiguration;
 
     test.beforeEach(async ({ page }) => {
         ekran = new TaskCalculationsConfiguration(page);
         await ekran.open();

     });

test('Task Calculations Configuration sayfası açılır ve liste yüklenir', async () => {
        await ekran.expectPageOpened();
        await ekran.expectDataLoaded();
    });

    test('TMAN-XXXX: Task Calculations Configuration ekranında tüm alanlar doldurulup Create ile kaydedilince pencere kapanır', async () => {
        await ekran.openCreate();

        await ekran.fillBeginDate('2026-11-18');
        await ekran.fillEndDate('2026-12-31');
        await ekran.selectStation('IST');
        await ekran.selectMetaTask('Boarding Announce');
        await ekran.selectBeginMode('Tman Mobile');
        await ekran.selectEndMode('Tman Mobile');
        await ekran.checkServiceOptional();
        await ekran.checkHeadsetEnable();
        await ekran.fillCalculationScript('HTEST AUTOMATION SCRIPT');

        await ekran.saveForm();
    });

});