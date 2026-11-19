import { test,expect } from '@playwright/test';
import { GroundTimeRulePage } from '../pages/GroundTimeRulePage';

test.describe('Ground Time Rule ekranı', () => {

    let ekran: GroundTimeRulePage;

    test.beforeEach(async ({ page }) => {
        ekran = new GroundTimeRulePage(page);
        await ekran.open();
    });


        test('TMAN-XXXX: Ground Time Rule ekranında tüm zorunlu alanlar doldurulup Create ile kaydedilince pencere kapanır', async () => {
        await ekran.openCreate();

        await ekran.fillBeginDate('2026-11-19');
        await ekran.fillEndDate('2026-12-31');

        const istasyon = await ekran.selectByKeyboard('Conf. Station');
        await ekran.selectByKeyboard('Operation Owner');
        await ekran.selectAircraftModel('350');
        await ekran.selectAircraftModel('737');
        await ekran.fillAcSubtype('AUTOMATION HTEST');
        await ekran.selectByKeyboard('Stand Type');
        await ekran.selectByKeyboard('Traffic Area');
        await ekran.selectByKeyboard('Dep. Station');
        await ekran.selectByKeyboard('Arr. Station');
        await ekran.selectByKeyboard('Towing');

        await ekran.fillNumber('Mingt', '30');
        await ekran.fillNumber('Stdgt', '40');
        await ekran.fillNumber('Tagt', '50');
        await ekran.fillNumber('Min. Block Time', '30');
        await ekran.fillNumber('Max. Block Time', '60');

        console.log('Seçilen Conf. Station:', istasyon);

        await ekran.saveForm();
    });

  });